import { createStore } from '../../store/createStore.js';

export const tasksStore = createStore();

// A little seed data so GET /api/tasks returns something interesting on first run.
tasksStore.create({
  title: 'Install Node and Claude Code',
  description: 'Get the workshop laptop ready — node --version should show 20+',
  status: 'done',
  priority: 'high',
  tags: ['setup', 'onboarding'],
  dueDate: null,
  assignee: 'workshop-lead',
});

tasksStore.create({
  title: 'Clone the base repo',
  description: 'git clone and npm install. Check the README for the Quick Start.',
  status: 'done',
  priority: 'high',
  tags: ['setup'],
  dueDate: null,
  assignee: 'workshop-lead',
});

tasksStore.create({
  title: 'Flesh out CLAUDE.md',
  description: 'Exercise 1: add real project memory so Claude starts every session smarter.',
  status: 'in_progress',
  priority: 'high',
  tags: ['claude', 'memory'],
  dueDate: new Date(Date.now() + 3_600_000).toISOString(), // due in 1 hour
  assignee: null,
});

tasksStore.create({
  title: 'Create a path-scoped rule for src/resources/**',
  description: 'Exercise 2: add .claude/rules/resources.md with a paths filter.',
  status: 'todo',
  priority: 'medium',
  tags: ['claude', 'rules'],
  dueDate: null,
  assignee: null,
});

tasksStore.create({
  title: 'Scaffold the Projects resource with the new-resource skill',
  description: 'Exercise 3: run /new-resource from the skill and review every file Claude writes.',
  status: 'todo',
  priority: 'medium',
  tags: ['claude', 'skills'],
  dueDate: null,
  assignee: null,
});

tasksStore.create({
  title: 'Hook up the automation recommender plugin',
  description: 'Install claude-automation-recommender and see what it suggests for this codebase.',
  status: 'todo',
  priority: 'low',
  tags: ['claude', 'plugins'],
  dueDate: null,
  assignee: null,
});
