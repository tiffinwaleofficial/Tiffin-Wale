# Partner App Memory Bank

## 🧠 Overview
This memory bank serves as the **source of truth** for the TiffinWale Partner App project intelligence, decision history, user preferences, and implementation standards. It is **version-controlled, actively maintained**, and **must be consulted before making architectural or behavioral decisions**.

---

## 🗂️ Memory Bank Structure

```
memory-bank/
├── README.md                    # This file - overview and navigation
├── project-overview.md          # High-level project understanding
├── architecture-patterns.md    # Technical architecture and patterns
├── api-integration-status.md    # Current API implementation status
├── development-workflow.md      # Development processes and workflows
├── component-library.md         # UI components and design system
├── state-management.md          # Zustand stores and state patterns
├── authentication-flow.md       # Auth implementation and security
├── deployment-strategy.md       # Build, deployment, and DevOps
├── known-issues.md             # Current challenges and workarounds
└── decision-log.md             # Critical decisions and rationale
```

---

## 🔁 Memory Bank Protocol

1. **Required Reads**: Every task **must** begin with reading all relevant files in the `memory-bank/` directory.
2. **Live Updates**: 
   - Document **all significant changes** immediately.
   - Use commit messages that reflect updates to project intelligence.
3. **Manual Triggers**: 
   - Use `"update memory bank"` to request or confirm memory alignment.
4. **Automation**: 
   - A diff of the memory bank must be included in any pull request that alters documentation.
   - Cursor will flag unreferenced decisions or undocumented changes.

---

## 👤 User Preferences

| Area | Preference |
|------|------------|
| Documentation | Must be comprehensive, structured, current |
| Change Tracking | Document updates inline as they happen |
| Communication | Clear, concise, and assumption-free |
| Language | Use formal tone with declarative style |
| Code Quality | TypeScript-first, error handling, testing |

> 🔒 *Deviations from preferences must be explicitly justified and approved.*

---

## 🧩 Implementation Patterns

> All significant design and logic patterns must be added here once used more than once.

Each entry must include:
- **Pattern Name**
- **Intent / Use Case**
- **Code Snippet or Structure**
- **When to Use**
- **When NOT to Use**
- **Associated Risks**

---

## ⚠️ Known Challenges

> This section must grow during active development. For each challenge:

- **Title**
- **Description**
- **Workarounds / Decisions**
- **Status (Open, In Progress, Solved)**
- **Owner**

> 🔄 *Cursor will prompt updates to this section after unresolved errors or blockers.*

---

## 🔧 Tool Usage Protocol

| Tool | Purpose | Rule |
|------|---------|------|
| `memory-bank/` | Source of truth for project context | Must be consulted and updated for all major features |
| `.cursorrules` | Project intelligence + decision evolution | Read-only unless agreed updates are made |
| Docs | Markdown format only | All team members must follow naming & structure conventions |

---

## 🧭 Decision Evolution Log

> Tracks critical decisions, reasons, reversals, and debates

Each decision must be logged as follows:

```markdown
### Decision #001 – Partner API Integration Strategy
- Date: 2024-12-20
- Author: AI Assistant
- Summary: Implemented 7 critical partner APIs for core functionality
- Reason: Enable real-time partner operations and data management
- Affected Modules: API Client, Stores, Components
- Reversal Conditions: None
- Status: Active
```

> ✍️ *Every design or infrastructure decision affecting multiple modules must be logged.*

---

## 🔒 Enforcement & Review

- This file and `memory-bank/` are subject to weekly review.
- PRs without appropriate `.cursorrules` or `memory-bank/` updates will be rejected.
- Cursor will auto-flag inconsistencies or missing patterns based on commit messages and task scope.

---

## 🔄 Change Control

- Edits to memory bank files must follow this protocol:
  - Proposed via PR with tag: `[MEMORY BANK UPDATE]`
  - Includes summary of change + justification
  - Reviewed by product or engineering lead

---

## 📊 Current Project Status

### ✅ **COMPLETED**
- Partner app architecture and structure
- Authentication system with JWT tokens
- State management with Zustand stores
- UI component library and design system
- 7 critical partner APIs implemented and ready for integration

### 🔄 **IN PROGRESS**
- API integration with frontend components
- Real-time order management
- Menu management system
- Analytics and reporting

### ⏳ **PLANNED**
- Notification system
- Image upload functionality
- Advanced analytics
- Support ticket system

---

*Last Updated: December 2024*
*Status: Memory Bank Initialized*
*Next Review: Weekly*
