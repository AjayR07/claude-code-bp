import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { tasksRouter } from './resources/tasks/tasks.routes.js';
import { requestLogger } from './middleware/requestLogger.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';
import { swaggerSpec } from './docs/swagger.js';

/**
 * Build and configure the Express application.
 *
 * Exported as a factory (rather than starting the server here) so tests can
 * create a fresh app instance without opening a network port.
 *
 * Resource routers are mounted under /api. To add a new resource:
 *   1. Create src/resources/<name>/ following the 5-file pattern.
 *   2. Import the router here and mount it under /api/<name>.
 *   3. Add the new resource's paths to src/docs/swagger.js.
 *
 * TODO (Exercise 3): mount the projectsRouter here once you've scaffolded it.
 */
export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(requestLogger);

  // Swagger UI at /api-docs — http://localhost:3000/api-docs
  // The root redirects there for convenience.
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'Tasks API — Claude Code Workshop',
    swaggerOptions: { defaultModelsExpandDepth: -1 },
  }));
  app.get('/', (req, res) => res.redirect('/api-docs'));

  app.get('/health', (req, res) =>
    res.json({ status: 'ok', uptime: process.uptime(), env: process.env.NODE_ENV ?? 'development' }),
  );

  // Mounted resources
  app.use('/api/tasks', tasksRouter);
  // app.use('/api/projects', projectsRouter);  ← uncomment in Exercise 3

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
