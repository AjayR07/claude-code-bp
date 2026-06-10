# Resource pattern — folder-scoped memory

This file is loaded automatically by Claude when it works on any file under `src/resources/**`.
It contains rules that only apply to this subtree — zero token cost when Claude is working elsewhere.

## The 5-file pattern

Every resource under this directory follows the same 5-file shape:

```
<resource>/
  <resource>.routes.js       # Router — path → middleware → controller
  <resource>.controller.js   # HTTP layer (request/response only)
  <resource>.service.js      # Business logic + throws AppError subclasses
  <resource>.validation.js   # Pure validation — returns { value, errors }
  <resource>.store.js        # Store instance + seed data
```

When Claude adds a new resource here, it **must** create all 5 files.
Never merge two roles into one file (e.g., do not put business logic in the controller).

## Naming convention

- Directory: lowercase plural (`tasks`, `projects`, `comments`)
- Files: `<singular>.<role>.js` e.g. `task.service.js`

Wait — actually the pattern is `<plural>.<role>.js`. Check `tasks/` as the reference.

## Validation rule

All validation functions must:
- Return `{ value: object, errors: string[] }` (never throw)
- Accept `{ partial: boolean }` as a second argument for PATCH/PUT
- Never import Express or touch `req`/`res`

## Service rule

All services must:
- Import from the store (`<name>.store.js`)
- Import from `../../errors/AppError.js` and throw typed errors
- Never import Express or touch `req`/`res`

## Mounting

After scaffolding a new resource, **remember to mount the router in `src/app.js`**.
Look for the `// app.use('/api/projects', ...)` comment as a guide.
