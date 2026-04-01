import { Router, Request, Response } from "express";
import prisma from "../prismaClient";
import { requireAdmin } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { asyncHandler } from "../middleware/asyncHandler";
import { createDoctorSchema, updateDoctorSchema } from "../lib/validators";
import { sanitizeObject } from "../lib/sanitize";

const router = Router();

router.get("/", asyncHandler(async (req: Request, res: Response) => {
  const { active } = req.query;
  const where = active === "false" ? {} : { isActive: true };
  const doctors = await prisma.doctor.findMany({ where, orderBy: { name: "asc" } });
  res.json(doctors);
}));

router.get("/:id", asyncHandler(async (req: Request, res: Response) => {
  const doctor = await prisma.doctor.findUnique({ where: { id: Number(req.params.id) } });
  if (!doctor) { res.status(404).json({ error: "Врач не найден" }); return; }
  res.json(doctor);
}));

router.post("/", requireAdmin, validate(createDoctorSchema), asyncHandler(async (req: Request, res: Response) => {
  const doctor = await prisma.doctor.create({ data: sanitizeObject(req.body) });
  res.status(201).json(doctor);
}));

router.put("/:id", requireAdmin, validate(updateDoctorSchema), asyncHandler(async (req: Request, res: Response) => {
  const doctor = await prisma.doctor.update({ where: { id: Number(req.params.id) }, data: sanitizeObject(req.body) });
  res.json(doctor);
}));

router.delete("/:id", requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  await prisma.doctor.delete({ where: { id: Number(req.params.id) } });
  res.json({ message: "Врач удалён" });
}));

export default router;
