import { z } from "zod/v4";

// Auth
export const loginSchema = z.object({
  login: z.string().min(1, "Логин обязателен"),
  password: z.string().min(1, "Пароль обязателен"),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

// Booking
export const createBookingSchema = z.object({
  patientName: z.string().min(2, "Минимум 2 символа").max(100),
  phone: z.string().regex(/^\+7\d{10}$/, "Формат: +7XXXXXXXXXX"),
  doctorId: z.number().int().positive(),
  serviceId: z.number().int().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Формат: YYYY-MM-DD"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Формат: HH:MM"),
  comment: z.string().max(500).optional(),
  consentGiven: z.literal(true, { error: "Необходимо согласие на обработку ПД" }),
});

export const updateBookingSchema = z.object({
  status: z.enum(["new", "confirmed", "completed", "cancelled"]).optional(),
  comment: z.string().max(500).optional(),
});

// Doctor
export const createDoctorSchema = z.object({
  name: z.string().min(2).max(100),
  specialty: z.string().min(2).max(100),
  experience: z.number().int().min(0).optional(),
  photo: z.string().optional().nullable(),
  description: z.string().max(2000).optional(),
  isActive: z.boolean().optional(),
  schedule: z.record(z.string(), z.object({
    start: z.string().regex(/^\d{2}:\d{2}$/),
    end: z.string().regex(/^\d{2}:\d{2}$/),
  })).optional(),
});

export const updateDoctorSchema = createDoctorSchema.partial();

// Service
export const createServiceSchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().max(2000).optional(),
  price: z.number().int().min(0),
  duration: z.number().int().min(5).max(480).optional(),
  category: z.string().max(100).optional(),
  isActive: z.boolean().optional(),
});

export const updateServiceSchema = createServiceSchema.partial();

// Review
export const createReviewSchema = z.object({
  authorName: z.string().min(2).max(100),
  text: z.string().min(5).max(2000),
  rating: z.number().int().min(1).max(5),
});

export const moderateReviewSchema = z.object({
  isApproved: z.boolean().optional(),
  isVisible: z.boolean().optional(),
});

// Promotion
export const createPromotionSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().max(2000).optional(),
  image: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const updatePromotionSchema = createPromotionSchema.partial();

// Settings
export const updateSettingsSchema = z.object({
  clinicName: z.string().max(200).optional(),
  phone: z.string().max(20).optional(),
  address: z.string().max(500).optional(),
  workingHours: z.record(z.string(), z.object({
    start: z.string(),
    end: z.string(),
  })).optional(),
  telegramChatId: z.string().optional(),
  smsEnabled: z.boolean().optional(),
});
