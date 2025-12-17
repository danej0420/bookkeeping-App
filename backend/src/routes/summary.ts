import { Router } from 'express';
import { prisma } from '../prisma';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// GET /summary - aggregate totals for dashboard
router.get('/', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.userId;

  const [income, expenses] = await Promise.all([
    prisma.transaction.aggregate({
      where: { userId, isBusiness: true },
      _sum: { amount: true }
    }),
    prisma.transaction.aggregate({
      where: { userId, isPersonal: true },
      _sum: { amount: true }
    })
  ]);

  const incomeTotal = income._sum.amount ?? 0;
  const expenseTotal = expenses._sum.amount ?? 0;

  res.json({
    income: Number(incomeTotal),
    expense: Number(expenseTotal),
    net: Number(incomeTotal) - Number(expenseTotal)
  });
});

export default router;
