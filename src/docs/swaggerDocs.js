const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'Документація для API',
      contact: {
        name: 'QA Україна',
        email: 'info@qaukraine.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000', // Актуальний сервер
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Course: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'objectId', description: 'MongoDB ObjectId' },
            title: { type: 'string', description: 'Назва курсу' },
            description: { type: 'string', description: 'Опис курсу' },
            duration: { type: 'number', description: 'Тривалість у годинах' },
            createdAt: { type: 'string', format: 'date-time', description: 'Дата створення' },
            lessons: {
              type: 'array',
              items: { type: 'string', format: 'objectId' },
              description: 'Посилання на уроки',
            },
          },
          required: ['title', 'description', 'duration'],
          example: {
            title: 'Основи програмування',
            description: 'Цей курс охоплює основи програмування.',
            duration: 40,
          },
        },
        Lesson: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Унікальний ідентифікатор уроку' },
            title: { type: 'string', description: 'Назва уроку' },
            content: { type: 'string', description: 'Зміст уроку' },
          },
          required: ['title', 'content'],
          example: {
            id: '67890',
            title: 'Вступ до JavaScript',
            content: 'Основи синтаксису JavaScript.',
          },
        },
        Test: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Унікальний ідентифікатор тесту' },
            title: { type: 'string', description: 'Назва тесту' },
            questions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  questionText: { type: 'string', description: 'Текст питання' },
                  options: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Варіанти відповідей',
                  },
                  correctOption: {
                    type: 'number',
                    description: 'Індекс правильної відповіді',
                  },
                },
              },
            },
          },
          required: ['title', 'questions'],
          example: {
            id: '54321',
            title: 'Тест по JavaScript',
            questions: [
              {
                questionText: 'Що таке змінна?',
                options: ['Тип даних', 'Місце для збереження даних', 'Функція'],
                correctOption: 1,
              },
            ],
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'], // Шлях до ваших маршрутів
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;
