import { Router } from 'express';
import { prisma } from '../prisma';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// GET /accounts - list accounts for authenticated user
router.get('/', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.userId;
  const accounts = await prisma.account.findMany({ where: { userId } });
  res.json(accounts);
});

// POST /accounts - create a new account for the user
router.post('/', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.userId;
  const { name, provider } = req.body;

  if (!name || !provider) {
    return res.status(400).json({ message: 'Name and provider are required' });
  }

  const account = await prisma.account.create({ data: { name, provider, userId } });
  res.status(201).json(account);
});

export default router;
