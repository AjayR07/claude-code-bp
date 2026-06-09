import { Router } from 'express';
import {
  listTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} from './tasks.controller.js';

export const tasksRouter = Router();

tasksRouter.get('/', listTasks);
tasksRouter.post('/', createTask);
tasksRouter.get('/:id', getTask);
tasksRouter.put('/:id', updateTask);
tasksRouter.delete('/:id', deleteTask);
