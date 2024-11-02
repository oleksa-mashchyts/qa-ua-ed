const express = require("express");
const Lesson = require("../models/Lesson");
const Test = require("../models/Test");
const router = express.Router();

// Отримати всі елементи (уроки і тести) для певного курсу у впорядкованому вигляді
router.get("/courses/:id/elements", async (req, res) => {
  try {
    const lessons = await Lesson.find({ courseId: req.params.id });
    const tests = await Test.find({ courseId: req.params.id });

    // Об'єднуємо уроки та тести і сортуємо їх за полем `order`
    const elements = [...lessons, ...tests].sort((a, b) => a.order - b.order);

    res.json(elements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
