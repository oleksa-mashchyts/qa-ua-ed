const express = require('express');
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

// Реєстрація нового користувача
router.post('/register', async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
    });
    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Вхід користувача
router.post("/login", async (req, res) => {
    localStorage.removeItem("user");
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user && (await bcrypt.compare(req.body.password, user.password))) {
      const { _id, name, email, role } = user; // Передаємо необхідні поля, включаючи _id
      res.json({
        message: "Login successful",
        user: { _id, name, email, role },
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Отримати всіх студентів
router.get('/students', async (req, res) => {
    try {
        const students = await User.find({ role: 'student' });
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Отримати всіх вчителів
router.get('/teachers', async (req, res) => {
    try {
        const teachers = await User.find({ role: 'teacher' });
        res.json(teachers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Отримати профіль користувача
router.get('/:id', getUser, (req, res) => {
    res.json(res.user);
});

// Оновлення теми користувача
router.patch('/:id/theme', async (req, res) => {
  try {
    const { theme } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { theme }, { new: true });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Middleware для отримання користувача по ID
async function getUser(req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }

    let user;
    try {
        user = await User.findById(req.params.id);
        if (user == null) {
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.user = user;
    next();
}




module.exports = router;
