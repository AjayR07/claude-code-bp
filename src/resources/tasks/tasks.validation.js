export const TASK_STATUSES = ['todo', 'in_progress', 'done'];
export const TASK_PRIORITIES = ['low', 'medium', 'high'];

/**
 * Validate a task payload.
 *
 * @param {object} body   The incoming request body.
 * @param {object} opts
 * @param {boolean} opts.partial  When true (PUT), only validate present fields.
 * @returns {{ value: object, errors: string[] }}
 */
export function validateTask(body, { partial = false } = {}) {
  const errors = [];
  const value = {};

  // --- title ---
  if (!partial || body.title !== undefined) {
    if (typeof body.title !== 'string' || body.title.trim() === '') {
      errors.push('title is required and must be a non-empty string');
    } else {
      value.title = body.title.trim();
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
    if (!TASK_STATUSES.includes(body.status)) {
      errors.push(`status must be one of: ${TASK_STATUSES.join(', ')}`);
    } else {
      value.status = body.status;
    }
  } else if (!partial) {
    value.status = 'todo';
  }

  // --- priority ---
  if (body.priority !== undefined) {
    if (!TASK_PRIORITIES.includes(body.priority)) {
      errors.push(`priority must be one of: ${TASK_PRIORITIES.join(', ')}`);
    } else {
      value.priority = body.priority;
    }
  } else if (!partial) {
    value.priority = 'medium';
  }

  // --- tags ---
  if (body.tags !== undefined) {
    if (!Array.isArray(body.tags) || body.tags.some((t) => typeof t !== 'string')) {
      errors.push('tags must be an array of strings');
    } else {
      value.tags = body.tags.map((t) => t.trim().toLowerCase()).filter(Boolean);
    }
  } else if (!partial) {
    value.tags = [];
  }

  // --- dueDate ---
  if (body.dueDate !== undefined) {
    if (body.dueDate !== null) {
      const d = new Date(body.dueDate);
      if (isNaN(d.getTime())) {
        errors.push('dueDate must be a valid ISO 8601 date string or null');
      } else {
        value.dueDate = d.toISOString();
      }
    } else {
      value.dueDate = null;
    }
  } else if (!partial) {
    value.dueDate = null;
  }

  // --- assignee ---
  if (body.assignee !== undefined) {
    if (body.assignee !== null && typeof body.assignee !== 'string') {
      errors.push('assignee must be a string or null');
    } else {
      value.assignee = body.assignee ?? null;
    }
  } else if (!partial) {
    value.assignee = null;
  }

  return { value, errors };
}
