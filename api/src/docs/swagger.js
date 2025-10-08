const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'API Pipeline — Users/Posts + Engagement',
      version: '1.0.0',
      description:
        'API principal del proyecto académico. Gestiona Usuarios y Posts y expone un endpoint de Engagement (agrega Comments/Reactions).',
    },
    servers: [
      { url: process.env.API_BASE_URL || 'http://localhost:3001', description: 'Local' }
    ],
    components: {
      schemas: {
        Error: { type: 'object', properties: { message: { type: 'string' } } },
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string' }
          }
        },
        NewUser: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string' }
          }
        },
        UpdateUser: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string' }
          }
        },
        Post: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            userId: { type: 'integer' },
            title: { type: 'string' },
            content: { type: 'string' }
          }
        },
        NewPost: {
          type: 'object',
          required: ['userId', 'title', 'content'],
          properties: {
            userId: { type: 'integer' },
            title: { type: 'string' },
            content: { type: 'string' }
          }
        },
        UpdatePost: {
          type: 'object',
          properties: {
            userId: { type: 'integer' },
            title: { type: 'string' },
            content: { type: 'string' }
          }
        },
        ReactionBreakdown: {
          type: 'object',
          additionalProperties: { type: 'integer' },
          example: { like: 1, love: 2, laugh: 0, wow: 0, sad: 0, angry: 0 }
        },
        ReactionsCount: {
          type: 'object',
          properties: {
            postId: { type: 'integer' },
            total: { type: 'integer' },
            breakdown: { $ref: '#/components/schemas/ReactionBreakdown' }
          }
        },
        Engagement: {
          type: 'object',
          properties: {
            postId: { type: 'integer' },
            comments: { type: 'integer' },
            reactions: { $ref: '#/components/schemas/ReactionsCount' }
          }
        }
      }
    }
  },
  apis: [path.resolve(__dirname, '../routes/*.js')],
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;