import { Router } from "express";
import { prisma } from "../prisma";
import { requireAuth } from "../middleware/auth";

const router = Router();

// Get all accounts for the authenticated user
router.get("/", requireAuth, async (req, res) => {
  const accounts = await prisma.account.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: "desc" }
  });
  return res.json(accounts);
});

// Create a new account for the authenticated user
router.post("/", requireAuth, async (req, res) => {
  const { name, provider } = req.body;

  if (!name || !provider) {
    return res.status(400).json({ message: "Name and provider are required" });
  }

  const account = await prisma.account.create({
    data: {
      name,
      provider,
      userId: req.userId!
    }
  });

  return res.status(201).json(account);
});

export default router;
