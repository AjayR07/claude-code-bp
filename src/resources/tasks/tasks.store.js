import { createStore } from '../../store/createStore.js';

export const tasksStore = createStore();

// A little seed data so GET /api/tasks returns something on first run.
tasksStore.create({
  title: 'Install Node and Claude Code',
  description: 'Get the workshop laptop ready',
  status: 'done',
});
tasksStore.create({
  title: 'Clone the base repo',
  description: 'git clone and npm install',
  status: 'in_progress',
});
tasksStore.create({
  title: 'Run your first slash command',
  description: 'Try /code-review in Claude Code',
  status: 'todo',
});
