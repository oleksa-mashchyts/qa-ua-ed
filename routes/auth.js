const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Використовуємо значення з .env


/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Реєстрація нового користувача
 *     description: Цей маршрут дозволяє зареєструвати нового користувача, перевіряє унікальність імейлу та зберігає пароль у зашифрованому вигляді.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Ім'я користувача
 *                 example: Іван Іваненко
 *               email:
 *                 type: string
 *                 description: Імейл користувача (унікальний)
 *                 example: ivan@example.com
 *               password:
 *                 type: string
 *                 description: Пароль користувача
 *                 example: securePassword123
 *               role:
 *                 type: string
 *                 description: Роль користувача (admin, teacher, student)
 *                 example: student
 *     responses:
 *       201:
 *         description: Користувач успішно зареєстрований
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Користувач успішно зареєстрований
 *       400:
 *         description: Помилка вхідних даних або користувач вже існує
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Користувач з таким імейлом вже існує
 *       500:
 *         description: Внутрішня помилка сервера
 */


// Маршрут для реєстрації
router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;
  
    try {
      // Перевірка чи вже існує користувач з таким імейлом
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Користувач з таким імейлом вже існує' });
      }
  
      // Хешування пароля
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Створення нового користувача
      const user = new User({ name, email, password: hashedPassword, role });
  
      // Збереження користувача в базі даних
      await user.save();
  
      res.status(201).json({ message: 'Користувач успішно зареєстрований' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Вхід користувача
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Успішний вхід
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                     role:
 *                       type: string
 *       400:
 *         description: Невірні облікові дані
 *       500:
 *         description: Помилка сервера
 */

// Маршрут для входу
router.post('/login', async (req, res) => {
  console.log(req.body); // Перевірка даних, що надходять
  const { email, password } = req.body; // Використовуємо email замість username

  try {
    // Знаходимо користувача за email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Перевіряємо пароль
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Створюємо JWT-токен
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

    // Відправляємо токен та дані користувача (без пароля)
    res.json({ token, user: { email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Отримати профіль користувача
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Профіль користувача
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 role:
 *                   type: string
 *       401:
 *         description: Неавторизований доступ
 *       500:
 *         description: Помилка сервера
 */

// Middleware для аутентифікації токена
function authenticateToken(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
}

// Маршрут для профілю користувача
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
