const express = require('express');
const router = express.Router();
const Lesson = require('../models/Lesson');

// Отримати всі уроки
router.get('/', async (req, res) => {
    try {
        const lessons = await Lesson.find();
        res.json(lessons);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Створити новий урок
router.post('/', async (req, res) => {
    const lesson = new Lesson({
        title: req.body.title,
        content: req.body.content,
        courseId: req.body.courseId
    });

    try {
        const newLesson = await lesson.save();
        res.status(201).json(newLesson);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Отримати урок за ID
router.get('/:id', getLesson, (req, res) => {
    res.json(res.lesson);
});

// Видалити урок
router.delete('/:id', getLesson, async (req, res) => {
    try {
        await res.lesson.remove();
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

module.exports = router;

// models/Lesson.js
const mongoose = require('mongoose');


