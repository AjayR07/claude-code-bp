import { config } from '../config.js';

/**
 * Pagination helper.
 *
 * Parses `?page` and `?limit` query params, applies safe clamping, and
 * slices a full in-memory list into a page.
 *
 * Usage (in a service):
 *   const { data, meta } = paginate(allItems, req.query);
 *
 * @param {any[]}  items   The full, unsliced list.
 * @param {object} query   Express req.query (page, limit are read from here).
 * @returns {{ data: any[], meta: { page: number, limit: number, total: number, pages: number } }}
 */
export function paginate(items, query = {}) {
  const limit = Math.min(
    parseInt(query.limit ?? config.pagination.defaultLimit, 10) || config.pagination.defaultLimit,
    config.pagination.maxLimit,
  );
  const page = Math.max(parseInt(query.page ?? '1', 10) || 1, 1);
  const total = items.length;
  const pages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const data = items.slice(start, start + limit);

  return {
    data,
    meta: { page, limit, total, pages },
  };
}
