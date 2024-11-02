const express = require("express");
const Test = require("../models/Test");
const Lesson = require("../models/Lesson"); // Додаємо для визначення загального порядку
const router = express.Router();

// Отримати всі тести для певного курсу в порядку order
router.get("/courses/:courseId/tests", async (req, res) => {
  try {
    const tests = await Test.find({ courseId: req.params.courseId }).sort(
      "order"
    );
    res.json(tests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Створити новий тест із встановленням порядку
router.post("/", async (req, res) => {
  const { title, questions, courseId } = req.body;

  try {
    // Визначаємо останній порядковий номер для курсу серед уроків і тестів
    const lastOrder = await getLastOrder(courseId);
    const newTest = new Test({
      title,
      questions,
      courseId,
      order: lastOrder + 1,
    });
    await newTest.save();
    res.status(201).json(newTest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Оновити порядок тестів
router.patch("/:id/order", async (req, res) => {
  const { order } = req.body;
  try {
    const updatedTest = await Test.findByIdAndUpdate(
      req.params.id,
      { order },
      { new: true }
    );
    if (!updatedTest) {
      return res.status(404).json({ message: "Test not found" });
    }
    res.json(updatedTest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Отримати тест за ID
router.get("/:id", getTest, (req, res) => {
  res.json(res.test);
});

// Оновити тест
router.patch("/:id", async (req, res) => {
  const { title, questions, courseId, order } = req.body;

  try {
    const updatedTest = await Test.findByIdAndUpdate(
      req.params.id,
      { title, questions, courseId, order },
      { new: true }
    );

    if (!updatedTest) {
      return res.status(404).json({ message: "Test not found" });
    }

    res.json(updatedTest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Видалити тест
router.delete("/:id", getTest, async (req, res) => {
  try {
    await Test.findByIdAndDelete(req.params.id);
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

// Функція для визначення останнього порядку в курсі
async function getLastOrder(courseId) {
  const lastLesson = await Lesson.findOne({ courseId }).sort("-order");
  const lastTest = await Test.findOne({ courseId }).sort("-order");
  const lastOrder = Math.max(lastLesson?.order || 0, lastTest?.order || 0);
  return lastOrder;
}

module.exports = router;
