import express from 'express';
import { tasksRouter } from './resources/tasks/tasks.routes.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';

/**
 * Build and configure the Express application.
 *
 * It is exported as a factory (rather than starting the server here) so tests
 * can create a fresh app instance without opening a network port.
 */
export function createApp() {
  const app = express();

  app.use(express.json());

  app.get('/health', (req, res) => res.json({ status: 'ok' }));

  // Mount resources here. Each new resource gets its own router under /api.
  app.use('/api/tasks', tasksRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
