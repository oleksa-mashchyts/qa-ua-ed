const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Для використання змінних середовища з .env файлу
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./src/docs/swaggerDocs'); // Імпортуємо налаштування Swagger
const authRouter = require('./routes/auth');


const app = express();

// Налаштування CORS
app.use(cors());

// Налаштування статичних файлів
app.use(express.static(path.join(__dirname, 'client', 'public')));

// Налаштування middleware для обробки JSON
app.use(express.json());

// Підключення до бази даних MongoDB
mongoose.connect(process.env.MONGODB_URI)
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
app.use('/api/auth', authRouter);

// Налаштування маршруту для кореневого ендпоінту
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'public', 'index.html'));
  });  

 

// Swagger-документація
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Головний маршрут для React (якщо інші не спрацювали)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const helmet = require('helmet'); // Використовуємо Helmet для заголовків безпеки

app.use(helmet());
