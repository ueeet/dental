import { Router, Request, Response } from "express";
import multer from "multer";
import { getSupabase } from "../supabaseClient";
import { requireAdmin } from "../middleware/auth";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// POST /api/upload — admin
router.post("/", requireAdmin, upload.single("file"), async (req: Request, res: Response): Promise<void> => {
  const file = req.file;
  if (!file) {
    res.status(400).json({ error: "Файл не загружен" });
    return;
  }

  const fileName = `${Date.now()}-${file.originalname}`;
  const supabase = getSupabase();
  const { error } = await supabase.storage
    .from("photos")
    .upload(fileName, file.buffer, { contentType: file.mimetype });

  if (error) {
    res.status(500).json({ error: "Ошибка загрузки файла" });
    return;
  }

  const { data } = supabase.storage.from("photos").getPublicUrl(fileName);
  res.json({ url: data.publicUrl });
});

export default router;
