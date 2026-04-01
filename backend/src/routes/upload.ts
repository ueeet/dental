import { Router, Request, Response } from "express";
import multer from "multer";
import { getSupabase } from "../supabaseClient";
import { requireAdmin } from "../middleware/auth";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.post("/", requireAdmin, upload.single("file"), asyncHandler(async (req: Request, res: Response) => {
  const file = req.file;
  if (!file) { res.status(400).json({ error: "Файл не загружен" }); return; }

  const supabase = getSupabase();
  const fileName = `${Date.now()}-${file.originalname}`;
  const { error } = await supabase.storage.from("photos").upload(fileName, file.buffer, { contentType: file.mimetype });

  if (error) { res.status(500).json({ error: "Ошибка загрузки файла" }); return; }

  const { data } = getSupabase().storage.from("photos").getPublicUrl(fileName);
  res.json({ url: data.publicUrl });
}));

export default router;
