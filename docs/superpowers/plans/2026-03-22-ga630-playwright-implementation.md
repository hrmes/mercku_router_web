# GA630 Playwright Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a root-managed Playwright test layer for `GA630`, backed by a real or near-real environment, with stable selectors and a small reusable regression suite.

**Architecture:** Playwright lives at the repository root and treats `GA630` as the only required project in phase one. Shared fixtures, helpers, and selectors handle cross-test behavior, while `GA630`-specific expectations stay in dedicated metadata files so nearby models can be added later without copying the suite.

**Tech Stack:** Vue 2, Vue CLI 3, Playwright, Node.js, existing root `make`/`npm` workflows

---

## File Map

- Modify: `.gitignore`
  Stop ignoring `docs/` so specs and plans can be committed normally.
- Modify: `package.json`
  Add Playwright scripts and root-level dev dependency entries.
- Create: `playwright.config.ts`
  Define global Playwright defaults, reporting, retries, and the `GA630` project.
- Create: `e2e/projects/ga630.ts`
  Store the `GA630` runtime metadata and environment contract.
- Create: `e2e/expectations/ga630.ts`
  Store expected navigation and feature visibility for `GA630`.
- Create: `e2e/helpers/selectors.ts`
  Centralize `data-e2e` selector helpers.
- Create: `e2e/helpers/auth.ts`
  Encapsulate login behavior.
- Create: `e2e/helpers/navigation.ts`
  Encapsulate menu traversal and route opening helpers.
- Create: `e2e/helpers/wait.ts`
  Encapsulate shell and page readiness rules.
- Create: `e2e/fixtures/app.ts`
  Expose typed fixtures for project config, expectations, and logged-in pages.
- Create: `e2e/specs/smoke.spec.ts`
  Validate login page access and post-login shell render.
- Create: `e2e/specs/navigation.spec.ts`
  Validate `GA630` navigation structure and key page reachability.
- Create: `e2e/specs/feature-gates.spec.ts`
  Validate `GA630` feature entry visibility and one stable read-only page.
- Modify: `ga630/src/...`
  Add `data-e2e` hooks to high-value login, navigation, page title, and feature-entry elements discovered during implementation.
- Create: `docs/superpowers/specs/2026-03-22-ga630-playwright-design.md`
  Already created; use as the authoritative design reference while implementing.
- Create: `docs/superpowers/plans/2026-03-22-ga630-playwright-implementation.md`
  This plan file.

## Task 1: Enable docs tracking and scaffold the Playwright entry points

**Files:**
- Modify: `.gitignore`
- Modify: `package.json`
- Create: `playwright.config.ts`
- Create: `e2e/projects/ga630.ts`

- [ ] **Step 1: Write the failing configuration smoke check**

Create `playwright.config.ts` and `e2e/projects/ga630.ts` with minimal exported structure, then add a script in `package.json` that calls Playwright config validation.

Expected failing command:

```bash
npx playwright test --config=playwright.config.ts --list
```

Expected: FAIL because Playwright is not installed yet or config is incomplete.

- [ ] **Step 2: Add dependencies and scripts**

Modify `package.json`:

- add `@playwright/test` as a dev dependency
- add scripts such as:
  - `test:e2e`
  - `test:e2e:ga630`
  - `test:e2e:ui`

Keep scripts root-managed and avoid model-local package changes in phase one.

- [ ] **Step 3: Implement the minimal Playwright config**

Create `playwright.config.ts` with:

- one `GA630` project
- retry and reporter defaults
- screenshot on failure
- trace on retry
- environment-variable-driven `baseURL`

Create `e2e/projects/ga630.ts` with:

- project name
- required environment variable names
- placeholder `CUSTOMER_ID` and `MODEL_ID`
- typed metadata export

- [ ] **Step 4: Run the config listing command**

Run:

```bash
npx playwright test --config=playwright.config.ts --list
```

Expected: PASS and list the empty or placeholder suite without config errors.

- [ ] **Step 5: Commit**

```bash
git add .gitignore package.json playwright.config.ts e2e/projects/ga630.ts
git commit -m "test: scaffold Playwright root config"
```

## Task 2: Add a failing smoke test and shared selector helpers

**Files:**
- Create: `e2e/helpers/selectors.ts`
- Create: `e2e/helpers/wait.ts`
- Create: `e2e/specs/smoke.spec.ts`

- [ ] **Step 1: Write the failing smoke test**

