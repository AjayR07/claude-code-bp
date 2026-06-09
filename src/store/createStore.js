import { randomUUID } from 'node:crypto';

/**
 * A tiny in-memory collection store.
 *
 * Every resource gets its own store instance. The data lives in a Map and is
 * lost when the process restarts — that is intentional for a workshop, since it
 * keeps the focus on the API and on Claude Code rather than on database setup.
 *
 * Each store exposes the same five operations, which keeps every resource in
 * the project consistent. When you add a new resource, reuse this factory.
 */
export function createStore() {
  const items = new Map();

  return {
    list() {
      return [...items.values()];
    },

    get(id) {
      return items.get(id) ?? null;
    },

    create(data) {
      const id = randomUUID();
      const now = new Date().toISOString();
      const record = { id, ...data, createdAt: now, updatedAt: now };
      items.set(id, record);
      return record;
    },

    update(id, data) {
      const existing = items.get(id);
      if (!existing) return null;
      const updated = { ...existing, ...data, id, updatedAt: new Date().toISOString() };
      items.set(id, updated);
      return updated;
    },

    remove(id) {
      return items.delete(id);
    },
  };
}
