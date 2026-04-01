import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({
  host: "aws-0-eu-central-1.pooler.supabase.com",
  port: 5432,
  database: "postgres",
  user: "postgres.uxtsjmshhujeuwbdntek",
  password: process.env.DB_PASSWORD || "",
  ssl: { rejectUnauthorized: false },
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default prisma;
