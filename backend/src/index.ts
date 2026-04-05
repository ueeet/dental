import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import cron from "node-cron";

dotenv.config();

import logger from "./lib/logger";
import { initTelegramBot } from "./lib/telegram";
import { syncAllReviews } from "./lib/reviewParser";
import { addSSEClient } from "./lib/sse";

import authRoutes from "./routes/auth";
import doctorsRoutes from "./routes/doctors";
import servicesRoutes from "./routes/services";
import bookingsRoutes from "./routes/bookings";
import reviewsRoutes from "./routes/reviews";
import promotionsRoutes from "./routes/promotions";
import portfolioRoutes from "./routes/portfolio";
import uploadRoutes from "./routes/upload";
import statsRoutes from "./routes/stats";
import settingsRoutes from "./routes/settings";

const app = express();
const PORT = process.env.PORT || 4000;

// Безопасность
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(compression({
  filter: (req) => {
    // Не сжимаем SSE — иначе буферизирует события
    if (req.url === "/api/events") return false;
    return true;
  },
}));
app.use(express.json({ limit: "1mb" }));

// Rate limiting
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, max: 5,
  message: { error: "Слишком много попыток входа. Подождите 15 минут" },
});
app.use("/api/auth/login", loginLimiter);

// Записи: 2 заявки за 30 минут с одного IP
const bookingLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, max: 2,
  message: { error: "Вы уже отправили заявку. Подождите 30 минут" },
});

// Отзывы: 1 отзыв за 10 минут с одного IP
const reviewLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, max: 1,
  message: { error: "Вы уже оставили отзыв. Подождите 10 минут" },
});

const generalLimiter = rateLimit({ windowMs: 60 * 1000, max: 100 });
app.use("/api", generalLimiter);

// Логирование запросов
app.use((req, _res, next) => {
  logger.info({ method: req.method, url: req.url }, "request");
  next();
});

// Роуты
app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorsRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/promotions", promotionsRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/settings", settingsRoutes);

// SSE endpoint для realtime уведомлений админки
app.get("/api/events", (req, res) => {
  addSSEClient(req, res);
});

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// 404
app.use((_req, res) => {
  res.status(404).json({ error: "Маршрут не найден" });
});

// Глобальный error handler — JSON вместо HTML
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error({ err: err.message, stack: err.stack }, "Unhandled error");
  res.status(500).json({ error: "Внутренняя ошибка сервера" });
});

// Запуск
app.listen(PORT, "0.0.0.0", () => {
  logger.info(`Server running on port ${PORT}`);

  // Telegram-бот
  initTelegramBot();

  // Cron: синхронизация отзывов каждые 6 часов
  cron.schedule("0 */6 * * *", () => {
    syncAllReviews();
  });

  // Первая синхронизация при старте
  syncAllReviews();
});
