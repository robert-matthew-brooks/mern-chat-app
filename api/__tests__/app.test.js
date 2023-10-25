const request = require('supertest');
const app = require('../app');
const { db, mongoUrl } = require('../db/connection');

afterAll(async () => {
  await db.disconnect();
});

describe('/status', () => {
  it('200: should respond with OK status', async () => {
    const { text } = await request(app).get('/status').expect(200);

    expect(text).toBe('Server OK');
  });
});
