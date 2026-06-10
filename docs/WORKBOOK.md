# Mastering Claude Code — Participant Workbook

**Presidio Internal Enablement · June 2026**
**Hands-on session: 45 minutes**

This workbook accompanies the "Mastering Claude Code" deck.
Each exercise is designed to be completable in ~5 minutes. Work through them in order — each one builds on the previous.

> **Before you start:** `npm install && npm run dev` — then open http://localhost:3000 to see the Swagger UI.

---

## Setup checklist

- [ ] Node 20+ installed (`node --version`)
- [ ] Repo cloned and `npm install` done
- [ ] `npm run dev` running — Swagger UI visible at http://localhost:3000
- [ ] Claude Code open in this directory (`claude` in the terminal)

---

## Exercise 1 — CLAUDE.md: Project Memory

**⏱ ~5 min | Feature: Memory · `/memory` · `#` shortcut**

### What you're doing

The repo ships with a complete `CLAUDE.md` (Exercise 0 is already done for you as a reference).
Your job is to **read it critically**, then practice the memory workflow.

### Steps

**1. Open the loaded memory in Claude Code:**
```
/memory
```
Observe which files are listed. You should see the root `CLAUDE.md` and `src/resources/CLAUDE.md`.

**2. Ask Claude to explain the project:**
```
Read this project and summarise it in 3 bullet points.
```
Notice how quickly Claude finds the right context — that's CLAUDE.md working.

**3. Try the `#` shortcut — add a personal note:**
```
# My laptop runs Node 22.3.0, not 20. Remember this for any version-specific commands.
```
Claude will ask which scope to save it to. Choose **User** (`~/.claude/CLAUDE.md`).

**4. Open `/memory` again** — confirm your note appeared.

**5. Try an import:** Edit the root `CLAUDE.md` and add this line anywhere:
```markdown
See @docs/architecture.md for the full data model.
```
Run `/memory` and observe that the architecture file now appears as imported content.

### What to look for
- The `src/resources/CLAUDE.md` is folder-scoped — it only appears when Claude touches `src/resources/**`
- The `#` shortcut saves to the right scope automatically
- Imports (`@path`) let you keep the root lean while pulling in detail on demand

### Debrief questions
> - What would you put in a CLAUDE.md for your own project?
> - What information is *not* worth including? (Think: what wouldn't change Claude's output?)

---

## Exercise 2 — Rules: Path-Scoped Automation

**⏱ ~4 min | Feature: Rules · `.claude/rules/`**

### What you're doing

Examine the existing rules, then write a new one that enforces something you care about.

### Steps

**1. Inspect the existing rules:**
```
Show me the contents of .claude/rules/ — what rules are active?
```

**2. Observe the path-scoping in action:**

Open `.claude/rules/resources.md` — notice the `paths: ["src/resources/**"]` front-matter.
Now ask Claude to edit a tasks file and watch how the rule activates:
```
Add a comment at the top of src/resources/tasks/tasks.service.js explaining what the service layer does.
```
You should see Claude acknowledge the resource pattern rule.

**3. Write a new rule for the `tests/` directory:**

Ask Claude to create it:
```
Create a path-scoped rule in .claude/rules/ that applies only to the tests/ directory.
The rule should remind Claude to: always use descriptive test names, always test both the happy path and at least one error case, and never mock the in-memory store.
```

**4. Verify it works:**
```
/memory
```
Confirm the new rule file appears in the rules list.

### What to look for
- Rules with `paths:` front-matter are zero-cost when Claude works outside that path
- The rule file is a markdown document — you control exactly what Claude reads
- Security rules in `.claude/rules/security.md` apply globally (no `paths:` filter)

### Debrief questions
> - What's the difference between putting something in CLAUDE.md vs a rules file?
> - What path would you scope a "frontend-only" rule to in your own project?

---

## Exercise 3 — Skills: Scaffold the Projects Resource

**⏱ ~8 min | Feature: Skills · `/new-resource` skill**

### What you're doing

