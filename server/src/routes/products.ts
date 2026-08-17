import { Router } from "express";
import { prisma } from "../prisma";

const router = Router();

// GET /api/products — the prize catalogue.
router.get("/", async (_req, res) => {
  const products = await prisma.product.findMany({ orderBy: { priceTokens: "asc" } });
  res.json(products);
});

export default router;
