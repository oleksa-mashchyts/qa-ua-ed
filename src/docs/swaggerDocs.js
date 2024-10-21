const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'Документація для API',
      contact: {
        name: 'Ваша команда',
        email: 'contact@example.com',
      },
      servers: [
        {
          url: 'http://localhost:3000', // ваш сервер
        },
      ],
    },
    components: {
      schemas: {
        Course: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'objectId',
              description: 'Автоматично генерується MongoDB',
            },
            title: {
              type: 'string',
              description: 'Назва курсу',
            },
            description: {
              type: 'string',
              description: 'Опис курсу',
            },
            duration: {
              type: 'number',
              description: 'Тривалість курсу в годинах',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Дата створення курсу, генерується автоматично',
            },
            lessons: {
              type: 'array',
              items: {
                type: 'string',
                format: 'objectId',
                description: 'Посилання на уроки (необов\'язково при створенні курсу)',
              },
            },
          },
          required: ['title', 'description', 'duration'],
          example: {
            id: '61234abcdf56789e12345fgh',
            title: 'Основи програмування',
            description: 'Цей курс охоплює основи програмування.',
            duration: 40,
            createdAt: '2024-01-01T12:00:00.000Z',
            lessons: ['63456abcdf56789e12345def', '63456abcdf56789e12345xyz'],
          },
        },
        Lesson: {
          type: 'object',
          required: ['title', 'content'],
          properties: {
            id: {
              type: 'string',
              description: 'Унікальний ідентифікатор уроку',
            },
            title: {
              type: 'string',
              description: 'Назва уроку',
            },
            content: {
              type: 'string',
              description: 'Зміст уроку',
            },
          },
          example: {
            id: '67890',
            title: 'Вступ до JavaScript',
            content: 'Зміст уроку включає основи синтаксису JavaScript.',
          },
        },
        Test: {
          type: 'object',
          required: ['title', 'questions'],
          properties: {
            id: {
              type: 'string',
              description: 'Унікальний ідентифікатор тесту',
            },
            title: {
              type: 'string',
              description: 'Назва тесту',
            },
            questions: {
              type: 'array',
              description: 'Питання для тесту',
              items: {
                type: 'object',
                properties: {
                  questionText: {
                    type: 'string',
                    description: 'Текст питання',
                  },
                  options: {
                    type: 'array',
                    items: {
                      type: 'string',
                    },
                    description: 'Можливі варіанти відповідей',
                  },
                  correctOption: {
                    type: 'number',
                    description: 'Індекс правильної відповіді',
                  },
                },
              },
            },
          },
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
  },
  apis: ['./routes/*.js'], // шлях до ваших маршрутів
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;
