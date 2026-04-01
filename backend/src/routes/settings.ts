import { Router, Request, Response } from "express";
import prisma from "../prismaClient";
import { requireAdmin } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { asyncHandler } from "../middleware/asyncHandler";
import { updateSettingsSchema } from "../lib/validators";

const router = Router();

router.get("/", requireAdmin, asyncHandler(async (_req: Request, res: Response) => {
  let settings = await prisma.settings.findUnique({ where: { id: 1 } });
  if (!settings) settings = await prisma.settings.create({ data: {} });
  res.json(settings);
}));

router.put("/", requireAdmin, validate(updateSettingsSchema), asyncHandler(async (req: Request, res: Response) => {
  const settings = await prisma.settings.upsert({ where: { id: 1 }, update: req.body, create: req.body });
  res.json(settings);
}));

export default router;
