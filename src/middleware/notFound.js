import { AppError } from '../errors/AppError.js';

/**
 * 404 handler — catches any request that didn't match a defined route.
 */
export function notFound(req, res, next) {
  next(new AppError(`Cannot ${req.method} ${req.path}`, 404));
}
