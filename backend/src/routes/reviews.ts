import { Router, Request, Response } from "express";
import prisma from "../prismaClient";
import { requireAdmin } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { asyncHandler } from "../middleware/asyncHandler";
import { reviewLimiter } from "../lib/rateLimiters";
import { createReviewSchema, moderateReviewSchema } from "../lib/validators";
import { sanitizeObject } from "../lib/sanitize";

const router = Router();

router.get("/", asyncHandler(async (req: Request, res: Response) => {
  const { source, page = "1", limit = "20" } = req.query;
  const where: Record<string, unknown> = { isApproved: true, isVisible: true };
  if (source) where.source = source;
  const skip = (Number(page) - 1) * Number(limit);

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: Number(limit) }),
    prisma.review.count({ where }),
  ]);
  res.json({ reviews, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
}));

router.get("/all", requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const { source, isApproved, page = "1", limit = "20" } = req.query;
  const where: Record<string, unknown> = {};
  if (source) where.source = source;
  if (isApproved !== undefined) where.isApproved = isApproved === "true";
  const skip = (Number(page) - 1) * Number(limit);

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: Number(limit) }),
    prisma.review.count({ where }),
  ]);
  res.json({ reviews, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
}));

router.post("/", validate(createReviewSchema), asyncHandler(async (req: Request, res: Response) => {
  const data = sanitizeObject(req.body);
  const review = await prisma.review.create({
    data: { authorName: data.authorName as string, text: data.text as string, rating: data.rating as number, source: "site", isApproved: false },
  });
  res.status(201).json({ message: "Отзыв отправлен на модерацию", review });
}));

router.put("/:id", requireAdmin, validate(moderateReviewSchema), asyncHandler(async (req: Request, res: Response) => {
  const review = await prisma.review.update({ where: { id: Number(req.params.id) }, data: req.body });
  res.json(review);
}));

router.delete("/:id", requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  await prisma.review.delete({ where: { id: Number(req.params.id) } });
  res.json({ message: "Отзыв удалён" });
}));

export default router;
