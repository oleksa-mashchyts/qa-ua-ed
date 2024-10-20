const express = require('express');
const Test = require('../models/Test');
const router = express.Router();

// Отримати всі тести
router.get('/', async (req, res) => {
  try {
    const tests = await Test.find().populate('lesson');
    res.json(tests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Створити новий тест
router.post('/', async (req, res) => {
  const test = new Test({
    lesson: req.body.lesson,
    questions: req.body.questions,
  });

  try {
    const newTest = await test.save();
    res.status(201).json(newTest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