Use the `new-resource` skill to let Claude scaffold the complete `projects` resource.
The validation and store stubs already exist — Claude fills in routes, controller, service, and wires everything up.

### Steps

**1. Look at what's already there:**
```
Show me what files exist under src/resources/projects/ and explain what each does.
```

**2. Trigger the new-resource skill:**
```
Use the new-resource skill to complete the projects resource.
The projects resource already has a store and validation — scaffold the service, controller, and routes.
Then mount it in app.js and write the tests.
```
Claude will detect the skill and follow its checklist.

**3. Watch the checklist execute.** The skill enforces:
- Service uses `paginate()` and throws `NotFoundError`
- Controller reads `req.validated` only
- Router mounted in `app.js`
- Tests written and passing

**4. After Claude finishes, verify:**
```bash
npm test
curl http://localhost:3000/api/projects
curl -X POST http://localhost:3000/api/projects \
  -H 'Content-Type: application/json' \
  -d '{"name":"My First Project"}'
```

**5. Reload Swagger UI** — Claude should have updated `src/docs/swagger.js`. If not, ask it to.

### What to look for
- Claude follows the skill's 5-file checklist without you having to repeat the pattern
- The skill works because its **description** matches the trigger words — read `.claude/skills/new-resource/SKILL.md`
- Skills encode a workflow once so the whole team gets it consistently

### Debrief questions
> - Without the skill, would Claude have followed the exact same pattern? Try it on a fresh session.
> - What repetitive workflow in your own codebase would make a good skill?

---

## Exercise 4 — Subagents: Code Review Without Polluting Context

**⏱ ~5 min | Feature: Subagents · delegation**

### What you're doing

Run the `code-reviewer` agent on the projects resource you just wrote — in its own context window, so the review noise doesn't land in yours.

### Steps

**1. Trigger the code-reviewer agent:**
```
Use the code-reviewer agent to review the projects resource I just created.
Check all 6 categories in its checklist and report findings.
```

**2. Watch what the agent does.** It will:
- Read the 5 resource files
- Run `npm test` and `npm run lint`
- Return a structured `## Review Summary` block

**3. Look at the token usage.** In Claude Code's sidebar, notice that the review work happened in a separate context. Your main thread only received the summary.

**4. Compare to doing it inline:**
```
Without using a subagent, review the projects resource yourself.
```
Notice how your main context fills with file content.

**5. Try the Explorer agent:**
```
Use the explorer agent to find every file in this repo that imports from ../../errors/AppError.js
and report the file paths and the specific error classes they use.
```

### What to look for
- The agent's tools are scoped: `Read` + `Bash(npm test)` + `Bash(npm run lint)` — it can't modify files
- The Explorer uses `claude-haiku-4-5` (cheaper) because its job is mechanical search
- The 5-line summary in your context vs 40K tokens in the subagent — that's the delegation win

### Debrief questions
> - When is a subagent *not* worth it? (Think: single quick edit to a file you already know)
> - What role would you define for a subagent on your own team? What tools would you give it?

---

## Exercise 5 — Permissions: Allow/Deny Lists

**⏱ ~4 min | Feature: Permissions · settings.json**

### What you're doing

Explore the existing permission settings, understand what they do, and add a custom rule.

### Steps

**1. Read the current settings:**
```
Show me .claude/settings.json and explain what each permission rule does.
```

**2. Test a denied command — ask Claude to run something blocked:**
```
Run rm -rf node_modules to clean the install.
```
Observe: Claude should decline or ask — the deny list blocks `rm -rf*`.

**3. Test an allowed command:**
```
Run the test suite.
```
This should work without prompting — `npm test` is on the allow list.

**4. Add a new allow rule** — let Claude run the dev server in the background:
```
Add a permission rule to .claude/settings.json that also allows Bash(node src/) so Claude can run individual Node files for testing purposes.
```

**5. Switch to Plan mode** (press `Shift+Tab` twice) and ask:
```
What would happen if I added a new resource called comments?
```
Notice: Claude plans without making any changes. Switch back with Shift+Tab.

