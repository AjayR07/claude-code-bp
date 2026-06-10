/**
 * Custom application error hierarchy.
 *
 * Having typed errors lets the central error handler respond with the right
 * HTTP status code without embedding status codes deep in the business logic.
 *
 * Usage:
 *   throw new NotFoundError('Task', id);
 *   throw new ValidationError(['title is required']);
 *   throw new ConflictError('A project with that slug already exists.');
 */

export class AppError extends Error {
  /** @param {string} message  @param {number} statusCode */
  constructor(message, statusCode = 500) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }
}

export class NotFoundError extends AppError {
  /**
   * @param {string} resource  e.g. "Task"
   * @param {string} id
   */
  constructor(resource, id) {
    super(`${resource} '${id}' not found`, 404);
  }
}

export class ValidationError extends AppError {
  /**
   * @param {string[]} errors  List of human-readable validation messages.
   */
  constructor(errors) {
    super('Validation failed', 400);
    this.errors = errors;
  }
}

export class ConflictError extends AppError {
  constructor(message) {
    super(message, 409);
  }
}
