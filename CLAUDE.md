# CLAUDE.md — Tasks API

This is the project memory file. Claude reads it at the start of every session.
Keep it short, specific, and current. Every line is re-read every turn — cut anything that doesn't change what you do.

> See `@docs/architecture.md` for a deeper architecture reference.

---

## What this is

A small **Express 4 REST API** (ESM, Node 20+) for managing tasks and projects.
In-memory data store — no database to set up. The whole app is a few small files you can read top to bottom.

## Quick commands

```bash
npm run dev      # auto-reload dev server on http://localhost:3000
npm test         # Node built-in test runner (node:test + supertest)
npm run lint     # ESLint — must be clean before any PR
npm run format   # Prettier write
```

Open **http://localhost:3000** → redirects to Swagger UI at `/api-docs`.
All endpoints are documented and explorable there.

## Folder structure

```
src/
  config.js              # all env-var config lives here
  app.js                 # Express app factory — mount new routers here
  server.js              # HTTP server entry point
  errors/
    AppError.js          # typed error hierarchy (NotFoundError, ValidationError, …)
  middleware/
    requestLogger.js     # structured request logger
    validate.js          # reusable validation middleware factory
    errorHandler.js      # central error handler — speaks AppError
    notFound.js          # 404 fallback
  utils/
    pagination.js        # paginate(items, query) helper
  store/
    createStore.js       # generic in-memory collection factory
  resources/
    tasks/               # fully implemented — the pattern to copy
    projects/            # starter stub — Exercise 3 completes this
tests/
  tasks.test.js
docs/
  WORKBOOK.md            # 9-exercise hands-on guide
  WORKSHOP.md            # original workshop exercise guide
  architecture.md        # detailed architecture reference
  MCP_SETUP.md           # MCP integration guide
  PLUGIN_GUIDE.md        # plugin bundling guide
```

## The resource pattern

Every resource lives in `src/resources/<name>/` and follows exactly 5 files:

| File | Role |
|---|---|
| `<name>.routes.js` | Wires URL paths to controller methods + validation middleware |
| `<name>.controller.js` | HTTP layer — reads `req.validated`, calls service, sends `res` |
| `<name>.service.js` | Business logic — the only layer that throws `AppError` subclasses |
| `<name>.validation.js` | Returns `{ value, errors }` — pure function, no HTTP knowledge |
| `<name>.store.js` | Creates a store instance + seed data |

To add a new resource, copy the pattern exactly. Use the `/new-resource` skill to let Claude scaffold it.

## Conventions

- **Never** import `req` or `res` into the service layer.
- **Never** import the store directly from a controller — always go through the service.
- All write endpoints must use the `validate()` middleware — controllers only touch `req.validated`.
- All list endpoints should support `?page` and `?limit` query params via `paginate()`.
- List endpoints may also support `?status`, `?priority`, `?assignee`, `?tag` filters.
- Error responses use the `AppError` hierarchy — never call `res.status(4xx)` inside a controller directly.
- ESLint and Prettier must pass before any change is accepted.

## Definition of done

A change is done when:
1. `npm test` passes (add tests for any new endpoints)
2. `npm run lint` is clean
3. The resource pattern is followed (no shortcuts)

## Hard rules

- **Never** add secrets, tokens, or API keys to any file.
- **Never** modify `src/store/createStore.js` — it's intentionally generic.
- **Never** delete the `tests/` directory or skip writing tests.

## Imports reference

See `@docs/architecture.md` for data model and request flow details.
