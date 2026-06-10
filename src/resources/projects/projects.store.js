/**
 * Projects store.
 *
 * TODO (Exercise 3): This file is intentionally left as a stub.
 * Use the /new-resource skill in Claude Code to scaffold the full
 * projects resource — store, service, controller, and routes.
 *
 * Hint: once the service is ready, mount the router in src/app.js.
 */
import { createStore } from '../../store/createStore.js';

export const projectsStore = createStore();

// Seed data — a couple of projects for participants to see
projectsStore.create({
  name: 'API v2 — Project Tracker',
  description: 'The workshop assignment: add Projects, Comments, and Activity Log to the Tasks API.',
  status: 'active',
});

projectsStore.create({
  name: 'Internal Tooling',
  description: 'Archived example project.',
  status: 'archived',
});
