# Plugin Guide

Plugins bundle skills, agents, hooks, MCP servers, and slash commands into a single installable unit.
This guide covers two things:
1. Installing the **`claude-automation-recommender`** plugin to get immediate suggestions on this codebase.
2. How to create and share your own plugin.

---

## Part 1: claude-automation-recommender

The `claude-automation-recommender` plugin analyses your codebase and recommends automations — hooks, skills, agents, and workflows you could add to your Claude Code setup.

### Install

```bash
/plugin install claude-automation-recommender
```

Or from the marketplace browser:
```bash
/plugin
```
Search for `automation-recommender` and install from there.

### Run it on this repo

Once installed, point it at the project:

```
Analyse this Express API project and recommend automations I should add to my Claude Code setup.
Focus on: hooks that would save me time, skills for repetitive workflows, and agent roles that make sense for this codebase.
```

### What to look for

The recommender will inspect:
- File patterns and naming conventions (does a code generation skill make sense?)
- Test and lint commands (are there hook opportunities?)
- Resource patterns (is there a scaffolding skill missing?)
- Error patterns (are there common fix workflows to encode?)

**In this repo, expect recommendations around:**
- A hook to auto-run `npm test` after scaffold (PostToolUse on new files)
- A skill for adding test cases to existing test files
- A skill for the pagination/filtering pattern (reused across resources)
- An agent for the "explore → report file map" pattern

### Debrief questions

- Which recommendations were obvious? Which were surprising?
- Would you have thought of all of these without the recommender?
- Are any recommendations you'd reject? Why?

---

## Part 2: Build your own plugin

A plugin is a directory with a `PLUGIN.md` manifest and the usual `.claude/` subdirectories.

### Plugin structure

```
my-workshop-plugin/
  PLUGIN.md                     ← manifest (required)
  .claude/
    skills/
      new-resource/
        SKILL.md
      code-reviewer/
        SKILL.md
    agents/
      code-reviewer.md
      explorer.md
    rules/
      resources.md
      security.md
    settings.json               ← hooks and permissions
```

### PLUGIN.md manifest

```markdown
---
name: presidio-tasks-api
version: 1.0.0
description: >
  Claude Code setup for the Presidio Tasks API workshop.
  Includes the new-resource skill, code-reviewer agent, security rules,
  and lint/secret-guard hooks.
author: Presidio Engineering
---

# Presidio Tasks API Plugin

Installs the full Claude Code setup for the Tasks API workshop:
- Skills: new-resource, code-reviewer
- Agents: code-reviewer (Sonnet), explorer (Haiku)
- Rules: resource pattern, security
- Hooks: PostToolUse lint, PreToolUse secret guard
```

### Install a local plugin

```bash
/plugin install ./my-workshop-plugin
```

### Install from a Git repository

```bash
/plugin install github:presidio-engineering/claude-plugins#tasks-api
```

### Publish to the official marketplace

```bash
/plugin marketplace add anthropics/claude-plugins   # add the official registry
/plugin publish ./my-workshop-plugin                # publish your plugin
```

### Verify the install

After installing, check what loaded:
```bash
/memory    ← should show your skills and rules
/skills    ← lists installed skills
```

---

## The value of a plugin

Without a plugin, each new team member has to:
1. Find the right CLAUDE.md snippets
2. Manually add rules files
3. Set up hooks in settings.json
4. Install the right agents

With a plugin, they run one command and get the full, consistent setup.

> **Presidio pattern:** ship the workshop plugin as a baseline that every Presidio Express project can install in one command.
