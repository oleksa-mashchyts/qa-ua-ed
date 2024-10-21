const express = require('express');
const Test = require('../models/Test');
const router = express.Router();

// Отримати всі тести
router.get('/', async (req, res) => {
  try {
    const tests = await Test.find().populate('lessonId');
    res.json(tests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Створити новий тест
router.post('/', async (req, res) => {
  const test = new Test({
    title: req.body.title, // Додайте це поле
    questions: req.body.questions,
    lessonId: req.body.lessonId, // Змінили на lessonId
  });

  try {
    const newTest = await test.save();
    res.status(201).json(newTest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Отримати тест за ID
router.get('/:id', getTest, (req, res) => {
  res.json(res.test);
});

// Оновити тест
router.patch('/:id', getTest, async (req, res) => {
  if (req.body.title != null) {
    res.test.title = req.body.title;
  }
  if (req.body.questions != null) {
    res.test.questions = req.body.questions;
  }
  if (req.body.lessonId != null) {
    res.test.lessonId = req.body.lessonId; // Додано для оновлення
  }

  try {
    const updatedTest = await res.test.save();
    res.json(updatedTest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Видалити тест
router.delete('/:id', getTest, async (req, res) => {
  try {
    await res.test.remove();
    res.json({ message: 'Test deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware для отримання тесту по ID
async function getTest(req, res, next) {
  let test;
  try {
    test = await Test.findById(req.params.id);
    if (test == null) {
      return res.status(404).json({ message: 'Test not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.test = test;
  next();
}

// Оновити тест
router.patch('/:id', getTest, async (req, res) => {
    if (req.body.title != null) {
        res.test.title = req.body.title;
    }
    if (req.body.questions != null) {
        res.test.questions = req.body.questions;
    }

    try {
        const updatedTest = await res.test.save();
        res.json(updatedTest);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Отримати тести для певного уроку
router.get('/lessons/:id/tests', async (req, res) => {
    try {
        const tests = await Test.find({ lessonId: req.params.id });
        res.json(tests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;
