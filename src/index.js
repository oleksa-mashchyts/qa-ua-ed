const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Підключення до MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


// Налаштування маршруту
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Оголошення маршруту
const coursesRouter = require('../routes/courses');
app.use('/api/courses', coursesRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const lessonsRouter = require('../routes/lessons');
app.use('/api/lessons', lessonsRouter);


const testsRouter = require('../routes/tests');
app.use('/api/tests', testsRouter);

const userRouter = require('../routes/users');
app.use('/api/users', userRouter); 

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API Information',
    },
  },
  apis: ['./routes/*.js'], // шлях до ваших маршрутизаторів
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

