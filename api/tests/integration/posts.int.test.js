const path = require('path');
const fs = require('fs');
const request = require('supertest');

const TEST_DB = path.resolve(__dirname, '../../tmp/test-db.js');
process.env.DB_PATH = TEST_DB;

const app = require('../../src/index.js'); 

beforeEach(() => {
  fs.mkdirSync(path.dirname(TEST_DB), { recursive: true });
  fs.writeFileSync(TEST_DB, JSON.stringify({
    users: [{ id: 1, name: 'Ada', email: 'ada@example.com', password: 'x' }],
    posts: []
  }, null, 2));
});

test('POST /api/posts crea post (201)', async () => {
  const res = await request(app).post('/api/posts').send({
    userId: 1, title: 'Hola', content: 'Mundo'
  });

  expect(res.status).toBe(201);
  expect(res.body).toMatchObject({ userId: 1, title: 'Hola' });
});

test('POST /api/posts userId inexistente (404)', async () => {
  const res = await request(app).post('/api/posts').send({
    userId: 999, title: 'Hola', content: 'Mundo'
  });

  expect(res.status).toBe(404);
  expect(res.body.message).toMatch(/Usuario no encontrado/i);
});

test('POST /api/posts faltan campos (400)', async () => {
  const res = await request(app).post('/api/posts').send({
    title: 'Sin contenido'
  });

  expect(res.status).toBe(400);
  expect(res.body.message).toMatch(/obligatorios/i);
});