Create `e2e/specs/smoke.spec.ts` with one test that:

- opens the configured login page
- expects login controls identified by `data-e2e`
- expects the main shell to appear after login

Use placeholder selectors first so the test fails clearly.

Example target assertions:

```ts
await expect(page.locator('[data-e2e="login-username"]')).toBeVisible();
await expect(page.locator('[data-e2e="login-submit"]')).toBeVisible();
```

- [ ] **Step 2: Run the smoke spec to confirm failure**

Run:

```bash
npx playwright test e2e/specs/smoke.spec.ts --project=ga630
```

Expected: FAIL because the UI does not yet expose the agreed `data-e2e` hooks or helper assumptions are incomplete.

- [ ] **Step 3: Implement selector and wait helpers**

Create:

- `e2e/helpers/selectors.ts`
  - helper for `data-e2e` locators
- `e2e/helpers/wait.ts`
  - helper for shell-ready and content-ready waits

Keep helpers small and framework-agnostic.

- [ ] **Step 4: Re-run the smoke spec**

Run the same command after helpers compile cleanly.

Expected: still FAIL, but now because application markup lacks selectors rather than because the test harness is broken.

- [ ] **Step 5: Commit**

```bash
git add e2e/helpers/selectors.ts e2e/helpers/wait.ts e2e/specs/smoke.spec.ts
git commit -m "test: add initial GA630 smoke spec"
```

## Task 3: Add stable `data-e2e` hooks to GA630 login and shell anchors

**Files:**
- Modify: `ga630/src/pages/login/index.vue`
- Modify: `ga630/src/App.vue`
- Modify: `ga630/src/menu.js`
- Modify: other `ga630/src/**` files discovered to render top navigation or shell title

- [ ] **Step 1: Identify the minimum anchor points**

Inspect the rendered templates and choose the minimum stable hooks for:

- username input
- password input
- login submit
- root navigation container
- one or more top-level menu entries
- primary page title or shell content anchor

- [ ] **Step 2: Add hooks in the Vue templates**

Prefer `data-e2e`, for example:

```vue
<input data-e2e="login-username" ...>
<button data-e2e="login-submit" ...>
```

Do not add hooks broadly. Limit them to stable, high-value elements.

- [ ] **Step 3: Run the smoke spec to verify progress**

Run:

```bash
npx playwright test e2e/specs/smoke.spec.ts --project=ga630
```

Expected: either PASS or fail later in the flow, proving the selectors now bind correctly.

- [ ] **Step 4: Adjust helper waits if the shell readiness timing is still unstable**

Keep the readiness rules in `e2e/helpers/wait.ts`; do not scatter ad hoc timeouts in specs.

- [ ] **Step 5: Commit**

```bash
git add ga630/src/pages/login/index.vue ga630/src/App.vue ga630/src/menu.js ga630/src
git commit -m "test: add GA630 e2e selectors for login shell"
```

## Task 4: Build project fixtures and login flow abstraction

**Files:**
- Create: `e2e/helpers/auth.ts`
- Create: `e2e/fixtures/app.ts`
- Create: `e2e/expectations/ga630.ts`
- Modify: `e2e/specs/smoke.spec.ts`

- [ ] **Step 1: Write a failing fixture-backed test shape**

Refactor `smoke.spec.ts` to depend on fixtures such as:

- project metadata
- expectation metadata
- authenticated page helper

Expected failing command:

```bash
npx playwright test e2e/specs/smoke.spec.ts --project=ga630
```

Expected: FAIL because fixtures and metadata are not implemented yet.

- [ ] **Step 2: Implement auth and fixture modules**

Create:

- `e2e/helpers/auth.ts`
  - login action using environment-backed credentials
- `e2e/fixtures/app.ts`
  - typed fixture extension exporting current project config and login helper
- `e2e/expectations/ga630.ts`
  - expected visible nav items
  - expected hidden nav items
  - critical routes/pages

- [ ] **Step 3: Update smoke spec to use the new fixtures**

The spec should read as business behavior, not wiring logic.

- [ ] **Step 4: Run smoke spec again**

Run:

```bash
npx playwright test e2e/specs/smoke.spec.ts --project=ga630
```

Expected: PASS if the environment is available and credentials are valid.

- [ ] **Step 5: Commit**

```bash
git add e2e/helpers/auth.ts e2e/fixtures/app.ts e2e/expectations/ga630.ts e2e/specs/smoke.spec.ts
git commit -m "test: add GA630 Playwright fixtures"
```

