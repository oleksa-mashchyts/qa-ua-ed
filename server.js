const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet'); // Використовуємо Helmet для заголовків безпеки
require('dotenv').config(); // Для використання змінних середовища з .env файлу
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./src/docs/swaggerDocs');

const app = express();

// Додаємо налаштування для підтримки більших файлів
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(helmet());

// Налаштування CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);


app.options('*', (req, res) => {
  res.sendStatus(204); // Відповідь на preflight-запит
});

// Підключення до бази даних MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

    mongoose.connection.on('error', (err) => {
      console.error('Помилка підключення до MongoDB:', err);
    });
    
    mongoose.connection.once('open', () => {
      console.log('Підключено до MongoDB');
    });
    


// Ваші маршрути
const authRouter = require('./routes/auth');
const coursesRouter = require('./routes/courses');
const lessonsRouter = require('./routes/lessons');
const testsRouter = require('./routes/tests');
const userRouter = require('./routes/users');
const courseElementsRouter = require("./routes/courseElements");



app.use('/api/auth', authRouter);
app.use('/api/courses', coursesRouter);
app.use('/api/lessons', lessonsRouter);
app.use('/api/tests', testsRouter);
app.use('/api/users', userRouter);
app.use("/api", courseElementsRouter);


// Налаштування маршруту для кореневого ендпоінту
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'public', 'index.html'));
  });  

// Swagger-документація
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));



// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});




