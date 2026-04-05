import { Router, Request, Response } from "express";
import prisma from "../prismaClient";
import { requireAdmin } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { asyncHandler } from "../middleware/asyncHandler";
import { createBookingSchema, updateBookingSchema } from "../lib/validators";
import { sanitizeObject } from "../lib/sanitize";
import { broadcast } from "../lib/sse";
import { notifyNewBooking } from "../lib/telegram";
import { sendBookingCreatedSms, sendBookingConfirmedSms, sendBookingCancelledSms } from "../lib/sms";
import logger from "../lib/logger";

const router = Router();

const DAYS_MAP: Record<number, string> = {
  0: "sunday", 1: "monday", 2: "tuesday", 3: "wednesday",
  4: "thursday", 5: "friday", 6: "saturday",
};

function isWithinSchedule(
  schedule: Record<string, { start: string; end: string }> | null,
  date: Date,
  time: string
): { ok: boolean; reason?: string } {
  if (!schedule) return { ok: true }; // нет расписания = принимаем всегда

  const dayName = DAYS_MAP[date.getDay()];
  const daySchedule = schedule[dayName];

  if (!daySchedule) {
    return { ok: false, reason: `Врач не принимает в этот день (${dayName})` };
  }

  if (time < daySchedule.start || time >= daySchedule.end) {
    return { ok: false, reason: `Врач принимает с ${daySchedule.start} до ${daySchedule.end}` };
  }

  return { ok: true };
}

// GET /api/bookings — admin
router.get("/", requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const { status, doctorId, page = "1", limit = "20", search } = req.query;

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (doctorId) where.doctorId = Number(doctorId);
  if (search) {
    where.OR = [
      { patientName: { contains: search as string, mode: "insensitive" } },
      { phone: { contains: search as string } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where, include: { doctor: true, service: true },
      orderBy: { createdAt: "desc" }, skip, take: Number(limit),
    }),
    prisma.booking.count({ where }),
  ]);

  res.json({ bookings, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
}));

// POST /api/bookings — публичный
router.post("/", validate(createBookingSchema), asyncHandler(async (req: Request, res: Response) => {
  const data = sanitizeObject(req.body);
  const { patientName, phone, doctorId, serviceId, date, time, comment } = data;

  // Один номер = одна активная заявка
  const existing = await prisma.booking.findFirst({
    where: { phone: phone as string, status: { in: ["new", "confirmed"] } },
  });
  if (existing) { res.status(400).json({ error: "У вас уже есть активная заявка" }); return; }

  // Проверка врача и услуги
  const [doctor, service] = await Promise.all([
    prisma.doctor.findUnique({ where: { id: Number(doctorId) } }),
    prisma.service.findUnique({ where: { id: Number(serviceId) } }),
  ]);

  if (!doctor || !doctor.isActive) { res.status(400).json({ error: "Врач не найден или неактивен" }); return; }
  if (!service || !service.isActive) { res.status(400).json({ error: "Услуга не найдена или неактивна" }); return; }

  // Проверка расписания врача
  const bookingDate = new Date(date as string);
  const scheduleCheck = isWithinSchedule(
    doctor.schedule as Record<string, { start: string; end: string }> | null,
    bookingDate,
    time as string
  );
  if (!scheduleCheck.ok) { res.status(400).json({ error: scheduleCheck.reason }); return; }

  // Проверка на пересечение записей — нельзя записать к врачу на занятое время
  const timeNum = Number((time as string).replace(":", ""));
  const serviceDuration = service.duration; // в минутах
  const timeEndNum = timeNum + Math.floor(serviceDuration / 60) * 100 + (serviceDuration % 60);

  const sameDayBookings = await prisma.booking.findMany({
    where: {
      doctorId: Number(doctorId),
      date: bookingDate,
      status: { in: ["new", "confirmed"] },
    },
    include: { service: true },
  });

  const hasConflict = sameDayBookings.some((b) => {
    const bStart = Number(b.time.replace(":", ""));
    const bDuration = b.service.duration;
    const bEnd = bStart + Math.floor(bDuration / 60) * 100 + (bDuration % 60);
    // Пересечение: новая запись начинается до конца существующей И заканчивается после начала существующей
    return timeNum < bEnd && timeEndNum > bStart;
  });

  if (hasConflict) {
    res.status(400).json({ error: "Это время уже занято у выбранного врача" });
    return;
  }

  const booking = await prisma.booking.create({
    data: {
      patientName: patientName as string, phone: phone as string,
      doctorId: Number(doctorId), serviceId: Number(serviceId),
      date: bookingDate, time: time as string, comment: (comment as string) || null,
    },
    include: { doctor: true, service: true },
  });

  broadcast("new_booking", booking);
  notifyNewBooking(booking).catch((err) => logger.error({ err }, "Telegram notify failed"));
  sendBookingCreatedSms(booking.phone, booking.patientName).catch((err) => logger.error({ err }, "SMS send failed"));

  res.status(201).json(booking);
}));

// PUT /api/bookings/:id — admin
router.put("/:id", requireAdmin, validate(updateBookingSchema), asyncHandler(async (req: Request, res: Response) => {
  const oldBooking = await prisma.booking.findUnique({ where: { id: Number(req.params.id) } });
  if (!oldBooking) { res.status(404).json({ error: "Запись не найдена" }); return; }

  const updateData = { ...req.body };
  if (updateData.date) updateData.date = new Date(updateData.date);

  const booking = await prisma.booking.update({
    where: { id: Number(req.params.id) }, data: updateData, include: { doctor: true, service: true },
  });

  if (req.body.status && req.body.status !== oldBooking.status) {
    if (req.body.status === "confirmed") {
      sendBookingConfirmedSms(booking.phone, booking.patientName, booking.date.toLocaleDateString("ru-RU"), booking.time)
        .catch((err) => logger.error({ err }, "SMS confirm failed"));
    } else if (req.body.status === "cancelled") {
      sendBookingCancelledSms(booking.phone, booking.patientName)
        .catch((err) => logger.error({ err }, "SMS cancel failed"));
    }
  }

  broadcast("booking_updated", booking);
  res.json(booking);
}));

// DELETE /api/bookings/:id — admin
router.delete("/:id", requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  await prisma.booking.delete({ where: { id: Number(req.params.id) } });
  broadcast("booking_deleted", { id: Number(req.params.id) });
  res.json({ message: "Запись удалена" });
}));

export default router;
