import { test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';

const app = createApp();

test('GET /health returns ok', async () => {
  const res = await request(app).get('/health');
  assert.equal(res.status, 200);
  assert.equal(res.body.status, 'ok');
});

test('GET /api/tasks returns a list', async () => {
  const res = await request(app).get('/api/tasks');
  assert.equal(res.status, 200);
  assert.ok(Array.isArray(res.body.data));
});

test('POST /api/tasks creates a task with a default status', async () => {
  const res = await request(app).post('/api/tasks').send({ title: 'Write the tests' });
  assert.equal(res.status, 201);
  assert.equal(res.body.data.title, 'Write the tests');
  assert.equal(res.body.data.status, 'todo');
  assert.ok(res.body.data.id);
});

test('POST /api/tasks rejects an empty title', async () => {
  const res = await request(app).post('/api/tasks').send({ title: '   ' });
  assert.equal(res.status, 400);
  assert.ok(Array.isArray(res.body.errors));
});

test('POST /api/tasks rejects an invalid status', async () => {
  const res = await request(app)
    .post('/api/tasks')
    .send({ title: 'Bad status', status: 'wibble' });
  assert.equal(res.status, 400);
});

test('full create -> read -> update -> delete lifecycle', async () => {
  const created = await request(app).post('/api/tasks').send({ title: 'Temporary task' });
  const id = created.body.data.id;

  const fetched = await request(app).get(`/api/tasks/${id}`);
  assert.equal(fetched.status, 200);
  assert.equal(fetched.body.data.title, 'Temporary task');

  const updated = await request(app).put(`/api/tasks/${id}`).send({ status: 'done' });
  assert.equal(updated.status, 200);
  assert.equal(updated.body.data.status, 'done');

  const removed = await request(app).delete(`/api/tasks/${id}`);
  assert.equal(removed.status, 204);

  const missing = await request(app).get(`/api/tasks/${id}`);
  assert.equal(missing.status, 404);
});

test('GET /api/tasks/:id returns 404 for an unknown id', async () => {
  const res = await request(app).get('/api/tasks/does-not-exist');
  assert.equal(res.status, 404);
});
