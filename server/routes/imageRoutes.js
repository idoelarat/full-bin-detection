// routes/imageRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

const UPLOAD_DIR = path.join(process.cwd(), "uploads");
const INDEX_JSON = path.join(UPLOAD_DIR, "index.json");

// ודא שקיימת תיקיית ההעלאות
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "");
    const safeName =
      Date.now() + "-" + (file.originalname || "image").replace(/\s+/g, "_");
    cb(null, safeName.endsWith(ext) ? safeName : safeName + ext);
  },
});
const upload = multer({ storage });

// Utils לקריאה/כתיבה של index.json
function readIndex() {
  try {
    const raw = fs.readFileSync(INDEX_JSON, "utf8");
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}
function writeIndex(arr) {
  fs.writeFileSync(INDEX_JSON, JSON.stringify(arr, null, 2), "utf8");
}

// GET /api/images/list — כל ה-URLs (מלאים) של התמונות
router.get("/list", (req, res) => {
  const list = readIndex();
  res.json(list);
});

// POST /api/images/upload — העלאה ועדכון הרשימה
router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const imageUrl = `/uploads/${req.file.filename}`; // יחסי
  const fullUrl = `${req.protocol}://${req.get("host")}${imageUrl}`; // מלא

  const list = readIndex();
  if (!list.includes(fullUrl)) {
    list.push(fullUrl);
    writeIndex(list);
  }

  res.json({ imageUrl, fullUrl });
});

// DELETE /api/images/clear — מחיקת כל התמונות וריקון הרשימה
router.delete("/clear", (req, res) => {
  try {
    const files = fs.readdirSync(UPLOAD_DIR);
    for (const file of files) {
      if (file === "index.json") continue;
      try {
        fs.unlinkSync(path.join(UPLOAD_DIR, file));
      } catch (e) {
        console.error("Failed to remove:", file, e);
      }
    }
    writeIndex([]);
    res.json({ ok: true, cleared: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to clear images" });
  }
});

export default router;
