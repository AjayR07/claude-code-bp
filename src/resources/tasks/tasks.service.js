import { tasksStore } from './tasks.store.js';
import { NotFoundError } from '../../errors/AppError.js';
import { paginate } from '../../utils/pagination.js';

/**
 * The service layer holds business logic and sits between the controller
 * (HTTP) and the store (data). It is the only layer allowed to throw
 * domain errors (NotFoundError, etc.) — the controller just calls the service
 * and lets the central error handler deal with anything thrown.
 */
export const tasksService = {
  /**
   * List tasks with optional filtering and pagination.
   *
   * Supported filters (all optional):
   *   status   — one of todo | in_progress | done
   *   priority — one of low | medium | high
   *   assignee — exact match
   *   tag      — task must include this tag
   *
   * @param {object} query  Express req.query
   */
  list(query = {}) {
    let items = tasksStore.list();

    if (query.status) {
      items = items.filter((t) => t.status === query.status);
    }
    if (query.priority) {
      items = items.filter((t) => t.priority === query.priority);
    }
    if (query.assignee) {
      items = items.filter((t) => t.assignee === query.assignee);
    }
    if (query.tag) {
      items = items.filter((t) => t.tags?.includes(query.tag));
    }

    // Sort: in_progress first, then todo, then done; newest first within each group
    const ORDER = { in_progress: 0, todo: 1, done: 2 };
    items.sort((a, b) => {
      const statusDiff = (ORDER[a.status] ?? 3) - (ORDER[b.status] ?? 3);
      if (statusDiff !== 0) return statusDiff;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return paginate(items, query);
  },

  /** @throws {NotFoundError} */
  get(id) {
    const task = tasksStore.get(id);
    if (!task) throw new NotFoundError('Task', id);
    return task;
  },

  create(data) {
    return tasksStore.create(data);
  },

  /**
   * @throws {NotFoundError}
   */
  update(id, data) {
    // Verify the task exists first so we throw the right error
    this.get(id);
    return tasksStore.update(id, data);
  },

  /**
   * @throws {NotFoundError}
   */
  remove(id) {
    this.get(id); // throws NotFoundError if missing
    tasksStore.remove(id);
  },
};
