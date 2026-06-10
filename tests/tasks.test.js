import { test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';

process.env.LOG_REQUESTS = 'false'; // keep test output clean
const app = createApp();

// ─── Health ───────────────────────────────────────────────────────────────────

test('GET /health returns ok with uptime', async () => {
  const res = await request(app).get('/health');
  assert.equal(res.status, 200);
  assert.equal(res.body.status, 'ok');
  assert.ok(typeof res.body.uptime === 'number');
});

// ─── List ─────────────────────────────────────────────────────────────────────

test('GET /api/tasks returns a paginated list', async () => {
  const res = await request(app).get('/api/tasks');
  assert.equal(res.status, 200);
  assert.ok(Array.isArray(res.body.data));
  assert.ok(res.body.meta, 'response should include meta');
  assert.ok(typeof res.body.meta.total === 'number');
});

test('GET /api/tasks?status=done filters by status', async () => {
  const res = await request(app).get('/api/tasks?status=done');
  assert.equal(res.status, 200);
  assert.ok(res.body.data.every((t) => t.status === 'done'));
});

test('GET /api/tasks?priority=high filters by priority', async () => {
  const res = await request(app).get('/api/tasks?priority=high');
  assert.equal(res.status, 200);
  assert.ok(res.body.data.every((t) => t.priority === 'high'));
});

// ─── Create ───────────────────────────────────────────────────────────────────

test('POST /api/tasks creates a task with defaults', async () => {
  const res = await request(app).post('/api/tasks').send({ title: 'Write the tests' });
  assert.equal(res.status, 201);
  assert.equal(res.body.data.title, 'Write the tests');
  assert.equal(res.body.data.status, 'todo');
  assert.equal(res.body.data.priority, 'medium');
  assert.deepEqual(res.body.data.tags, []);
  assert.equal(res.body.data.dueDate, null);
  assert.ok(res.body.data.id);
});

test('POST /api/tasks creates a task with all optional fields', async () => {
  const payload = {
    title: 'Full task',
    description: 'Has everything',
    status: 'in_progress',
    priority: 'high',
    tags: ['claude', 'workshop'],
    dueDate: '2026-12-31',
    assignee: 'ajay',
  };
  const res = await request(app).post('/api/tasks').send(payload);
  assert.equal(res.status, 201);
  assert.equal(res.body.data.priority, 'high');
  assert.deepEqual(res.body.data.tags, ['claude', 'workshop']);
  assert.equal(res.body.data.assignee, 'ajay');
  assert.ok(res.body.data.dueDate);
});

test('POST /api/tasks rejects an empty title', async () => {
  const res = await request(app).post('/api/tasks').send({ title: '   ' });
  assert.equal(res.status, 400);
  assert.ok(Array.isArray(res.body.errors));
});

test('POST /api/tasks rejects an invalid status', async () => {
  const res = await request(app).post('/api/tasks').send({ title: 'Bad', status: 'wibble' });
  assert.equal(res.status, 400);
});

test('POST /api/tasks rejects an invalid priority', async () => {
  const res = await request(app).post('/api/tasks').send({ title: 'Bad', priority: 'urgent' });
  assert.equal(res.status, 400);
});

test('POST /api/tasks rejects tags that are not an array of strings', async () => {
  const res = await request(app).post('/api/tasks').send({ title: 'Bad', tags: 'not-array' });
  assert.equal(res.status, 400);
});

// ─── Full lifecycle ────────────────────────────────────────────────────────────

test('full create → read → update → delete lifecycle', async () => {
  const created = await request(app)
    .post('/api/tasks')
    .send({ title: 'Temporary task', priority: 'low', tags: ['temp'] });
  assert.equal(created.status, 201);
  const id = created.body.data.id;
  assert.equal(created.body.data.priority, 'low');

  const fetched = await request(app).get(`/api/tasks/${id}`);
  assert.equal(fetched.status, 200);
  assert.equal(fetched.body.data.title, 'Temporary task');

  const updated = await request(app).put(`/api/tasks/${id}`).send({ status: 'done', priority: 'high' });
  assert.equal(updated.status, 200);
  assert.equal(updated.body.data.status, 'done');
  assert.equal(updated.body.data.priority, 'high');

  const removed = await request(app).delete(`/api/tasks/${id}`);
  assert.equal(removed.status, 204);

  const missing = await request(app).get(`/api/tasks/${id}`);
  assert.equal(missing.status, 404);
});

// ─── 404 / error cases ────────────────────────────────────────────────────────

test('GET /api/tasks/:id returns 404 for an unknown id', async () => {
  const res = await request(app).get('/api/tasks/does-not-exist');
  assert.equal(res.status, 404);
  assert.ok(res.body.error);
});

test('GET /truly-unknown-route returns 404', async () => {
  const res = await request(app).get('/truly-unknown-route');
  assert.equal(res.status, 404);
});

test('GET / redirects to /api-docs', async () => {
  const res = await request(app).get('/');
  assert.equal(res.status, 302);
  assert.ok(res.headers.location.includes('/api-docs'));
});
