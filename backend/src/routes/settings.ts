import { Router, Request, Response } from "express";
import prisma from "../prismaClient";
import { requireAdmin } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { updateSettingsSchema } from "../lib/validators";

const router = Router();

// GET /api/settings — admin
router.get("/", requireAdmin, async (_req: Request, res: Response) => {
  let settings = await prisma.settings.findUnique({ where: { id: 1 } });
  if (!settings) {
    settings = await prisma.settings.create({ data: {} });
  }
  res.json(settings);
});

// PUT /api/settings — admin
router.put("/", requireAdmin, validate(updateSettingsSchema), async (req: Request, res: Response) => {
  const settings = await prisma.settings.upsert({
    where: { id: 1 },
    update: req.body,
    create: req.body,
  });
  res.json(settings);
});

export default router;
