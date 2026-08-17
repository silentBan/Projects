import { Router } from "express";
import { prisma } from "../prisma";

const router = Router();

// Shared shape returned by every cart mutation: the items plus the running total.
async function cartPayload() {
  const items = await prisma.cartItem.findMany({
    include: { product: true },
    orderBy: { product: { priceTokens: "asc" } },
  });
  const total = items.reduce((sum, i) => sum + i.product.priceTokens * i.quantity, 0);
  return { items, total };
}

// GET /api/cart
router.get("/", async (_req, res) => res.json(await cartPayload()));

// POST /api/cart { productId, quantity? } — add (or increment) an item.
router.post("/", async (req, res) => {
  const { productId, quantity } = req.body ?? {};
  if (!productId) return res.status(400).json({ error: "productId is required." });

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return res.status(404).json({ error: "Product not found." });

  const qty = Number(quantity) || 1;
  await prisma.cartItem.upsert({
    where: { productId },
    update: { quantity: { increment: qty } },
    create: { productId, quantity: qty },
  });
  res.json(await cartPayload());
});

// PATCH /api/cart/:productId { quantity } — set an exact quantity (0 removes it).
router.patch("/:productId", async (req, res) => {
  const { productId } = req.params;
  const quantity = Number(req.body?.quantity);
  if (!Number.isFinite(quantity)) return res.status(400).json({ error: "quantity must be a number." });

  if (quantity <= 0) {
    await prisma.cartItem.deleteMany({ where: { productId } });
  } else {
    await prisma.cartItem.upsert({
      where: { productId },
      update: { quantity },
      create: { productId, quantity },
    });
  }
  res.json(await cartPayload());
});

// DELETE /api/cart/:productId
router.delete("/:productId", async (req, res) => {
  await prisma.cartItem.deleteMany({ where: { productId: req.params.productId } });
  res.json(await cartPayload());
});

export default router;
