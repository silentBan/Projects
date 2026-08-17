import { Router } from "express";
import { prisma } from "../prisma";

const router = Router();

// GET /api/orders — redemption history, newest first.
router.get("/", async (_req, res) => {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true } } },
  });
  res.json(orders);
});

export default router;
