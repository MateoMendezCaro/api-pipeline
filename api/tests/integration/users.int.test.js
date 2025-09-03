const path = require('path');
const fs = require('fs');
const request = require('supertest');

const TEST_DB = path.resolve(__dirname, '../../tmp/test-db.js');
process.env.DB_PATH = TEST_DB;         

const app = require('../../src/index.js'); 


beforeEach(() => {
  fs.mkdirSync(path.dirname(TEST_DB), { recursive: true });
  fs.writeFileSync(TEST_DB, JSON.stringify({ users: [], posts: [] }, null, 2));
});

test('POST /api/users crea usuario (201)', async () => {
  const res = await request(app).post('/api/users').send({
    name: 'Ada',
    email: 'ada@example.com',
    password: 'secret'
  });

  expect(res.status).toBe(201);
  expect(res.body).toHaveProperty('id');
  expect(res.body.email).toBe('ada@example.com');
});

test('POST /api/users email duplicado (409)', async () => {
  await request(app).post('/api/users').send({
    name: 'Ada', email: 'ada@example.com', password: 'x'
  });

  const res = await request(app).post('/api/users').send({
    name: 'Otra', email: 'ada@example.com', password: 'x'
  });

  expect(res.status).toBe(409);
  expect(res.body.message).toMatch(/ya está en uso/i);
});

test('POST /api/users campos faltantes (400)', async () => {
  const res = await request(app).post('/api/users').send({
    name: 'SinEmail'
  });
  expect(res.status).toBe(400);
  expect(res.body.message).toMatch(/obligatorios|Email inválido/i);
});

