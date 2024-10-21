const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Для використання змінних середовища з .env файлу

const app = express();

// Налаштування CORS
app.use(cors());

// Налаштування статичних файлів
app.use(express.static(path.join(__dirname, 'public')));

// Налаштування middleware для обробки JSON
app.use(express.json());

// Підключення до бази даних MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Ваші маршрути
const coursesRouter = require('./routes/courses');
const lessonsRouter = require('./routes/lessons');
const testsRouter = require('./routes/tests');
const userRouter = require('./routes/users');

app.use('/api/courses', coursesRouter);
app.use('/api/lessons', lessonsRouter);
app.use('/api/tests', testsRouter);
app.use('/api/users', userRouter);

// Налаштування маршруту для кореневого ендпоінту
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