### What to look for
- `allow` and `deny` are glob-matched against the full Bash command
- `deny` takes precedence over `allow` — order doesn't matter, deny always wins
- Plan mode (`Shift+Tab ×2`) is a permission mode, not just a feature — it enforces read-only

### Debrief questions
> - What commands would you always allow on your own project? What would you always deny?
> - When would you use `bypassPermissions` mode? (Answer: never on production, sandboxes/CI only)

---

## Exercise 6 — Hooks: Automated Quality Gates

**⏱ ~5 min | Feature: Hooks · lifecycle events**

### What you're doing

See the existing hooks in action, then add a new one.

### Steps

**1. Trigger the PostToolUse lint hook:**
Intentionally introduce a lint error:
```
Add an unused variable `const foo = 1;` at the top of src/config.js
```
After Claude writes the file, watch the hook fire automatically — the lint output should appear immediately without you asking.

**2. See the PreToolUse secret guard:**
```
Add a comment to src/config.js that contains the text AKIA1234567890ABCDEF
```
The PreToolUse hook scans the file content before writing and blocks with exit code 2.
Claude should report it was blocked.

**3. Add a new PostToolUse hook** — run tests after any new file is created under `tests/`:
```
Add a PostToolUse hook to .claude/settings.json that runs npm test whenever Claude creates a file matching tests/**/*.test.js
```

**4. Verify the hook format** — open `.claude/settings.json` and confirm the structure matches the existing hooks.

**5. Undo the lint error:**
```
Remove the unused variable from src/config.js and make sure lint passes.
```

### What to look for
- Hooks fire deterministically — they can't be talked out of running
- Exit code 2 = block the operation AND tell Claude why (the stderr message is fed back)
- A hook is a shell command: anything bash can do, a hook can enforce

### Debrief questions
> - What's the difference between a hook and a rule? (Hint: can a rule prevent a file from being written?)
> - What hook would you add to your own project that would save you the most time?

---

## Exercise 7 — MCP: Connect an External Server

**⏱ ~6 min | Feature: MCP · `claude mcp add`**

### What you're doing

Connect Claude Code to a real MCP server and observe the difference in how Claude accesses information.

### Choose your MCP (pick one):

#### Option A — Filesystem MCP (offline, zero credentials)
```bash
# Update .mcp.json first — replace REPLACE_WITH_YOUR_USERNAME with your actual username
# Then register:
claude mcp add filesystem \
  --command "npx -y @modelcontextprotocol/server-filesystem $(pwd)"
```
**Try:**
```
Using the filesystem MCP, list all files in src/ and give me a one-line summary of each.
```

#### Option B — Express documentation
```bash
claude mcp add express-docs \
  --command "npx -y @modelcontextprotocol/server-fetch"
```
**Try:**
```
Using the express-docs MCP, how does express.Router() handle nested routes?
Look up the official Express 4 documentation.
```

#### Option C — Node.js documentation
```bash
claude mcp add node-docs \
  --command "npx -y @modelcontextprotocol/server-fetch"
```
**Try:**
```
Using the node-docs MCP, what are all the methods available on a Map object in Node 20?
```

### Observe the following

**1. Tool call visibility** — watch the sidebar as Claude makes MCP tool calls vs built-in tool calls.

**2. Context cost** — run `/memory` and scroll to see if MCP tool schemas have appeared. More servers = more tokens per turn.

**3. Compare** — ask the same question with and without the MCP server:
```
What is the Express Router `strict` option?
```
With MCP: Claude fetches the live doc. Without: Claude uses training knowledge.

**4. Remove the server:**
```bash
claude mcp remove <server-name>
```
Ask the same question again. What changes?

> 📖 See `docs/MCP_SETUP.md` for the full menu of available servers.

### Debrief questions
> - When would you reach for MCP instead of just asking Claude from training knowledge?
> - If you connected 20 MCP servers at once, what problem would you create?

---

## Exercise 8 — Plugins: Install & Bundle

**⏱ ~5 min | Feature: Plugins · marketplace · bundling**

### Part A: Install the Automation Recommender

