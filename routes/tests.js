const express = require('express');
const Test = require('../models/Test');
const router = express.Router();

// Отримати всі тести
/**
 * @swagger
 * /api/tests:
 *   get:
 *     summary: Get all tests
 *     tags: [Tests]
 *     responses:
 *       200:
 *         description: List of all tests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Test'
 */
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
    const { title, questions, lessonId } = req.body;

    // Валідація даних для створення тесту
    const { error } = testValidation(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const test = new Test({
        title,
        questions,
        lessonId
    });

    try {
        const newTest = await test.save();

        // Додаємо ID нового тесту до уроку
        await Lesson.findByIdAndUpdate(lessonId, { $push: { tests: newTest._id } });

        res.status(201).json(newTest);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Отримати тест за ID
/**
 * @swagger
 * /api/tests/{id}:
 *   get:
 *     summary: Get test by ID
 *     tags: [Tests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The test ID
 *     responses:
 *       200:
 *         description: The test by ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Test'
 *       404:
 *         description: Test not found
 */
router.get('/:id', getTest, (req, res) => {
  res.json(res.test);
});

// Оновити тест
router.patch('/:id', getTest, async (req, res) => {
    const { title, questions, lessonId } = req.body;

    // Валідація даних для оновлення тесту
    const { error } = testValidation(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    // Оновлення полів, якщо вони присутні в запиті
    if (title != null) {
        res.test.title = title;
    }
    if (questions != null) {
        res.test.questions = questions;
    }
    if (lessonId != null) {
        res.test.lessonId = lessonId;
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
