import { AppError } from '../errors/AppError.js';

/**
 * Central error handler.
 *
 * Must be the last middleware registered in app.js (4-argument signature).
 *
 * Handles:
 *   - AppError subclasses (NotFoundError, ValidationError, ConflictError)
 *     → uses their statusCode and formats consistently
 *   - Unexpected errors → 500 with a generic message (never leaks stack traces)
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    const body = { error: err.message };
    if (err.errors) body.errors = err.errors; // ValidationError carries the list
    return res.status(err.statusCode).json(body);
  }

  // Unexpected error — log internally, send a safe response
  console.error('[unhandled]', err);
  res.status(500).json({ error: 'An unexpected error occurred' });
}
