import { tasksStore } from './tasks.store.js';

/**
 * The service layer holds business logic and sits between the controller
 * (HTTP) and the store (data). It is thin here, but giving every resource the
 * same shape makes the project predictable and easy to extend.
 */
export const tasksService = {
  list: () => tasksStore.list(),
  get: (id) => tasksStore.get(id),
  create: (data) => tasksStore.create(data),
  update: (id, data) => tasksStore.update(id, data),
  remove: (id) => tasksStore.remove(id),
};
