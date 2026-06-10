---
name: new-resource
description: >
  Scaffold a new Express resource following the 5-file pattern.
  Use this skill whenever someone asks to add a new resource, new endpoint,
  or new API entity. Triggers: "new resource", "add endpoint", "scaffold",
  "create resource", "add api", "new entity".
---

# Skill: new-resource

## What you're building

An Express resource following the project's **5-file pattern**:

```
src/resources/<name>/
  <name>.routes.js       ← Router wiring
  <name>.controller.js   ← HTTP layer
  <name>.service.js      ← Business logic
  <name>.validation.js   ← Payload validation
  <name>.store.js        ← Store instance + seed data
```

After scaffolding, you must also:
- Mount the router in `src/app.js`
- Add tests to `tests/<name>.test.js`

---

## Steps

### 1. Confirm the resource name
Ask: *"What should the resource be called? (e.g. 'projects', 'comments', 'tags')"*
Use lowercase plural. The singular is used for error messages.

### 2. Confirm the fields
Ask: *"What fields does a <name> record have, and which are required?"*
Note: `id`, `createdAt`, `updatedAt` are added automatically by the store.

### 3. Scaffold the 5 files

**`<name>.validation.js`** — Create first. Pure validation, no Express imports.
```js
// Pattern to follow: src/resources/tasks/tasks.validation.js
// Must export: validateXxx(body, { partial = false } = {})
// Must return: { value: object, errors: string[] }
// Must support partial validation for PUT
```

**`<name>.store.js`** — Import `createStore` from `../../store/createStore.js`. Add 2-3 seed records.

**`<name>.service.js`** — Import the store and `AppError` subclasses from `../../errors/AppError.js`.
```js
// Must throw NotFoundError for missing records
// Must use paginate() from ../../utils/pagination.js for list()
// List must accept query filters (at minimum: status if the resource has one)
```

**`<name>.controller.js`** — Read from `req.validated` (never `req.body`). Call service methods.
```js
// list → res.json(result)   where result = { data, meta }
// get  → res.json({ data: item })
// create → res.status(201).json({ data: item })
// update → res.json({ data: item })
// remove → res.status(204).end()
```

**`<name>.routes.js`** — Wire paths to controller + validation middleware.
```js
import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
// Use validate(validateXxx) for POST
// Use validate(validateXxx, { partial: true }) for PUT
```

### 4. Mount in app.js
Add the router to `src/app.js` under `/api/<name>`.

### 5. Write tests
Create `tests/<name>.test.js` following the pattern in `tests/tasks.test.js`.
Cover: list, list with filter, create with defaults, create with all fields,
invalid payloads, full CRUD lifecycle, 404 for unknown ID.

### 6. Verify
Run `npm test` and `npm run lint`. Both must pass before you're done.

---

## Checklist before declaring done

- [ ] 5 files created under `src/resources/<name>/`
- [ ] Validation uses `{ partial }` option for PUT
- [ ] Service throws `NotFoundError` (not raw 404 responses)
- [ ] Service uses `paginate()` for list
- [ ] Controller reads `req.validated` only
- [ ] Router mounted in `src/app.js`
- [ ] `tests/<name>.test.js` written and passing
- [ ] `npm run lint` clean
