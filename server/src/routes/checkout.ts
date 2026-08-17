import { Router } from "express";
import { prisma } from "../prisma";
import { getWallet } from "../wallet";

const router = Router();

// POST /api/checkout — turn the cart into an order, deduct tokens, clear the cart.
// Wrapped in a transaction so the order, wallet, and cart stay consistent.
router.post("/", async (_req, res) => {
  const items = await prisma.cartItem.findMany({ include: { product: true } });
  if (items.length === 0) return res.status(400).json({ error: "Cart is empty." });

  const total = items.reduce((sum, i) => sum + i.product.priceTokens * i.quantity, 0);
  const wallet = await getWallet();

  if (total > wallet.balance) {
    // 402 Payment Required — thematically perfect here.
    return res.status(402).json({ error: "Not enough tokens.", shortBy: total - wallet.balance });
  }

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        totalTokens: total,
        items: {
          create: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            priceTokens: i.product.priceTokens,
          })),
        },
      },
      include: { items: { include: { product: true } } },
    });

    await tx.wallet.update({
      where: { id: wallet.id },
      data: { balance: wallet.balance - total },
    });

    await tx.cartItem.deleteMany({});
    return created;
  });

  res.json({ order, balance: wallet.balance - total });
});

export default router;
