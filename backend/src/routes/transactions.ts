import { Router } from "express";
import { prisma } from "../prisma";
import { requireAuth } from "../middleware/auth";
import { guessCategoryName } from "../utils/categorizer";

const router = Router();

// List transactions for the authenticated user
router.get("/", requireAuth, async (req, res) => {
  const transactions = await prisma.transaction.findMany({
    where: { userId: req.userId },
    include: { category: true, account: true },
    orderBy: { date: "desc" }
  });
  return res.json(transactions);
});

// Simple summary endpoint used by the dashboard to compute totals
router.get("/summary", requireAuth, async (req, res) => {
  const transactions = await prisma.transaction.findMany({
    where: { userId: req.userId }
  });

  const income = transactions
    .filter((t) => t.amount.gt(0))
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const expenses = transactions
    .filter((t) => t.amount.lt(0))
    .reduce((sum, t) => sum + Number(t.amount), 0);

  return res.json({ income, expenses, net: income + expenses });
});

// Create a new transaction for the authenticated user
router.post("/", requireAuth, async (req, res) => {
  const { accountId, date, description, amount, categoryId } = req.body;

  if (!accountId || !date || !description || amount === undefined) {
    return res.status(400).json({ message: "accountId, date, description, and amount are required" });
  }

  let resolvedCategoryId = categoryId as number | undefined;
  let isBusiness = false;
  let isPersonal = false;
  let isTaxDeductible = false;

  if (!resolvedCategoryId) {
    const guessed = guessCategoryName(description);
    if (guessed) {
      const category = await prisma.category.findFirst({ where: { name: guessed } });
      if (category) {
        resolvedCategoryId = category.id;
      }
    }
  }

  if (resolvedCategoryId) {
    const category = await prisma.category.findUnique({ where: { id: resolvedCategoryId } });
    if (category) {
      isBusiness = category.type === "business_expense";
      isPersonal = category.type === "personal";
      isTaxDeductible = category.isTaxDeductible;
    }
  }

  const created = await prisma.transaction.create({
    data: {
      accountId: Number(accountId),
      userId: req.userId!,
      date: new Date(date),
      description,
      amount,
      categoryId: resolvedCategoryId,
      isBusiness,
      isPersonal,
      isTaxDeductible
    }
  });

  return res.status(201).json(created);
});

export default router;
