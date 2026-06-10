# MCP Setup Guide

Model Context Protocol (MCP) connects Claude Code to external systems — databases, APIs, documentation, and more.
This guide covers: the included filesystem example, and a menu of additional servers you can add.

---

## Included starter: Filesystem MCP

The repo ships with `.mcp.json` pre-configured for the `@modelcontextprotocol/server-filesystem` server.
It requires no credentials and works completely offline — the safest choice for a live session.

### Step 1: Update the path

Open `.mcp.json` and replace `REPLACE_WITH_YOUR_USERNAME` with your actual macOS username:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/YOUR_USERNAME/Projects/Internal/claude-code-workshop"
      ]
    }
  }
}
```

### Step 2: Register with Claude Code

```bash
claude mcp add filesystem \
  --command "npx -y @modelcontextprotocol/server-filesystem /path/to/this/repo"
```

Or let Claude Code pick it up from `.mcp.json` automatically if it's in your project root.

### Step 3: Verify

Open Claude Code and try:
```
Using the filesystem MCP, list all files under src/resources/ and describe what each one does.
```

You should see Claude use the `list_directory` and `read_file` MCP tools instead of its built-in tools.
Notice the tool calls in the sidebar — that's MCP in action.

---

## Choosing your own MCP server

Below is a curated menu. Pick one that fits your workflow and add it during Exercise 7.

### Option A: Express documentation

Perfect for this workshop — Claude can look up Express API docs in context.

```bash
claude mcp add express-docs \
  --command "npx -y @modelcontextprotocol/server-fetch" \
  --env FETCH_URL="https://expressjs.com/en/4x/api.html"
```

**Try it:**
```
Using the express-docs MCP, what are the valid options for the express.Router() constructor?
```

---

### Option B: Node.js documentation

```bash
claude mcp add node-docs \
  --command "npx -y @modelcontextprotocol/server-fetch" \
  --env FETCH_URL="https://nodejs.org/docs/latest-v20.x/api/"
```

**Try it:**
```
Using the node-docs MCP, what does the node:crypto randomUUID function return?
```

---

### Option C: GitHub (requires PAT)

Connect Claude to your GitHub repos, issues, and PRs.

```bash
claude mcp add github \
  --command "npx -y @modelcontextprotocol/server-github" \
  --env GITHUB_PERSONAL_ACCESS_TOKEN=your_token_here
```

**Try it:**
```
Using the github MCP, list the open issues in this repository.
```

> ⚠️ Never paste your PAT into `.mcp.json` — use environment variables only.

---

### Option D: SQLite (if you want a real database)

```bash
npm install better-sqlite3
claude mcp add sqlite \
  --command "npx -y @modelcontextprotocol/server-sqlite" \
  --env SQLITE_DB_PATH="./workshop.db"
```

**Try it:**
```
Using the sqlite MCP, create a tasks table with the same schema as our in-memory store and insert the seed tasks.
```

---

## Key things to observe during the exercise

1. **Tool schemas in context** — Open `/memory` and notice MCP tool schemas appear. More servers = more tokens per turn.
2. **Tool calls vs built-in tools** — MCP calls appear in the tool sidebar; built-in calls don't. Notice the latency difference.
3. **Gating a server** — Add a server, try a prompt, then remove it with `claude mcp remove <name>`. How does Claude's behaviour change?

---

## Reference

- Official MCP docs: https://modelcontextprotocol.io
- Claude Code MCP guide: https://code.claude.com/docs/en/mcp
- Marketplace servers: https://github.com/modelcontextprotocol/servers
