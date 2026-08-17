import { Router } from "express";
import { prisma } from "../prisma";
import { getWallet } from "../wallet";

const router = Router();

// GET /api/wallet — current token balance.
router.get("/", async (_req, res) => {
  res.json(await getWallet());
});

// POST /api/wallet/topup { amount } — "insert coin".
router.post("/topup", async (req, res) => {
  const amount = Number(req.body?.amount) || 50;
  if (amount <= 0) return res.status(400).json({ error: "Amount must be positive." });

  const wallet = await getWallet();
  const updated = await prisma.wallet.update({
    where: { id: wallet.id },
    data: { balance: wallet.balance + amount },
  });
  res.json(updated);
});

export default router;
