---
paths: ["src/resources/**"]
---

# Resource pattern rule

When working on any file under `src/resources/`, always follow the 5-file resource pattern:

1. **routes** — path wiring only. Use the `validate()` middleware factory for all writes.
2. **controller** — reads `req.validated` (never `req.body`), calls service, sends response.
3. **service** — business logic only. Throws `AppError` subclasses. Never touches HTTP.
4. **validation** — pure function returning `{ value, errors }`. Never throws.
5. **store** — creates a store instance with `createStore()`. Adds seed data.

When scaffolding a new resource, create **all 5 files** and mount the router in `src/app.js`.

Do not add business logic to controllers or HTTP knowledge to services.
