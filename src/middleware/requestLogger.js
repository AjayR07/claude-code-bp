import { config } from '../config.js';

/**
 * Structured request logger middleware.
 *
 * Logs method, path, status code, and response time in a consistent format.
 * Controlled by config.logging.requests — set LOG_REQUESTS=false to silence.
 *
 * Example output:
 *   [2026-01-15T10:30:00.000Z] POST /api/tasks 201 12ms
 */
export function requestLogger(req, res, next) {
  if (!config.logging.requests) return next();

  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const ts = new Date().toISOString();
    console.log(`[${ts}] ${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
  });

  next();
}
