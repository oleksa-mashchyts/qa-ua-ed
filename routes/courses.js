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

  
  const { duration, level, skills } = req.query;

  const filter = {};

  // Фільтрація за тривалістю
  if (duration) {
    try {
      const durations = JSON.parse(duration);
      if (durations.length === 2) {
        if (durations[1] === null) {
          // Якщо верхня межа відсутня, шукаємо значення більше або рівне мінімуму
          filter.duration = { $gte: durations[0] };
        } else {
          filter.duration = { $gte: durations[0], $lt: durations[1] };
        }
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

  // Фільтрація за навичками
  if (skills) {
    const skillIds = skills.split(",");
    filter.skills = { $in: skillIds }; // Пошук курсів із хоча б однією навичкою
  }

  try {
    // Запит із повним фільтром
    const courses = await Course.find(filter).populate("skills");
    res.json(courses);
  } catch (error) {
    console.error(error);
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
router.post("/", async (req, res) => {
  const { title, description, duration, skills } = req.body;

  // Перевірка наявності поля duration
  if (duration == null) {
    return res.status(400).json({ message: "Duration is required" });
  }

  const course = new Course({
    title,
    description,
    duration,
    skills: skills || [], // Додаємо навички, якщо вони передані
  });

  try {
    const newCourse = await course.save();

    // Популяція навичок для відповіді
    const populatedCourse = await Course.findById(newCourse._id).populate(
      "skills"
    );

    res.status(201).json(populatedCourse);
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
router.get("/:id", async (req, res) => {
  try {
    // Отримуємо курс за ID
    const course = await Course.findById(req.params.id).populate("skills"); // Популяція навичок

    if (!course) {
      return res.status(404).json({ message: "Курс не знайдено" });
    }

    // Додаємо будь-яку іншу необхідну логіку тут
    const enrichedData = {
      ...course.toObject(),
      additionalInfo: "Додаткова інформація, якщо потрібно", // Приклад додаткових даних
    };

    res.json(enrichedData); // Повертаємо курс із додатковими полями
  } catch (error) {
    console.error("Помилка при отриманні курсу:", error);
    res.status(500).json({ message: "Сталася помилка на сервері" });
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

router.patch("/:id/skills", async (req, res) => {
  const { skills } = req.body;
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Курс не знайдено" });
    }
    course.skills = skills; // Оновлюємо список навичок
    const updatedCourse = await course.save();
    const populatedCourse = await Course.findById(updatedCourse._id).populate(
      "skills"
    ); // Повертаємо навички з їх деталями
    res.json(populatedCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});





module.exports = router;
