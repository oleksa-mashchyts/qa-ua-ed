const express = require("express");
const Lesson = require("../models/Lesson");
const Test = require("../models/Test");
const router = express.Router();

// Отримати всі елементи (уроки і тести) для певного курсу у впорядкованому вигляді
router.get("/courses/:id/elements", async (req, res) => {
  try {
    const lessons = await Lesson.find({ courseId: req.params.id }).lean();
    const tests = await Test.find({ courseId: req.params.id }).lean();

    // Додаємо поле `type` для кожного уроку і тесту
    const lessonsWithType = lessons.map((lesson) => ({
      ...lesson,
      type: "lesson",
    }));
    const testsWithType = tests.map((test) => ({ ...test, type: "test" }));

    // Об'єднуємо уроки та тести і сортуємо їх за полем `order`
    const elements = [...lessonsWithType, ...testsWithType].sort(
      (a, b) => a.order - b.order
    );

    res.json(elements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
