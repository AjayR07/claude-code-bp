# Claude Code Workshop — Tasks API

A deliberately small Express REST API for managing tasks. It exists as the
**starting point for a hands-on Claude Code workshop**: clean enough that
everyone can read the whole thing in a few minutes, and structured so that each
Claude Code feature has an obvious place to land.

The full hands-on guide lives in **[`docs/WORKSHOP.md`](docs/WORKSHOP.md)**.

## Quick start

```bash
npm install
npm run dev      # start with auto-reload on http://localhost:3000
npm test         # run the test suite
npm run lint     # run ESLint
npm run format   # run Prettier
```

## API

Base URL: `http://localhost:3000`

| Method | Path             | Description            |
| ------ | ---------------- | ---------------------- |
| GET    | `/health`        | Health check           |
| GET    | `/api/tasks`     | List all tasks         |
| POST   | `/api/tasks`     | Create a task          |
| GET    | `/api/tasks/:id` | Get one task           |
| PUT    | `/api/tasks/:id` | Update a task          |
| DELETE | `/api/tasks/:id` | Delete a task          |

A task looks like this:

```json
{
  "id": "uuid",
  "title": "Write the docs",
  "description": "Optional text",
  "status": "todo",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

`status` must be one of `todo`, `in_progress`, or `done`. `title` is required.

### Try it

```bash
curl localhost:3000/api/tasks

curl -X POST localhost:3000/api/tasks \
  -H 'Content-Type: application/json' \
  -d '{"title":"Try Claude Code","status":"in_progress"}'
```

## Project structure

```
src/
  app.js                     # builds the Express app (mount new routers here)
  server.js                  # starts the HTTP server
  middleware/
    errorHandler.js          # central 500 handler
    notFound.js              # 404 handler
  store/
    createStore.js           # generic in-memory store factory
  resources/
    tasks/                   # one folder per resource — the pattern to copy
      tasks.routes.js        # endpoint -> controller wiring
      tasks.controller.js    # HTTP layer (request/response)
      tasks.service.js       # business logic
      tasks.validation.js    # payload validation
      tasks.store.js         # this resource's data + seed
tests/
  tasks.test.js              # integration tests (node:test + supertest)
docs/
  WORKSHOP.md                # the hands-on exercise guide
CLAUDE.md                    # project memory (you flesh this out in Exercise 1)
```

The **resource pattern** (routes → controller → service → validation → store) is
the single convention to internalize: every new resource copies it. That
repetition is exactly what makes it a good target for a Claude Code skill.

## Notes

- Data is **in-memory** and resets on restart — no database to set up.
- Node 20+ required (uses the built-in test runner and `node --watch`).
- No framework magic: the whole app is a few small files you can read top to bottom.
