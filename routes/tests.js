const express = require("express");
const Test = require("../models/Test");
const router = express.Router();

// Отримати всі тести
router.get("/", async (req, res) => {
  try {
    const tests = await Test.find().populate("courseId");
    res.json(tests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Створити новий тест
router.post("/", async (req, res) => {
  const { title, questions, courseId } = req.body;

  // Валідація даних для створення тесту (приклад, якщо є схема валідації)
  // const { error } = testValidation(req.body);
  // if (error) {
  //   return res.status(400).json({ message: error.details[0].message });
  // }

  const test = new Test({
    title,
    questions,
    courseId, // Зв'язок з курсом
  });

  try {
    const newTest = await test.save();
    res.status(201).json(newTest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Отримати тест за ID
router.get("/:id", getTest, (req, res) => {
  res.json(res.test);
});

// Оновити тест
router.patch("/:id", getTest, async (req, res) => {
  const { title, questions, courseId } = req.body;

  // Оновлення полів, якщо вони присутні в запиті
  if (title != null) {
    res.test.title = title;
  }
  if (questions != null) {
    res.test.questions = questions;
  }
  if (courseId != null) {
    res.test.courseId = courseId;
  }

  try {
    const updatedTest = await res.test.save();
    res.json(updatedTest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Видалити тест
router.delete("/:id", getTest, async (req, res) => {
  try {
    await res.test.remove();
    res.json({ message: "Test deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware для отримання тесту по ID
async function getTest(req, res, next) {
  let test;
  try {
    test = await Test.findById(req.params.id).populate("courseId");
    if (test == null) {
      return res.status(404).json({ message: "Test not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.test = test;
  next();
}

// Отримати тести для певного курсу
router.get("/courses/:courseId/tests", async (req, res) => {
  try {
    const tests = await Test.find({ courseId: req.params.courseId });
    res.json(tests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
