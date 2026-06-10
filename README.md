# Claude Code Workshop — Tasks API

A deliberately small but well-structured Express REST API for managing tasks.
It is the **hands-on base for the Presidio "Mastering Claude Code" workshop** —
structured so that every Claude Code feature has an obvious place to land.

Open **http://localhost:3000** after starting the server to see the interactive Swagger UI.

## Quick start

```bash
npm install
npm run dev      # dev server with auto-reload → http://localhost:3000
npm test         # run the test suite (14 tests)
npm run lint     # ESLint
npm run format   # Prettier
```

## API

| Method | Path | Description |
|---|---|---|
| GET | `/` | → redirects to Swagger UI |
| GET | `/api-docs` | Interactive Swagger UI |
| GET | `/health` | Health check + uptime |
| GET | `/api/tasks` | List tasks (filter + paginate) |
| POST | `/api/tasks` | Create a task |
| GET | `/api/tasks/:id` | Get one task |
| PUT | `/api/tasks/:id` | Update a task (partial) |
| DELETE | `/api/tasks/:id` | Delete a task |

### Task shape

```json
{
  "id": "uuid",
  "title": "Write the docs",
  "description": "Optional text",
  "status": "todo",
  "priority": "medium",
  "tags": ["claude", "workshop"],
  "dueDate": "2026-12-31T00:00:00.000Z",
  "assignee": "ajay",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

### Query params for `GET /api/tasks`

| Param | Values | Default |
|---|---|---|
| `status` | `todo` \| `in_progress` \| `done` | — |
| `priority` | `low` \| `medium` \| `high` | — |
| `assignee` | any string | — |
| `tag` | any string | — |
| `page` | integer ≥ 1 | 1 |
| `limit` | 1–100 | 20 |

## Project structure

```
src/
  config.js                    # all env-var config (PORT, LOG_REQUESTS, …)
  app.js                       # Express app factory
  server.js                    # HTTP server entry
  docs/
    swagger.js                 # OpenAPI 3.0 spec
  errors/
    AppError.js                # NotFoundError, ValidationError, ConflictError
  middleware/
    requestLogger.js           # structured request logger
    validate.js                # validation middleware factory
    errorHandler.js            # central error handler
    notFound.js                # 404 fallback
  utils/
    pagination.js              # paginate(items, query) helper
  store/
    createStore.js             # generic in-memory collection factory
  resources/
    CLAUDE.md                  # folder-scoped memory (loads for src/resources/**)
    tasks/                     # fully implemented — the pattern to copy
    projects/                  # starter stub — Exercise 3 completes this
tests/
  tasks.test.js
docs/
  WORKBOOK.md                  ← START HERE for hands-on exercises
  WORKSHOP.md                  # original workshop exercise guide
  architecture.md              # data model + request flow reference
  MCP_SETUP.md                 # MCP integration guide
  PLUGIN_GUIDE.md              # claude-automation-recommender + plugin bundling
.claude/
  rules/
    resources.md               # path-scoped: src/resources/**
    security.md                # global security rules
  skills/
    new-resource/SKILL.md      # scaffold a 5-file resource
    code-reviewer/SKILL.md     # structured code review checklist
  agents/
    code-reviewer.md           # Sonnet review agent (read-only + npm test/lint)
    explorer.md                # Haiku exploration agent (read-only)
  settings.json                # allow/deny lists + PostToolUse lint + PreToolUse secret guard
.mcp.json                      # filesystem MCP stub (update path, then claude mcp add)
CLAUDE.md                      # project memory — the reference implementation
ASSIGNMENT.md                  # original workshop assignment description
```

## The resource pattern

Every resource in `src/resources/<name>/` follows five files:

| File | Role |
|---|---|
| `<name>.routes.js` | Path wiring + `validate()` middleware |
| `<name>.controller.js` | HTTP only — reads `req.validated`, calls service |
| `<name>.service.js` | Business logic — throws `AppError` subclasses |
| `<name>.validation.js` | Pure validation — returns `{ value, errors }` |
| `<name>.store.js` | Store instance + seed data |

Use the `/new-resource` skill in Claude Code to scaffold any new resource.

## Notes

- Data is **in-memory** — resets on restart. No database to set up.
- Node 20+ required (built-in test runner + `node --watch`).
- `PORT` env var controls the port (default 3000).
- Set `LOG_REQUESTS=false` to silence the request logger in tests.
