# Git Workflow

Git branching strategy, commit conventions, and documentation standards.

## Branch Strategy

### Main Branch

**Name**: `main`

**Purpose**: Production-ready code

**Protection**:
- All changes via documented commits
- Session handovers before major changes
- Documentation always up-to-date

---

## Commit Message Style

### Format

```
<type>: <subject>

[optional body]

[optional footer]
```

### Types

- `docs:` - Documentation changes
- `fix:` - Bug fixes
- `feat:` - New features
- `refactor:` - Code restructuring
- `test:` - Test additions/modifications
- `chore:` - Maintenance tasks

### Examples

**Documentation**:
```
docs: Add execution diagnostics for 12400 and 12567
```

**Feature Complete**:
```
✅ N8N Admin Gateway Webhook Fix Complete - 100 Workflows Verified
```

**Major Milestone**:
```
N8N MCP Access Eligibility Audit Complete - HYBRID APPROACH Approved
```

**Session Handover**:
```
docs: Session handover for 2025-11-24 - Draft Mode + Duplicate Email fixes
```

---

## Documentation Standards

### Directory Structure

```
Docs/
├── daily-logs/          # Session summaries
├── handover/            # Knowledge transfer docs
├── incidents/           # Execution diagnostic reports
├── architecture/        # System design docs
├── troubleshooting/     # Known issues and fixes
├── guides/              # How-to documents
├── workflows/           # Workflow-specific docs
└── testing/             # Testing procedures
```

### File Naming Conventions

**Date-Prefixed Files**:
```
YYYY-MM-DD-descriptive-topic.md
```

**Examples**:
- `2025-11-24-duplicate-email-fix.md`
- `2025-11-24-session-handover.md`
- `2025-11-23-n8n-mcp-failure-analysis.md`

**Topic Files** (no date):
```
TOPIC-NAME.md
```

**Examples**:
- `COMMON-ERRORS-KNOWN-ISSUES.md`
- `N8N-BEST-PRACTICES.md`
- `DEVELOPMENT-PHILOSOPHY.md`

---

## Commit Workflow

### 1. Check Status

```bash
git status
```

Verify:
- Which files changed
- Untracked files
- Current branch

### 2. Review Changes

```bash
git diff
git diff --staged
```

Understand what you're committing.

### 3. Stage Files

```bash
# Stage specific files
git add Docs/handover/2025-11-24-session-handover.md
git add CLAUDE.md

# Stage all documentation
git add Docs/

# Stage everything (use with caution)
git add .
```

### 4. Create Commit

```bash
git commit -m "docs: Session handover for 2025-11-24

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

**Format with HEREDOC** (recommended):
```bash
git commit -m "$(cat <<'EOF'
docs: Session handover for 2025-11-24

Completed:
- Draft mode fix deployed
- Deduplication logic created
- Documentation updated

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

### 5. Verify Commit

```bash
git log -1
git show HEAD
```

---

## Session Handover Workflow

### End of Session Checklist

1. **Document Changes**
   - Create/update daily log
   - Create session handover
   - Update CLAUDE.md (if needed)
   - Update troubleshooting docs (if new issues)

2. **Commit Documentation**
   ```bash
   git add Docs/
   git commit -m "docs: Session handover for YYYY-MM-DD"
   ```

3. **Verify Commit**
   ```bash
   git status  # Should be clean
   git log -1  # Check commit message
   ```

4. **Cloud Backup** (if Linear MCP installed)
   - Sync to Linear MCP
   - Verify dual persistence

### Using `/cd-update-docs` Command

**Automated workflow**:
```bash
/cd-update-docs
```

This command:
- Creates session documentation
- Commits to git
- Syncs to Linear MCP
- Generates tomorrow's checklist

See: [MODEL-USAGE-COMMANDS.md](MODEL-USAGE-COMMANDS.md)

---

## Best Practices

### DO

✅ **Write clear commit messages**
- Explain WHY, not just WHAT
- Include context for future readers
- Reference issue numbers if applicable

✅ **Commit related changes together**
- Group logical changes
- Keep commits focused
- One feature/fix per commit

✅ **Document as you go**
- Update docs in same commit as code
- Keep CLAUDE.md current
- Add to troubleshooting docs immediately

✅ **Use descriptive file names**
- Date-prefix session docs
- Use topic names for guides
- Be specific and searchable

### DON'T

❌ **Don't commit secrets**
- No `.env` files
- No `credentials.json`
- No API keys in code
- Use `.gitignore` properly

❌ **Don't commit generated files**
- No `node_modules/`
- No build artifacts
- No temporary files
- No IDE-specific files

❌ **Don't force push to main**
- Avoid `git push --force`
- Protect production branch
- Coordinate team if needed

❌ **Don't skip documentation**
- Always document changes
- Update handover files
- Keep README current

---

## File Organization

### Session Documentation

**Daily Logs** (`Docs/daily-logs/`):
- Session summaries
- Work completed
- Issues encountered
- Next steps

**Handovers** (`Docs/handover/`):
- Knowledge transfer
- Context for next session
- Critical decisions
- Tomorrow's checklist

**Incidents** (`Docs/incidents/`):
- Execution failures
- Root cause analysis
- Fix documentation
- Prevention strategies

### Permanent Documentation

**Architecture** (`Docs/architecture/`):
- System design
- Workflow structure
- Technical decisions
- Architectural principles

**Guides** (`Docs/guides/`):
- How-to documents
- Best practices
- Common tasks
- Development philosophy

**Troubleshooting** (`Docs/troubleshooting/`):
- Known issues
- Error patterns
- Fix procedures
- Workarounds

---

## Quick Reference Commands

### Check What Changed

```bash
git status                    # Show working tree status
git diff                      # Show unstaged changes
git diff --staged             # Show staged changes
git log --oneline -5          # Show last 5 commits
```

### Stage and Commit

```bash
git add Docs/                 # Stage all docs
git commit -m "message"       # Commit with message
git commit --amend            # Amend last commit (use sparingly)
```

### Review History

```bash
git log                       # Full commit history
git log --oneline             # Compact history
git show HEAD                 # Show last commit
git show <commit-hash>        # Show specific commit
```

### Undo Changes

```bash
git checkout -- <file>        # Discard changes to file
git reset HEAD <file>         # Unstage file
git reset --soft HEAD~1       # Undo last commit (keep changes)
```

**⚠️ Use with caution** - Consult team before undoing commits

---

## Related Documentation

- **Development Philosophy**: [DEVELOPMENT-PHILOSOPHY.md](DEVELOPMENT-PHILOSOPHY.md)
- **Model Usage Commands**: [MODEL-USAGE-COMMANDS.md](MODEL-USAGE-COMMANDS.md)
- **Common Tasks**: [COMMON-TASKS.md](COMMON-TASKS.md)

## Last Updated

2025-11-24
