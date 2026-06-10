export const PROJECT_STATUSES = ['active', 'archived'];

/**
 * Validate a project payload.
 *
 * A project is a named bucket that tasks belong to.
 *
 * @param {object} body
 * @param {object} opts
 * @param {boolean} opts.partial  When true (PUT), only validate present fields.
 * @returns {{ value: object, errors: string[] }}
 */
export function validateProject(body, { partial = false } = {}) {
  const errors = [];
  const value = {};

  // --- name ---
  if (!partial || body.name !== undefined) {
    if (typeof body.name !== 'string' || body.name.trim() === '') {
      errors.push('name is required and must be a non-empty string');
    } else {
      value.name = body.name.trim();
    }
  }

  // --- description ---
  if (body.description !== undefined) {
    if (typeof body.description !== 'string') {
      errors.push('description must be a string');
    } else {
      value.description = body.description;
    }
  }

  // --- status ---
  if (body.status !== undefined) {
    if (!PROJECT_STATUSES.includes(body.status)) {
      errors.push(`status must be one of: ${PROJECT_STATUSES.join(', ')}`);
    } else {
      value.status = body.status;
    }
  } else if (!partial) {
    value.status = 'active';
  }

  return { value, errors };
}
