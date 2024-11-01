const express = require('express');
const Lesson = require('../models/Lesson');
const router = express.Router();
const mongoose = require('mongoose');

// Отримати всі уроки для певного курсу в порядку order
router.get('/courses/:id/lessons', async (req, res) => {
  try {
    const lessons = await Lesson.find({ courseId: req.params.id }).sort('order');
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Створити новий урок із встановленням порядку
router.post('/', async (req, res) => {
  const { title, content, courseId } = req.body;

  if (!courseId) {
    return res.status(400).json({ message: 'courseId is required' });
  }

  try {
    // Визначаємо останній порядок для цього курсу
    const lastLesson = await Lesson.findOne({ courseId }).sort('-order');
    const order = lastLesson ? lastLesson.order + 1 : 1;

    const newLesson = new Lesson({ title, content, courseId, order });
    await newLesson.save();
    res.status(201).json(newLesson);
  } catch (error) {
    res.status(500).json({ message: 'Не вдалося створити урок' });
  }
});
  
  
// Оновити порядок уроків
router.patch('/:id/order', async (req, res) => {
  const { order } = req.body;
  try {
    const updatedLesson = await Lesson.findByIdAndUpdate(req.params.id, { order }, { new: true });
    if (!updatedLesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    res.json(updatedLesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Отримати урок за ID
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
    lesson = await Lesson.findById(req.params.id).populate('courseId'); // Включаємо дані про курс
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
router.patch('/:id', async (req, res) => {
  try {
    const { title, content, order } = req.body; // Отримуємо нові дані з тіла запиту, включаючи порядок

    const updatedLesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      { title, content, order }, // Оновлюємо і назву, і контент, і порядок
      { new: true }
    );

    if (!updatedLesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    res.json(updatedLesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Отримати уроки для певного курсу з урахуванням порядку
router.get('/courses/:id/lessons', async (req, res) => {
  try {
    const lessons = await Lesson.find({ courseId: req.params.id }).sort('order'); // Сортуємо за order
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
