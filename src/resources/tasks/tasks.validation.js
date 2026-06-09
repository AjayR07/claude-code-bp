export const TASK_STATUSES = ['todo', 'in_progress', 'done'];

/**
 * Validate a task payload.
 *
 * @param {object} body  The incoming request body.
 * @param {object} opts
 * @param {boolean} opts.partial  When true (used for PUT/PATCH), only validate
 *   the fields that are present. When false (used for POST), required fields
 *   must be present and defaults are applied.
 * @returns {{ value: object, errors: string[] }}
 */
export function validateTask(body, { partial = false } = {}) {
  const errors = [];
  const value = {};

  if (!partial || body.title !== undefined) {
    if (typeof body.title !== 'string' || body.title.trim() === '') {
      errors.push('title is required and must be a non-empty string');
    } else {
      value.title = body.title.trim();
    }
  }

  if (body.description !== undefined) {
    if (typeof body.description !== 'string') {
      errors.push('description must be a string');
    } else {
      value.description = body.description;
    }
  }

  if (body.status !== undefined) {
    if (!TASK_STATUSES.includes(body.status)) {
      errors.push(`status must be one of: ${TASK_STATUSES.join(', ')}`);
    } else {
      value.status = body.status;
    }
  } else if (!partial) {
    value.status = 'todo';
  }

  return { value, errors };
}