```bash
/plugin install claude-automation-recommender
```

Or browse the marketplace:
```bash
/plugin
```
Search for `automation-recommender`.

**Ask it to analyse this repo:**
```
Analyse this Express API project and recommend automations.
Focus on hooks that would save time, skills for repetitive patterns, and agent roles that fit this codebase.
```

Compare its recommendations to what's already in `.claude/` — see if it finds anything new.

### Part B: Bundle the workshop setup as a plugin

**1. Ask Claude to create the plugin manifest:**
```
Create a PLUGIN.md manifest for a plugin that bundles everything in .claude/ — 
skills, agents, rules, settings, and hooks. 
Call it presidio-tasks-api, version 1.0.0, authored by Presidio Engineering.
```

**2. Install your plugin locally:**
```bash
/plugin install .
```

**3. Verify the install:**
```bash
/memory    # skills and rules should appear
/skills    # lists installed skills
```

**4. See the value:**
If someone clones this repo fresh and runs `/plugin install .`, they get everything — rules, skills, agents, hooks — in one command.

### Debrief questions
> - What would you put in a Presidio-wide plugin that every project should have?
> - How would plugins change team onboarding? (Think: day-one setup time)

---

## Exercise 9 — Compaction: Managing a Full Context Window

**⏱ ~3 min | Feature: `/compact` · context discipline**

### What you're doing

Experience what compaction does and practice the discipline of knowing when to use it.

### Steps

**1. Check your current context usage** — look at the context indicator in Claude Code's UI (usually bottom left).

**2. Do some work to fill the context** — run through a few steps of Exercise 3 or 4 if you haven't already, or ask some exploratory questions about the codebase.

**3. Compact mid-session:**
```
/compact
```
Claude will summarise the thread. Read the summary — what did it keep? What did it lose?

**4. Ask about something from before the compact:**
```
What was the last task I asked you to do before the compaction?
```
Notice what Claude remembers vs what it lost.

**5. Try the handoff pattern:**
```
Write a PROGRESS.md file that captures: what we've done in this session, what's still todo, and any key decisions made. I want to be able to start a fresh session tomorrow and continue from here.
```
Then: `/clear` — start fresh. Load the progress file:
```
Read PROGRESS.md and continue from where we left off.
```

### What to look for
- `/compact` summarises; `/clear` wipes — use the right tool for the situation
- The handoff pattern survives a full reset with intent intact
- Auto-compaction fires at ~95% full — don't wait for it; compact proactively

### Debrief questions
> - When should you compact vs clear?
> - What would you put in a handoff file to make tomorrow's session as effective as possible?

---

## Bonus: The Ultra Flow

If you finish early, try chaining the whole workflow on a new task:

**Goal:** Add a `comments` resource (users can comment on tasks).

```
Explore → Use the explorer agent to map the codebase and identify where comments would integrate.
Plan    → In plan mode (Shift+Tab ×2), draft the implementation steps.
Execute → Use the new-resource skill to scaffold the comments resource.
Verify  → Use the code-reviewer agent on the diff.
Persist → Write a PROGRESS.md handoff if you run out of time.
```

This is the full Explore → Plan → Execute → Verify → Persist loop from Block 03 of the deck — now with all the features working together.

---

## Reference Card

| Feature | How to use |
|---|---|
| Memory | `/memory` to view · `#` to capture · `@path` to import |
| Rules | `.claude/rules/<name>.md` with `paths:` front-matter |
| Skills | Describe your task — skill auto-detects from trigger words |
| Subagents | Ask Claude to "use the \<name\> agent" |
| Plan mode | `Shift+Tab` twice — read-only until you approve |
| Compaction | `/compact` mid-task · `/clear` between tasks |
| Permissions | `.claude/settings.json` allow/deny lists |
| Hooks | `PreToolUse` / `PostToolUse` in settings.json |
| MCP | `claude mcp add <name> --command "..."` |
| Plugins | `/plugin install <path-or-name>` |

---

*Presidio Internal Enablement — June 2026 — Proprietary & Confidential*
