---
paths: ["**"]
---

# Security rules

These rules apply to every file in this project.

## Secrets

- **Never** write API keys, tokens, passwords, or credentials to any file.
- **Never** include strings matching `AKIA[0-9A-Z]{16}` (AWS access keys).
- If a secret is needed for a test, use an environment variable read via `process.env`.

## Logging

- **Never** add `console.log` statements to production code paths.
- Logging in middleware (e.g., `requestLogger.js`) is acceptable.
- Use `// eslint-disable-next-line no-console` only in the logger and server.js.

## Validation

- **Every** POST and PUT endpoint must use the `validate()` middleware.
- Controllers must read from `req.validated`, never `req.body`.

## Destructive operations

- **Never** write shell commands that delete data without confirmation.
- **Never** modify or drop the in-memory store's `items` Map directly.
