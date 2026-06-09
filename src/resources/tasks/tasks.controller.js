import { tasksService } from './tasks.service.js';
import { validateTask } from './tasks.validation.js';

export function listTasks(req, res) {
  res.json({ data: tasksService.list() });
}

export function getTask(req, res) {
  const task = tasksService.get(req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json({ data: task });
}

export function createTask(req, res) {
  const { value, errors } = validateTask(req.body ?? {});
  if (errors.length > 0) return res.status(400).json({ errors });

  const task = tasksService.create(value);
  res.status(201).json({ data: task });
}

export function updateTask(req, res) {
  const { value, errors } = validateTask(req.body ?? {}, { partial: true });
  if (errors.length > 0) return res.status(400).json({ errors });

  const task = tasksService.update(req.params.id, value);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json({ data: task });
}

export function deleteTask(req, res) {
  const removed = tasksService.remove(req.params.id);
  if (!removed) return res.status(404).json({ error: 'Task not found' });
  res.status(204).send();
}
