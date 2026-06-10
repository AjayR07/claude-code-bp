import { Router } from 'express';
import { tasksController } from './tasks.controller.js';
import { validateTask } from './tasks.validation.js';
import { validate } from '../../middleware/validate.js';

export const tasksRouter = Router();

tasksRouter.get('/', tasksController.list);
tasksRouter.get('/:id', tasksController.get);
tasksRouter.post('/', validate(validateTask), tasksController.create);
tasksRouter.put('/:id', validate(validateTask, { partial: true }), tasksController.update);
tasksRouter.delete('/:id', tasksController.remove);
