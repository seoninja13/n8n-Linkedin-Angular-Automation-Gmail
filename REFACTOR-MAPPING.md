# CLAUDE.md Refactoring Mapping

## Existing Documentation Review

### ✅ Files That Already Exist (Referenced in CLAUDE.md)

1. **Docs/n8n-operations-manual.md** (40KB, ~900 lines) ⚠️ EXCEEDS 500 LINES
   - N8N integration methods (HYBRID architecture)
   - Admin Gateway, MCP Server, REST API

2. **Docs/project-operations-manual.md** (39KB, ~900 lines) ⚠️ EXCEEDS 500 LINES
   - Email infrastructure
   - SOPs, troubleshooting

3. **Docs/architecture/shared-sub-workflow-architecture.md**
   - Workflow relationships

4. **Docs/architecture/dual-path-test-mode-architecture.md**
   - Email routing logic

5. **Docs/troubleshooting/COMMON-ERRORS-KNOWN-ISSUES.md** (~10KB, ~250 lines) ✅
   - Known issues database

6. **Docs/Integrations/reddit-gemini-indode-claude.md** (~6KB, ~150 lines) ✅
   - Gemini CLI usage guide

7. **Docs/testing/linkedin-automation-testing-criteria.md** (~13KB, ~300 lines) ✅
   - Quality gates and testing framework

### 📁 Existing Directory Structure

```
Docs/
├── analysis/           (11 files)
├── Antigravity/        (2 files)
├── architecture/       (12 files) ✅ EXISTS
├── backups/
├── bugs/
├── code-fixes/
├── daily-logs/         (50+ files)
├── diagnostics/
├── fixes/              (30+ files)
├── handover/           (15+ files)
├── implementation/     (22 files)
├── incidents/          (6 files)
├── Integrations/       (1 file) ✅ EXISTS
├── investigations/
├── mcp-servers/
├── milestones/
├── n8n-configs/
├── patterns/
├── pending-tasks/
├── project-milestones/
├── project-status/     (7 files)
├── quality-analysis/
├── reviews/
├── strategy/
├── technical/
├── testing/            (3 files) ✅ EXISTS
├── tracking/
└── troubleshooting/    (9 files) ✅ EXISTS
```

### ❌ Directories That DON'T Exist (Proposed in Plan)

- `Docs/guides/` - DOES NOT EXIST
- `Docs/workflows/` - DOES NOT EXIST

## Content Mapping: CLAUDE.md → Existing Files

### Section 1: Project Overview (Lines 6-17)
**Current Location**: CLAUDE.md
**Existing File**: None matches this exactly
**Action**: **KEEP IN CLAUDE.md** (8 lines, within 2-5 line guideline if condensed)

### Section 2: Architecture (Lines 19-58)
**Current Location**: CLAUDE.md (40 lines)
**Existing Files**:
- `Docs/architecture/shared-sub-workflow-architecture.md`
- `Docs/architecture/dual-path-test-mode-architecture.md`
**Action**: **REFERENCE EXISTING FILES** instead of duplicating

### Section 3: N8N Integration Methods (Lines 60-151)
**Current Location**: CLAUDE.md (92 lines)
**Existing File**: `Docs/n8n-operations-manual.md` ⚠️ 900 lines (EXCEEDS 500)
**Action**:
1. **SPLIT** `n8n-operations-manual.md` into multiple files (under 500 lines each)
2. **REFERENCE** split files from CLAUDE.md

###Section 4: Common Development Tasks (Lines 153-196)
**Current Location**: CLAUDE.md (44 lines)
**Existing Files**: None found
**Potential Match**: `Docs/daily-logs/` has task-specific logs
**Action**: **CREATE** `Docs/guides/COMMON-TASKS.md` (NEW DIRECTORY NEEDED)

### Section 5: Gemini CLI Usage (Lines 198-268)
**Current Location**: CLAUDE.md (71 lines)
**Existing File**: `Docs/Integrations/reddit-gemini-indode-claude.md` ✅
**Action**: **REFERENCE EXISTING FILE ONLY**

### Section 6: Model Usage Tracking (Lines 270-401)
**Current Location**: CLAUDE.md (132 lines)
**Existing Files**: None found
**Action**: **CREATE** `Docs/guides/MODEL-USAGE-COMMANDS.md` (NEW)

### Section 7: Documentation Structure (Lines 403-415)
**Current Location**: CLAUDE.md (13 lines)
**Action**: **CONDENSE** to 3 lines in CLAUDE.md

### Section 8: Critical Node Reference (Lines 417-431)
**Current Location**: CLAUDE.md (15 lines)
**Existing Files**: `Docs/architecture/outreach-tracking-architectural-gap-analysis.md`
**Action**: **CREATE** `Docs/workflows/CRITICAL-NODES.md` (NEW DIRECTORY + FILE)

