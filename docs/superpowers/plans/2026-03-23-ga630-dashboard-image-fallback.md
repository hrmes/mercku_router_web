# GA630 Dashboard Image Fallback Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `GA630` reuse `M6s` router images in dashboard-related views and document how to wire images for future models.

**Architecture:** Add a small shared utility that resolves the CSS image class for dashboard router renders. Update dashboard and mesh views to use the utility instead of raw model IDs so image fallback behavior lives in one place. Document the required image-related touchpoints in the root README.

**Tech Stack:** Vue 2, Vue CLI 3, Mocha unit tests, SCSS, Markdown

---

### Task 1: Add regression test for dashboard image class fallback

**Files:**
- Create: `base/tests/unit/router-image.spec.js`
- Test: `base/tests/unit/router-image.spec.js`

- [ ] **Step 1: Write the failing test**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Commit**

### Task 2: Implement shared dashboard image class resolver

**Files:**
- Create: `base/src/util/router-image.js`
- Modify: `base/src/pages/bussiness/dashboard/index.vue`
- Modify: `base/src/pages/bussiness/dashboard/mesh.vue`

- [ ] **Step 1: Write minimal implementation**
- [ ] **Step 2: Run targeted test to verify it passes**
- [ ] **Step 3: Commit**

### Task 3: Document image wiring for new models

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Add README guidance for dashboard and mesh image mapping**
- [ ] **Step 2: Run relevant verification commands**
- [ ] **Step 3: Commit**
