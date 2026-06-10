---
name: code-reviewer
description: >
  Review a diff or set of changed files against the project's conventions.
  Use this skill when asked to review, check, or audit code changes.
  Triggers: "review", "code review", "check my diff", "audit changes",
  "review this PR", "check what Claude wrote".
---

# Skill: code-reviewer

## Purpose

Run through a structured checklist against any recent changes in this repo.
Use this as a **subagent**: delegate the review to a fresh context, get a structured report back.

---

## Checklist

Work through each category. Report findings as ✅ pass / ⚠️ concern / ❌ fail.

### 1. Resource pattern compliance
- [ ] Are all 5 files present for each new resource?
- [ ] Does the controller read from `req.validated` (never `req.body`)?
- [ ] Does the service throw `AppError` subclasses (not raw status codes)?
- [ ] Does validation return `{ value, errors }` without throwing?
- [ ] Is the router mounted in `src/app.js`?

### 2. Validation coverage
- [ ] Do all POST and PUT routes use the `validate()` middleware?
- [ ] Does validation support `{ partial: true }` for PUT?
- [ ] Are all required fields enforced?
- [ ] Are enum values (status, priority) validated?

### 3. Test coverage
- [ ] Are there tests for the new endpoint(s)?
- [ ] Do tests cover the error path (missing fields, invalid values, 404)?
- [ ] Does `npm test` pass?

### 4. Code quality
- [ ] Does `npm run lint` pass without suppressions?
- [ ] Are there any `console.log` calls outside the logger middleware?
- [ ] Are there any hardcoded secrets, tokens, or API keys?

### 5. Error handling
- [ ] Are `NotFoundError` and `ValidationError` used correctly?
- [ ] Does every controller method have a `try/catch` forwarding to `next(err)`?

### 6. Pagination & filtering
- [ ] Does the list endpoint use `paginate()` from `../../utils/pagination.js`?
- [ ] Does the response include a `meta` object `{ page, limit, total, pages }`?

---

## How to run this review

```
/review  ← or just describe what changed and ask Claude to review it
```

Or in a subagent:
```
Run the code-reviewer skill on the changes in src/resources/projects/
```

## Output format

Report a summary block at the end:

```
## Review Summary
✅ Resource pattern: all 5 files present, roles respected
⚠️ Validation: PUT /api/projects/:id accepts unknown fields — consider stricter check
❌ Tests: no test for 404 on GET /api/projects/:id
```