### Section 9: Critical Architectural Principles (Lines 433-473)
**Current Location**: CLAUDE.md (40 lines)
**Existing Files**:
- `Docs/architecture/job-discovery-timeframe-strategy.md` ✅
- `Docs/architecture/n8n-parallel-execution-limitations.md` ✅
- `Docs/architecture/multi-keyword-campaign-implementation-strategy.md` ✅
**Action**: **REFERENCE EXISTING FILES ONLY** (all 3 exist!)

### Section 10: Quality Gates (Lines 475-501)
**Current Location**: CLAUDE.md (27 lines)
**Existing File**: `Docs/testing/linkedin-automation-testing-criteria.md` ✅
**Action**: **REFERENCE EXISTING FILE ONLY**

### Section 11: N8N Best Practices (Lines 503-515)
**Current Location**: CLAUDE.md (13 lines)
**Existing Files**: None found
**Action**: **CREATE** `Docs/guides/N8N-BEST-PRACTICES.md` (NEW)

### Section 12: Core Development Philosophy (Lines 517-550)
**Current Location**: CLAUDE.md (33 lines)
**Existing Files**: None found
**Action**: **CREATE** `Docs/guides/DEVELOPMENT-PHILOSOPHY.md` (NEW)

### Section 13: Known Issues (Lines 552-549)
**Current Location**: CLAUDE.md (40+ lines)
**Existing File**: `Docs/troubleshooting/COMMON-ERRORS-KNOWN-ISSUES.md` ✅
**Potential Match**: `Docs/handover/2025-11-24-session-handover-FINAL.md` (recent issues)
**Action**: **UPDATE** existing troubleshooting file + **REFERENCE** it

### Section 14: Project Dependencies (Lines 551-563)
**Current Location**: CLAUDE.md (13 lines)
**Existing Files**: None found
**Action**: **CONDENSE** to 2 lines in CLAUDE.md (reference package.json)

### Section 15: Quick Links (Lines 565-574)
**Current Location**: CLAUDE.md (10 lines)
**Action**: **KEEP IN CLAUDE.md** (already concise)

### Section 16: Git Workflow (Lines 576-592)
**Current Location**: CLAUDE.md (17 lines)
**Existing Files**: None found
**Action**: **CREATE** `Docs/guides/GIT-WORKFLOW.md` (NEW)

## Refactoring Summary

### ✅ Files to REFERENCE (Already Exist)
1. `Docs/n8n-operations-manual.md` (needs splitting first)
2. `Docs/project-operations-manual.md` (needs splitting first)
3. `Docs/architecture/shared-sub-workflow-architecture.md`
4. `Docs/architecture/dual-path-test-mode-architecture.md`
5. `Docs/architecture/job-discovery-timeframe-strategy.md`
6. `Docs/architecture/n8n-parallel-execution-limitations.md`
7. `Docs/architecture/multi-keyword-campaign-implementation-strategy.md`
8. `Docs/troubleshooting/COMMON-ERRORS-KNOWN-ISSUES.md`
9. `Docs/Integrations/reddit-gemini-indode-claude.md`
10. `Docs/testing/linkedin-automation-testing-criteria.md`

### 🆕 New Files to CREATE (Don't Exist)
1. `Docs/guides/COMMON-TASKS.md` (~150 lines)
2. `Docs/guides/MODEL-USAGE-COMMANDS.md` (~250 lines)
3. `Docs/guides/N8N-BEST-PRACTICES.md` (~150 lines)
4. `Docs/guides/DEVELOPMENT-PHILOSOPHY.md` (~200 lines)
5. `Docs/guides/GIT-WORKFLOW.md` (~100 lines)
6. `Docs/workflows/CRITICAL-NODES.md` (~100 lines)

### ⚠️ Files to SPLIT (Exceed 500 Lines)
1. `Docs/n8n-operations-manual.md` (900 lines → 2 files)
2. `Docs/project-operations-manual.md` (900 lines → 2 files)

### 📝 New Directories Needed
1. `Docs/guides/` (for common tasks, best practices, philosophy, git)
2. `Docs/workflows/` (for critical nodes reference)

## Final File Count

**Before Refactoring**:
- CLAUDE.md: 596 lines
- Missing organized guides

**After Refactoring**:
- CLAUDE.md: ~150-200 lines (lean index)
- 6 new guide files (all < 500 lines)
- 4 split files from existing (all < 500 lines)
- Total: 10 new/split files

## Action Plan

1. ✅ Create `Docs/guides/` directory
2. ✅ Create `Docs/workflows/` directory
3. ✅ Create 6 new guide files
4. ✅ Split 2 large files
5. ✅ Rewrite CLAUDE.md as index
6. ✅ Validate all files < 500 lines
