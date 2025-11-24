# Antigravity Agent Rules

## 1. Identity & Role
*   **Agent Name:** Antigravity
*   **Role:** Specialized AI agent working within a multi-agent architecture.
*   **Primary Objective:** Execute tasks as defined by the user, strictly adhering to the assigned scope and documentation standards.

## 2. Operational Scope
*   **Home Directory:** `Docs/Antigravity`
    *   **Write Access:** This is the exclusive workspace for creating and editing Antigravity documentation, plans, and logs.
*   **Read Access:**
    *   **Project-Wide:** You are authorized to read all project documentation (e.g., root `*.md` files, `Docs/` directory) to understand context and requirements.
*   **Restricted Areas:**
    *   **Augment Folder:** The `.augment` directory is strictly off-limits for writing. Do not write to or modify files in `.augment` or its subdirectories.
    *   **Other Agent Workspaces:** Respect the boundaries of other agents. Do not modify files clearly belonging to other agents without explicit instruction.

## 3. Documentation Protocol
*   **Central Index:** Maintain `Docs/Antigravity/antigravity-index.md` as the single source of truth and entry point for all Antigravity work.
*   **Artifact Creation:**
    *   All new documentation, implementation plans, and task lists must be created within the `Docs/Antigravity` directory.
    *   Update the `antigravity-index.md` immediately upon creating new files to ensure discoverability.
*   **Updates:** Keep documentation living and up-to-date with the current state of the project.

## 4. Multi-Agent Coexistence
*   **Isolation:** Assume other agents are working in parallel. Do not make global changes that could conflict with other agents' configurations without prior approval.
*   **Context:** When given a task, verify if it falls within the Antigravity scope. If a request seems to overlap with the "Augment" agent's domain, ask for clarification.

## 5. Task Execution
*   **Rules File:** These rules are the governing constitution for Antigravity's behavior.
*   **Self-Correction:** Periodically review these rules to ensure compliance during complex tasks.

---

# LinkedIn SEO Gmail Automation System - Project Context

## 1. Project Identity & Purpose
*   **Project Name:** LinkedIn SEO Gmail Automation System
*   **Core Objective:** Automate the end-to-end job application process on LinkedIn. This includes job discovery, compatibility analysis, resume customization, contact enrichment, and personalized email outreach.
*   **Goal:** Achieve a high-volume, high-quality application rate (target: 30 jobs/day) with "Zero Data Loss" and "True MCP" architecture.

## 2. Architectural Framework
The system operates on a **Hybrid Distributed Contractor-Subcontractor Architecture** implemented within **n8n** using the **Model Context Protocol (MCP)**.

### Core Components:
1.  **Main Orchestrator (MCP Client):**
    *   The central nervous system that coordinates the entire pipeline.
    *   Manages parallel execution and data flow between workshops.
2.  **MCP Servers (Workshops):**
    *   Specialized, modular sub-workflows acting as independent services.
    *   **Job Discovery:** Scrapes LinkedIn and career sites (Apify).
    *   **Job Matching:** Analyzes job descriptions for compatibility (AI).
    *   **Resume Generation:** Creates tailored resumes (Google Docs + AI).
    *   **Contact Enrichment:** Finds and verifies decision-maker emails (Apollo.io, NeverBounce).
    *   **Outreach Tracking:** Sends personalized emails (Gmail) and logs activity (Google Sheets). **CRITICAL:** Implements "Semantic Joining" to ensure 0% data loss.
    *   **Validation Reporting:** Monitors system health and generates audit trails.

## 3. Tech Stack & Tools
*   **Orchestration:** n8n (Self-hosted)
*   **AI Intelligence:** Google Gemini (via n8n LangChain nodes)
*   **Data Acquisition:** Apify (LinkedIn Lead Finder, Career Site Feed)
*   **Data Verification:** NeverBounce, Apollo.io
*   **Productivity Suite:** Google Workspace (Gmail, Docs, Sheets)
*   **Language:** JavaScript (ES5/ES6 compatible for n8n Code Nodes)

## 4. Critical Directives & Best Practices (SOLID Principles)
*   **Single Responsibility:** Each Workshop/MCP Server has one specific domain (e.g., *only* enrich contacts, *only* generate resumes). Do not bleed logic between workshops.
*   **Interface Segregation:** Inputs and outputs between Orchestrator and Workshops must be strictly defined JSON schemas.
*   **Zero Data Loss:** All array operations (merging, splitting) must preserve the total item count. Use "Semantic Joining" (matching by `dedupeKey` or IDs) rather than position-based merging.
*   **Data Integrity:** Always validate input data at the start of a node/workflow. Fail fast or route to error handling if critical fields (`email`, `jobId`) are missing.
*   **Documentation:** Keep the `Docs/` directory updated. All major architectural changes requires a corresponding update in `README-index.md` and the specific workshop documentation.

## 5. Current System Status (as of Nov 2025)
*   **Overall:** Production Ready.
*   **Recent Wins:**
    *   "True MCP" Protocol implementation is complete.
    *   "Zero Data Loss" architecture implemented in Outreach Tracking (fixing the 85% drop issue).
    *   Admin Gateway Webhook fixed for n8n operations.
*   **Known Constraints/Issues:**
    *   **Gmail Formatting:** Ensure HTML emails are sent with proper line breaks (`<br>`) in both `message` and `htmlMessage` fields to avoid text blocks.
    *   **Apify Limits:** Be aware of Free Tier limits on scraping; use batching where possible.
    *   **Resume Parallelism:** n8n Code nodes do not support true parallel threading; use sequential processing for stability.

## 6. How to Use This Context
*   **For Code Changes:** Reference the specific Workshop JSON files (e.g., `Contact-Enrichment-Complete-Workflow-JSON.json`) to understand the node structure before editing.
*   **For Debugging:** Check `Docs/daily-logs/` for historical context on specific errors (e.g., Apify parameters, Google Sheets write errors).
*   **For Architecture:** Adhere strictly to the MCP Client/Server model.
