# Assignment — Tasks API v2: "Project Tracker"

**The vision (v2).** Tasks no longer float on their own: each one belongs to a
**Project** — a named bucket of work that is `active` or `archived`. Anyone can
leave **Comments** on a task to discuss it. And an **Activity Log** quietly
records every create, update, and delete across the whole API, so the team
always has an audit trail of what changed and when. Ship it like anything real:
every write validated, every resource tested, code lint-clean and documented —
then bundle your Claude Code setup (the skill, the reviewer, the hooks) into a
plugin so the next squad can drop it into their own service in one command.

**Today** you build just the first slice — the **Projects** resource — and touch
every Claude Code feature once on the way. Claude writes the code; you steer and
review.

## Things to Do

What happens | Feature
------------ | -------
"Read this repo and draft a CLAUDE.md" — accept, skim | **CLAUDE.md**
Add one path-scoped rule for `src/resources/**` | **Rules**
Create a `/new-resource` skill; use it to add **Projects** at `/api/projects` | **Skills**
Run a `code-reviewer` subagent on the diff — main context stays clean | **Subagents**
Add allow/deny permission rules to `.claude/settings.json` | **Permissions**
Add a PostToolUse hook that runs `npm run lint` after edits | **Hooks**
`claude mcp add` an external server (e.g. a database), then gate it | **MCP**
Bundle the skill + agent + hook into a plugin | **Plugins**
`/compact` mid-task and discuss what it preserves | **Compaction**

## Two rules of engagement

- **Pair up** — one drives Claude Code, one watches the context window and the docs.
- **Read every diff** before accepting it. Reviewing AI output is half the skill.
