import { Router, Request, Response } from "express";
import prisma from "../prismaClient";
import { requireAdmin } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createPromotionSchema, updatePromotionSchema } from "../lib/validators";
import { sanitizeObject } from "../lib/sanitize";

const router = Router();

// GET /api/promotions — публичный (только активные)
router.get("/", async (_req: Request, res: Response) => {
  const now = new Date();
  const promotions = await prisma.promotion.findMany({
    where: {
      isActive: true,
      OR: [
        { endDate: null },
        { endDate: { gte: now } },
      ],
    },
    orderBy: { createdAt: "desc" },
  });
  res.json(promotions);
});

// GET /api/promotions/all — admin (все)
router.get("/all", requireAdmin, async (_req: Request, res: Response) => {
  const promotions = await prisma.promotion.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.json(promotions);
});

// POST /api/promotions — admin
router.post("/", requireAdmin, validate(createPromotionSchema), async (req: Request, res: Response) => {
  const data = sanitizeObject(req.body);
  const promo = await prisma.promotion.create({
    data: {
      ...data,
      startDate: data.startDate ? new Date(data.startDate as string) : null,
      endDate: data.endDate ? new Date(data.endDate as string) : null,
    } as Parameters<typeof prisma.promotion.create>[0]["data"],
  });
  res.status(201).json(promo);
});

// PUT /api/promotions/:id — admin
router.put("/:id", requireAdmin, validate(updatePromotionSchema), async (req: Request, res: Response) => {
  const data = sanitizeObject(req.body);
  if (data.startDate) data.startDate = new Date(data.startDate as string) as unknown as string;
  if (data.endDate) data.endDate = new Date(data.endDate as string) as unknown as string;

  const promo = await prisma.promotion.update({
    where: { id: Number(req.params.id) },
    data: data as Parameters<typeof prisma.promotion.update>[0]["data"],
  });
  res.json(promo);
});

// DELETE /api/promotions/:id — admin
router.delete("/:id", requireAdmin, async (req: Request, res: Response) => {
  await prisma.promotion.delete({ where: { id: Number(req.params.id) } });
  res.json({ message: "Акция удалена" });
});

export default router;
