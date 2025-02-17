const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

router.use((req, res, next) => {
  console.log(
    `Запит на маршрут /api/uploads: ${req.method} ${req.originalUrl}`
  );
  next();
});

// Налаштування для збереження файлів у папці "uploads"
const upload = multer({
  dest: path.join(__dirname, "../uploads"),
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif|mp4|mov|avi/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb("Помилка: Дозволені тільки зображення та відео");
    }
  },
});

// Маршрут для завантаження файлів
router.post("/", upload.single("file"), (req, res) => {
  console.log("Запит на завантаження файлу: /api/uploads");
  const file = req.file;
  const fileType = req.body.type || "other"; // Тип файлу: "avatar" або "lesson"

  if (!file) {
    return res.status(400).send("No file uploaded.");
  }
  console.log("Шлях збереження файлу:", file.path);

  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${
    file.filename
  }`;
  res.json({ url: fileUrl, type: fileType });
});

module.exports = router;
