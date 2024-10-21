const express = require('express');
const Course = require('../models/Course');

const router = express.Router();

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Get all courses
 *     responses:
 *       200:
 *         description: A list of courses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 */

router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Додавання нового курсу
router.post('/', async (req, res) => {
  const course = new Course({
    title: req.body.title,
    description: req.body.description,
    duration: req.body.duration,
  });

  try {
    const newCourse = await course.save();
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Отримати курс за ID
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Оновити курс
router.patch('/:id', async (req, res) => {
  try {
      const course = await Course.findById(req.params.id);
      if (!course) {
          return res.status(404).json({ message: 'Course not found' });
      }
      if (req.body.title != null) {
          course.title = req.body.title;
      }
      if (req.body.description != null) {
          course.description = req.body.description;
      }
      if (req.body.duration != null) {
          course.duration = req.body.duration;
      }

      const updatedCourse = await course.save();
      res.json(updatedCourse);
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
});

// Видалити курс
router.delete('/:id', async (req, res) => {
  try {
      const course = await Course.findById(req.params.id);
      if (!course) {
          return res.status(404).json({ message: 'Course not found' });
      }
      await course.remove();
      res.json({ message: 'Course deleted' });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});


module.exports = router;
