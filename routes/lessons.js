const express = require('express');
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const { lessonValidation } = require('../validators/lessonValidator'); // Імпорт валідації
const router = express.Router();


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
    const { title, content, courseId } = req.body;

    // Перевірка наявності поля courseId
    if (!courseId) {
        return res.status(400).json({ message: 'courseId is required' });
    }

    // Валідація даних для уроку
    const { error } = lessonValidation(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const lesson = new Lesson({
        title,
        content,
        courseId
    });

    try {
        const newLesson = await lesson.save();

        // Додаємо ID нового уроку до курсу
        await Course.findByIdAndUpdate(courseId, { $push: { lessons: newLesson._id } });

        res.status(201).json(newLesson);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

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
router.patch('/:id', getLesson, async (req, res) => {
    const { title, content, courseId } = req.body;

    // Валідація даних для оновлення уроку
    const { error } = lessonValidation(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    // Оновлення полів, якщо вони присутні в запиті
    if (title != null) {
        res.lesson.title = title;
    }
    if (content != null) {
        res.lesson.content = content;
    }
    if (courseId != null) {
        res.lesson.courseId = courseId;
    }

    try {
        const updatedLesson = await res.lesson.save();
        res.json(updatedLesson);
    } catch (err) {
        res.status(400).json({ message: err.message });
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
