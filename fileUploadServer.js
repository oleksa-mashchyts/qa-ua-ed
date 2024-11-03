const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors()); // Дозволяємо CORS для обробки запитів з інших доменів

// Налаштування для збереження файлів у папці "uploads"
const upload = multer({
  dest: path.join(__dirname, "uploads"),
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
app.post("/api/uploads", upload.single("file"), (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).send("No file uploaded.");
  }

  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${
    file.filename
  }`;
  res.json({ url: fileUrl });
});

// Доступ до статичних файлів "uploads"
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.FILE_UPLOAD_PORT || 3001;
app.listen(PORT, () => {
  console.log(`File upload server running on port ${PORT}`);
});
