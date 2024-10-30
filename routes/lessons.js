const express = require('express');
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const { lessonValidation } = require('../validators/lessonValidator'); // Імпорт валідації
const router = express.Router();
const mongoose = require('mongoose');


// Отримати всі уроки
/**
 * @swagger
 * /api/lessons:
 *   get:
 *     summary: Get all lessons
 *     tags: [Lessons]
 *     responses:
 *       200:
 *         description: List of all lessons
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lesson'
 */
router.get('/', async (req, res) => {
    try {
        const lessons = await Lesson.find();
        res.json(lessons);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Створити новий урок
/**
 * @swagger
 * /api/lessons:
 *   post:
 *     summary: Create a new lesson
 *     tags: [Lessons]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Lesson'
 *     responses:
 *       201:
 *         description: The lesson was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lesson'
 */
router.post('/', async (req, res) => {
    console.log('Запит на створення уроку:', req.body); // Логування

    const { title, content, courseId } = req.body;

    if (!courseId) {
        console.log('Помилка: Відсутній courseId');
        return res.status(400).json({ message: 'courseId is required' });
    }

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
        console.log('Невалідний courseId:', courseId);
        return res.status(400).json({ message: 'Invalid courseId format' });
    }

    try {
        const newLesson = new Lesson({ title, content, courseId });
        await newLesson.save();
        console.log('Новий урок успішно створено:', newLesson);
        res.status(201).json(newLesson);
    } catch (error) {
        console.error('Помилка при створенні уроку:', error);
        res.status(500).json({ message: 'Не вдалося створити урок' });
    }
});

module.exports = router;
  
  


// Отримати урок за ID
/**
 * @swagger
 * /api/lessons/{id}:
 *   get:
 *     summary: Get lesson by ID
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The lesson ID
 *     responses:
 *       200:
 *         description: The lesson by ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lesson'
 *       404:
 *         description: Lesson not found
 */
router.get('/:id', getLesson, (req, res) => {
    res.json(res.lesson);
});

// Видалити урок
router.delete('/:id', getLesson, async (req, res) => {
    try {
        await Lesson.findByIdAndDelete(req.params.id); // Використовуємо findByIdAndDelete
        res.json({ message: 'Lesson deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware для отримання урока по ID
async function getLesson(req, res, next) {
    let lesson;
    try {
        lesson = await Lesson.findById(req.params.id);
        if (lesson == null) {
            return res.status(404).json({ message: 'Lesson not found' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.lesson = lesson;
    next();
}

// Оновити урок
router.patch("/:id", async (req, res) => {
  try {
    const { title, content } = req.body; // Отримуємо нові дані з тіла запиту

    const updatedLesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      { title, content }, // Оновлюємо і назву, і контент
      { new: true }
    );

    if (!updatedLesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    res.json(updatedLesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// Отримати уроки для певного курсу
router.get('/courses/:id/lessons', async (req, res) => {
    try {
        const lessons = await Lesson.find({ courseId: req.params.id });
        res.json(lessons);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;
