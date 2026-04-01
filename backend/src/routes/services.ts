import { Router, Request, Response } from "express";
import prisma from "../prismaClient";
import { requireAdmin } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { asyncHandler } from "../middleware/asyncHandler";
import { createServiceSchema, updateServiceSchema } from "../lib/validators";
import { sanitizeObject } from "../lib/sanitize";

const router = Router();

router.get("/", asyncHandler(async (req: Request, res: Response) => {
  const { category, active } = req.query;
  const where: Record<string, unknown> = {};
  if (active !== "false") where.isActive = true;
  if (category) where.category = category;
  const services = await prisma.service.findMany({ where, orderBy: { category: "asc" } });
  res.json(services);
}));

router.get("/:id", asyncHandler(async (req: Request, res: Response) => {
  const service = await prisma.service.findUnique({ where: { id: Number(req.params.id) } });
  if (!service) { res.status(404).json({ error: "Услуга не найдена" }); return; }
  res.json(service);
}));

router.post("/", requireAdmin, validate(createServiceSchema), asyncHandler(async (req: Request, res: Response) => {
  const service = await prisma.service.create({ data: sanitizeObject(req.body) });
  res.status(201).json(service);
}));

router.put("/:id", requireAdmin, validate(updateServiceSchema), asyncHandler(async (req: Request, res: Response) => {
  const service = await prisma.service.update({ where: { id: Number(req.params.id) }, data: sanitizeObject(req.body) });
  res.json(service);
}));

router.delete("/:id", requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  await prisma.service.delete({ where: { id: Number(req.params.id) } });
  res.json({ message: "Услуга удалена" });
}));

export default router;