## Task 5: Add navigation regression coverage

**Files:**
- Create: `e2e/helpers/navigation.ts`
- Create: `e2e/specs/navigation.spec.ts`
- Modify: `ga630/src/menu.js`
- Modify: additional `ga630/src/**` template files that need top-level menu hooks

- [ ] **Step 1: Write the failing navigation suite**

Create `e2e/specs/navigation.spec.ts` with tests that:

- assert expected top-level menu items exist
- assert disallowed items are absent
- navigate to 2-4 critical pages

- [ ] **Step 2: Run the navigation suite to verify failure**

Run:

```bash
npx playwright test e2e/specs/navigation.spec.ts --project=ga630
```

Expected: FAIL because navigation helpers, hooks, or expectations are incomplete.

- [ ] **Step 3: Implement navigation helpers and any missing hooks**

Create `e2e/helpers/navigation.ts` and add or refine `data-e2e` markers for high-value menu items and page anchors.

- [ ] **Step 4: Re-run the navigation suite**

Run the same command until it passes consistently.

Expected: PASS with deterministic navigation checks.

- [ ] **Step 5: Commit**

```bash
git add e2e/helpers/navigation.ts e2e/specs/navigation.spec.ts ga630/src
git commit -m "test: cover GA630 navigation regression"
```

## Task 6: Add feature-gate coverage for GA630-specific visibility

**Files:**
- Create: `e2e/specs/feature-gates.spec.ts`
- Modify: `e2e/expectations/ga630.ts`
- Modify: relevant `ga630/src/**` templates for missing feature-entry hooks

- [ ] **Step 1: Write the failing feature-gate suite**

Create tests that:

- assert `GA630`-important feature entries are visible
- assert known non-applicable entries remain hidden
- open one stable read-only page and confirm real data loads without fatal UI error

- [ ] **Step 2: Run the feature-gate suite to verify failure**

Run:

```bash
npx playwright test e2e/specs/feature-gates.spec.ts --project=ga630
```

Expected: FAIL until hooks and expectations are aligned.

- [ ] **Step 3: Implement the minimal expectation and markup changes**

Update `e2e/expectations/ga630.ts` and only the small number of UI hooks needed for stable assertions.

- [ ] **Step 4: Re-run the feature-gate suite**

Expected: PASS on the designated environment.

- [ ] **Step 5: Commit**

```bash
git add e2e/specs/feature-gates.spec.ts e2e/expectations/ga630.ts ga630/src
git commit -m "test: add GA630 feature gate coverage"
```

## Task 7: Verify the full phase-one suite and document local usage

**Files:**
- Modify: `README.md`
- Modify: `package.json`
- Modify: `playwright.config.ts`
- Modify: any `e2e/**` file needed for final stabilization

- [ ] **Step 1: Run the full GA630 suite**

Run:

```bash
npx playwright test --project=ga630
```

Expected: PASS for all phase-one specs.

- [ ] **Step 2: Review failure artifacts and remove obvious flake sources**

If any spec is flaky:

- tighten selectors
- centralize waits
- avoid arbitrary sleeps

- [ ] **Step 3: Document how to run the suite**

Update `README.md` with:

- required environment variables
- browser install command if needed
- root scripts
- how to run only `GA630`
- how to inspect traces on failure

- [ ] **Step 4: Re-run the full suite after doc and config updates**

Run:

```bash
npx playwright test --project=ga630
```

Expected: PASS again, proving the final state is stable.

- [ ] **Step 5: Commit**

```bash
git add README.md package.json playwright.config.ts e2e
git commit -m "docs: document GA630 Playwright workflow"
```

## Verification Checklist

- Run: `npx playwright test --config=playwright.config.ts --list`
- Run: `npx playwright test e2e/specs/smoke.spec.ts --project=ga630`
- Run: `npx playwright test e2e/specs/navigation.spec.ts --project=ga630`
- Run: `npx playwright test e2e/specs/feature-gates.spec.ts --project=ga630`
- Run: `npx playwright test --project=ga630`

## Notes For Implementation

- Keep phase one read-heavy.
- Prefer `data-e2e` over brittle CSS traversal.
- Do not spread model-specific expectations into the specs.
- Do not add old-model support unless there is immediate regression value.
- If the environment is unstable, fix waits and selectors first before expanding coverage.
