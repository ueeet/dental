import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

dotenv.config();

import authRoutes from "./routes/auth";
import doctorsRoutes from "./routes/doctors";
import servicesRoutes from "./routes/services";
import bookingsRoutes from "./routes/bookings";
import portfolioRoutes from "./routes/portfolio";
import uploadRoutes from "./routes/upload";
import statsRoutes from "./routes/stats";

const app = express();
const PORT = process.env.PORT || 4000;

// Безопасность
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json({ limit: "1mb" }));

// Rate limiting
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5 });
app.use("/api/auth/login", loginLimiter);

const bookingLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 3 });
app.use("/api/bookings", bookingLimiter);

const generalLimiter = rateLimit({ windowMs: 60 * 1000, max: 100 });
app.use("/api", generalLimiter);

// Роуты
app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorsRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/stats", statsRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
