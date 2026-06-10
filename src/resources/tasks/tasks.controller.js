import { tasksService } from './tasks.service.js';

/**
 * HTTP layer for the Tasks resource.
 *
 * Controllers are kept thin: parse route params, call the service, format the
 * response. Business logic lives in the service; validation lives in the
 * validate middleware (req.validated is already clean by the time we get here).
 */
export const tasksController = {
  /** GET /api/tasks */
  list(req, res, next) {
    try {
      const result = tasksService.list(req.query);
      res.json(result); // { data, meta }
    } catch (err) {
      next(err);
    }
  },

  /** GET /api/tasks/:id */
  get(req, res, next) {
    try {
      const task = tasksService.get(req.params.id);
      res.json({ data: task });
    } catch (err) {
      next(err);
    }
  },

  /** POST /api/tasks */
  create(req, res, next) {
    try {
      const task = tasksService.create(req.validated);
      res.status(201).json({ data: task });
    } catch (err) {
      next(err);
    }
  },

  /** PUT /api/tasks/:id */
  update(req, res, next) {
    try {
      const task = tasksService.update(req.params.id, req.validated);
      res.json({ data: task });
    } catch (err) {
      next(err);
    }
  },

  /** DELETE /api/tasks/:id */
  remove(req, res, next) {
    try {
      tasksService.remove(req.params.id);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  },
};
