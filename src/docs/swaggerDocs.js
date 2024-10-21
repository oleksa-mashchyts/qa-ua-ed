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
          required: ['title', 'description'],
          properties: {
            id: {
              type: 'string',
              description: 'Унікальний ідентифікатор курсу',
            },
            title: {
              type: 'string',
              description: 'Назва курсу',
            },
            description: {
              type: 'string',
              description: 'Опис курсу',
            },
          },
          example: {
            id: '12345',
            title: 'Основи програмування',
            description: 'Цей курс охоплює основи програмування.',
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
