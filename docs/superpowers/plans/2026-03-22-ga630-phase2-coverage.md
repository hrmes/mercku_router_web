# GA630 Phase 2 Coverage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand GA630 Playwright coverage from shell-level checks into page-level assertions, using a mixed strategy of skeleton coverage for large pages and complete coverage for small pages.

**Architecture:** Large pages get one real passing test plus explicit follow-up test placeholders so coverage can grow without blocking on full implementation. Small pages get stable `data-e2e` anchors and complete read-focused tests. Shared Playwright helpers remain root-managed and model-specific hooks stay minimal.

**Tech Stack:** Vue 2, Vue CLI 3, Playwright, Node.js, existing root `make`/`npm` workflows

---

## File Map

- Modify: `ga630/src/pages/bussiness/setting/wan.vue`
  Add the smallest set of `data-e2e` hooks needed for one stable content assertion and future skeleton growth.
- Modify: `base/src/pages/bussiness/setting/wps.vue`
  Add stable hooks for the WPS page so a complete small-page test can bind to real UI.
- Modify: `base/src/pages/bussiness/setting/timezone.vue`
  Add stable hooks if this page is included in the current batch.
- Create: `e2e/specs/wan-content.spec.ts`
  Add one real passing WAN content test and explicit `fixme` placeholders for deeper future coverage.
- Create: `e2e/specs/wps.spec.ts`
  Add complete read-focused coverage for the WPS page.
- Create: `e2e/specs/timezone.spec.ts`
  Optional in this batch if time permits and hooks are straightforward.
- Modify: `README.md`
  Update current phase-two scope if the test surface changes enough to matter.

## Task 1: Add WAN skeleton coverage

**Files:**
- Modify: `ga630/src/pages/bussiness/setting/wan.vue`
- Create: `e2e/specs/wan-content.spec.ts`

- [ ] **Step 1: Write the failing WAN content spec**
- [ ] **Step 2: Run `PLAYWRIGHT_PASSWORD=147258369 npx playwright test e2e/specs/wan-content.spec.ts --project=ga630` and confirm failure**
- [ ] **Step 3: Add minimal WAN page `data-e2e` hooks for summary card, net-type section, VLAN section, and submit button**
- [ ] **Step 4: Make one WAN content test pass and leave deeper checks as `test.fixme` placeholders**
- [ ] **Step 5: Re-run the WAN spec and confirm pass**

## Task 2: Add complete WPS coverage

**Files:**
- Modify: `base/src/pages/bussiness/setting/wps.vue`
- Create: `e2e/specs/wps.spec.ts`

- [ ] **Step 1: Write the failing WPS spec**
- [ ] **Step 2: Run `PLAYWRIGHT_PASSWORD=147258369 npx playwright test e2e/specs/wps.spec.ts --project=ga630` and confirm failure**
- [ ] **Step 3: Add minimal WPS page hooks for intro card, band selector, and submit button**
- [ ] **Step 4: Make the WPS spec pass with full small-page coverage**
- [ ] **Step 5: Re-run the WPS spec and confirm pass**

## Task 3: Add complete Timezone coverage if low-friction

**Files:**
- Modify: `base/src/pages/bussiness/setting/timezone.vue`
- Create: `e2e/specs/timezone.spec.ts`

- [ ] **Step 1: Write the failing Timezone spec**
- [ ] **Step 2: Run `PLAYWRIGHT_PASSWORD=147258369 npx playwright test e2e/specs/timezone.spec.ts --project=ga630` and confirm failure**
- [ ] **Step 3: Add minimal hooks for selector and submit button**
- [ ] **Step 4: Make the Timezone spec pass if the page stays read-focused and stable; otherwise stop at a documented skeleton**
- [ ] **Step 5: Re-run the Timezone spec and confirm actual status**

## Task 4: Verify full GA630 suite

**Files:**
- Modify: `e2e/**`
- Modify: `README.md`

- [ ] **Step 1: Run `PLAYWRIGHT_PASSWORD=147258369 npx playwright test --project=ga630`**
- [ ] **Step 2: Fix any regressions or flake introduced in this batch**
- [ ] **Step 3: Update docs only if the new pages materially change the runnable scope**
- [ ] **Step 4: Re-run the full GA630 suite and confirm final status**
