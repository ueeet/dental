import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export interface JwtPayload {
  adminId: number;
  role: string;
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Токен не предоставлен" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    (req as Request & { admin: JwtPayload }).admin = payload;
    next();
  } catch {
    res.status(401).json({ error: "Недействительный или просроченный токен" });
  }
}

export function generateTokens(adminId: number, role: string) {
  const accessToken = jwt.sign({ adminId, role }, JWT_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ adminId, role, type: "refresh" }, JWT_SECRET, { expiresIn: "7d" });
  return { accessToken, refreshToken };
}

export function verifyRefreshToken(token: string): JwtPayload & { type: string } {
  return jwt.verify(token, JWT_SECRET) as JwtPayload & { type: string };
}
