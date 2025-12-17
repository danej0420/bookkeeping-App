import { Router } from 'express';
import { CategoryType } from '@prisma/client';
import { prisma } from '../prisma';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth';
import { categorizeByDescription } from '../utils/categoryRules';

const router = Router();

// GET /transactions - list transactions for the authenticated user
router.get('/', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.userId;
  const transactions = await prisma.transaction.findMany({
    where: { userId },
    include: { category: true, account: true },
    orderBy: { date: 'desc' }
  });
  res.json(transactions);
});

// POST /transactions - create a transaction
router.post('/', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.userId;
  const { accountId, date, description, amount, categoryId } = req.body;

  if (!accountId || !date || !description || !amount) {
    return res.status(400).json({ message: 'accountId, date, description, and amount are required' });
  }

  // Use the helper to infer category flags; this is a stub that can be extended later
  const derived = categorizeByDescription(description);

  let resolvedCategoryId = categoryId as number | undefined;

  // If no categoryId is provided, attempt to find or create a default one for the inferred type
  if (!resolvedCategoryId) {
    const fallbackName = `Auto ${derived.type}`;
    const fallbackCategory = await prisma.category.upsert({
      where: { name: fallbackName },
      update: {},
      create: {
        name: fallbackName,
        type: derived.type,
        isTaxDeductible: derived.type === CategoryType.business_expense
      }
    });
    resolvedCategoryId = fallbackCategory.id;
  }

  const transaction = await prisma.transaction.create({
    data: {
      userId,
      accountId: Number(accountId),
      date: new Date(date),
      description,
      amount: Number(amount),
      categoryId: resolvedCategoryId,
      isBusiness: derived.isBusiness,
      isPersonal: derived.isPersonal,
      isTaxDeductible: derived.type === CategoryType.business_expense
    }
  });

  res.status(201).json(transaction);
});

export default router;
