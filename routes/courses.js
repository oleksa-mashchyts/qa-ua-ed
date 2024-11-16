const express = require('express');
const Course = require('../models/Course');

const router = express.Router();

// Отримати кількість курсів
router.get("/count", async (req, res) => {
  try {
    const courseCount = await Course.countDocuments();
    res.json({ count: courseCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
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

router.get("/", async (req, res) => {
  const { duration, level } = req.query;

  const filter = {};

  // Фільтрація за тривалістю
  if (duration) {
    try {
      const durations = JSON.parse(duration); // Очікуємо масив числових діапазонів
      if (durations.length === 2) {
        filter.duration = { $gte: durations[0], $lt: durations[1] }; // Мінімум і максимум
      }
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Invalid duration filter format" });
    }
  }

  // Фільтрація за рівнем
  if (level) {
    const levels = level.split(",");
    filter.level = { $in: levels };
  }

  try {
    const courses = await Course.find(filter);
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// Додавання нового курсу
/**
 * @swagger
 * /api/courses:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       201:
 *         description: The course was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 */
router.post('/', async (req, res) => {
  const { title, description, duration } = req.body;

  // Логування отриманих даних
  console.log('Received data:', req.body);

  // Перевірка наявності поля duration
  if (duration == null) {
      return res.status(400).json({ message: 'Duration is required' });
  }

  const course = new Course({
      title,
      description,
      duration
  });

  try {
      const newCourse = await course.save();
      res.status(201).json(newCourse);
  } catch (err) {
      console.error(err); // Логування помилки для діагностики
      res.status(400).json({ message: err.message });
  }
});

// Отримати курс за ID
/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     summary: Get course by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The course ID
 *     responses:
 *       200:
 *         description: The course by ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       404:
 *         description: Course not found
 */
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

// Оновити зображення курсу
router.patch('/:id/image', async (req, res) => {
  const { imageUrl } = req.body;
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    course.imageUrl = imageUrl;
    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!course) {
      return res.status(404).json({ message: 'Курс не знайдено' });
    }
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Сталася помилка при оновленні курсу' });
  }
});

// Видалити курс
router.delete('/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id); // Видаляємо курс
    if (!course) {
      return res.status(404).json({ message: 'Курс не знайдено' });
    }
    res.status(200).json({ message: 'Курс успішно видалено' });
  } catch (error) {
    console.error('Помилка видалення курсу:', error);
    res.status(500).json({ message: 'Сталася помилка на сервері' });
  }
});

// Отримати кількість курсів
router.get("/count", async (req, res) => {
  try {
    const courseCount = await Course.countDocuments();
    res.json({ count: courseCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



module.exports = router;
