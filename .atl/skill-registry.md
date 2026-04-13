# Skill Registry

**Delegator use only.** Any agent that launches sub-agents reads this registry to resolve compact rules, then injects them directly into sub-agent prompts. Sub-agents do NOT read this registry or individual SKILL.md files.

See `_shared/skill-resolver.md` for the full resolution protocol.

## User Skills

| Trigger | Skill | Path |
|---------|-------|------|
| When creating a pull request, opening a PR, or preparing changes for review | branch-pr | ~/.claude/skills/branch-pr/SKILL.md |
| When writing Go tests, using teatest, or adding test coverage | go-testing | ~/.claude/skills/go-testing/SKILL.md |
| When creating a GitHub issue, reporting a bug, or requesting a feature | issue-creation | ~/.claude/skills/issue-creation/SKILL.md |
| When user says "judgment day", "dual review", "doble review", "juzgar" | judgment-day | ~/.claude/skills/judgment-day/SKILL.md |
| When user asks to create a new skill, add agent instructions, or document patterns for AI | skill-creator | ~/.claude/skills/skill-creator/SKILL.md |

## Compact Rules

Pre-digested rules per skill. Delegators copy matching blocks into sub-agent prompts as `## Project Standards (auto-resolved)`.

### branch-pr
- Every PR MUST link an approved issue (`Closes/Fixes/Resolves #N`) — no exceptions
- Every PR MUST have exactly one `type:*` label
- Branch naming: `type/description` — lowercase, only `a-z0-9._-` (e.g. `feat/user-login`, `fix/crash`)
- Commit format: `type(scope): description` — conventional commits only, no Co-Authored-By
- PR body requires: linked issue, type checkbox, summary bullets, changes table, test plan
- Valid types: `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `revert`
- Run `shellcheck scripts/*.sh` before pushing if shell scripts were modified
- Automated checks validate: issue linkage, `status:approved` label, `type:*` label, shellcheck

### go-testing
- Use table-driven tests: `tests := []struct{ name, input, expected string; wantErr bool }{...}`
- Run subtests with `t.Run(tt.name, func(t *testing.T) { ... })`
- For Bubbletea TUI: use `teatest` package — `teatest.NewTestModel(t, model)`
- Golden file pattern: store expected output in `testdata/*.golden`, update with `-update` flag
- Never use `time.Sleep` in tests — use `teatest.WaitFor` or channel signals instead
- `t.Helper()` in helper functions so failures point to the call site

### issue-creation
- Blank issues are disabled — MUST use a template (bug report or feature request)
- Every new issue gets `status:needs-review` automatically; `status:approved` required before opening a PR
- Questions go to Discussions, NOT issues
- Search for duplicates before creating (`gh issue list --search "keyword"`)
- Bug report: requires description, reproduction steps, expected vs actual behavior, OS, agent, shell
- Feature request: requires problem description, proposed solution, affected area

### judgment-day
- Launch exactly TWO sub-agents in parallel — never sequential, never do the review yourself
- Neither judge knows about the other — no cross-contamination in prompts
- Resolve skill registry BEFORE launching judges; inject compact rules into both Judge prompts AND Fix Agent prompt
- Verdict synthesis: CRITICAL = must fix before merge, WARNING = should fix, SUGGESTION = optional
- Fix Agent runs only when CRITICAL or WARNING issues are found — not for suggestions only
- Re-judge after fixes: if both pass → done; if still failing after 2 iterations → escalate to user

### skill-creator
- SKILL.md required at `skills/{skill-name}/SKILL.md` — frontmatter with name, description, trigger
- Description field MUST contain "Trigger:" text — this is how the registry finds skills
- Compact rules in registry must be 5-15 lines: actionable only, no motivation or full examples
- Don't create skills for trivial, one-off, or already-documented patterns
- Always save to engram after creating: `mem_save(topic_key: "skill-registry", ...)`

## Project Conventions

| File | Path | Notes |
|------|------|-------|
| — | — | No project-level convention files found |

Read the convention files listed above for project-specific patterns and rules.
