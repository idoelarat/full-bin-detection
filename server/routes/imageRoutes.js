// routes/imageRoutes.js
import express from "express";
import multer from "multer";
import path from "path";

const router = express.Router();

// הגדרת איפה נשמרות התמונות
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // התיקייה חייבת להיות קיימת בפרויקט
  },
  filename: (req, file, cb) => {
    // שם קובץ ייחודי: timestamp + הסיומת המקורית
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// נתיב העלאה
router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // ה־URL הקבוע שבו אפשר לגשת לקובץ
  const imageUrl = `/uploads/${req.file.filename}`;

  res.json({ imageUrl });
});

export default router;
