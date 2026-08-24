# GA630 Playwright Test Design

## Summary

This design introduces Playwright end-to-end coverage for the router web UI with a `GA630-first` strategy.
`GA630` is the only actively maintained target. The test architecture will still separate reusable flow logic from model-specific expectations so the same suite can later be extended to nearby models such as `M6s` with low incremental cost.

The first milestone is intentionally narrow:

- Root-level Playwright setup
- One formal project for `GA630`
- Real or near-real backend environment
- Small, stable regression suite focused on navigation, rendering, and feature visibility

The goal is to establish a dependable regression net for `GA630`, not to build a full cross-model automation platform in the first iteration.

## Project Context

The repository is a Vue 2 + Vue CLI 3 multi-model router UI monorepo. Each model lives in its own directory such as `m6`, `m6a`, `m6s`, `m6s_poe`, `nano`, and `ga630`.

Current observations:

- Unit testing exists only at the shared `base/tests/unit` layer.
- There is no existing Playwright or Cypress setup.
- Root-level development typically starts through `make dev CUSTOMER_ID=... MODEL_ID=...`.
- `GA630` appears to be source-identical to `M6s` aside from packaging-level differences.
- `M6s`, `M6s PoE`, and `Nano` are related but not identical branches.
- Older models have lower maintenance value and should not drive first-phase test design.

This makes `GA630` the correct anchor for initial E2E work.

## Goals

- Add Playwright to the root of the repository without restructuring model directories.
- Cover `GA630` against a real or near-real backend environment.
- Catch regressions in page availability, navigation structure, feature visibility, and critical rendering.
- Keep test logic reusable so future model onboarding does not require copy-pasting full suites.
- Improve selector stability by explicitly adding testing hooks where needed.

## Non-Goals

- Full cross-model matrix coverage in the first phase
- Broad write-heavy configuration workflows
- Visual snapshot regression as a launch requirement
- Mandatory CI gating for legacy models
- Refactoring older model code purely for test symmetry

## Recommended Approach

Use a root-managed Playwright layer with one required project, `GA630`, plus a reusable abstraction boundary between:

1. Shared flow logic
2. Model-specific expectations and environment metadata

This is preferable to model-local Playwright setups because:

- the repository is already centrally coordinated through root tooling
- `GA630` is the main maintenance target
- future reuse should happen through configuration, not duplicated tests

## Architecture

### Directory Layout

```text
playwright.config.ts
e2e/
  fixtures/
    app.ts
  helpers/
    auth.ts
    navigation.ts
    selectors.ts
    wait.ts
  projects/
    ga630.ts
  expectations/
    ga630.ts
  specs/
    smoke.spec.ts
    navigation.spec.ts
    feature-gates.spec.ts
```

### Responsibility Split

- `playwright.config.ts`
  Defines reporters, retries, tracing, base defaults, and project registration.
- `e2e/projects/ga630.ts`
  Stores `GA630` runtime metadata such as project name, environment variables, expected routing context, and backend target information.
- `e2e/expectations/ga630.ts`
  Stores expected menu structure, required pages, hidden entries, and feature gate assertions.
- `e2e/fixtures/app.ts`
  Creates reusable fixtures for login, environment-aware setup, and project expectation loading.
- `e2e/helpers/*`
  Encapsulates low-level actions and selectors so specs remain readable.
- `e2e/specs/*`
  Contains business-level regression scenarios.

## Execution Model

The suite should run against a real or near-real backend environment.

Playwright responsibilities:

- start or attach to the correct front-end target for `GA630`
- open the application in a browser
- authenticate with a known test account
- validate rendering and functional exposure

Playwright should not be responsible for:

- provisioning backend state
- constructing device fixtures dynamically
- mutating large amounts of persistent configuration in phase one

This separation keeps failures diagnosable. If a test fails, the likely source should be distinguishable as:

- frontend regression
- backend/environment instability
- expectation drift

## Test Scope For Phase One

### Included

1. Login page availability
2. Successful login into the main shell
3. Top-level navigation structure for `GA630`
4. Reachability of 2-4 critical pages
5. Validation of `GA630`-specific or high-value feature entry visibility
6. One stable read-only detail page with real data loading

### Excluded

1. Large write workflows
2. Multi-step destructive router configuration changes
3. Full customer/model matrix coverage
4. Legacy model mandatory support
5. Screenshot baseline maintenance

## Initial Test Inventory

### `smoke.spec.ts`

- opens the login page successfully
- renders login controls and core branding
- logs in and reaches the expected post-login shell
- verifies shell primitives exist, such as navigation and main content container

### `navigation.spec.ts`

- validates expected top-level menu items are present
- validates disallowed menu items are hidden
- opens each selected critical page and checks the primary content region

### `feature-gates.spec.ts`

- verifies `GA630`-specific or currently important entries are visible
- verifies known non-applicable entries remain hidden
- checks one read-only page loads real backend-backed content without fatal UI error

## Model Reuse Strategy

Although `GA630` is the only required model in phase one, the code should assume future extension.

The suite should therefore:

- keep project metadata isolated in `e2e/projects`
- keep per-model assertions isolated in `e2e/expectations`
- keep interaction flows generic

If `M6s` or another related model needs support later, the expected follow-up work should be limited to:

1. add a new project file
2. add a new expectation file
3. add only a small number of model-specific sentinel tests if the UI diverges

## Selector Strategy

Stable selectors are required. The design explicitly allows adding test-only hooks to templates and components.

### Preferred Rule

Use `data-e2e` for stable targeting.

Examples:

- `data-e2e="login-username"`
- `data-e2e="login-password"`
- `data-e2e="login-submit"`
- `data-e2e="nav-network"`
- `data-e2e="page-title-network"`

### Secondary Rule

Use `id` only for rare, globally unique elements where the semantics are already clear and stable.

### Implementation Guidance

- Add hooks only to high-value UI anchors.
- Avoid covering the entire DOM with test attributes.
- Prefer component-level passthrough support for repeated controls when practical.
- Centralize selector usage in helpers or fixture utilities rather than scattering raw strings across specs.

This reduces flakiness and prevents layout-only refactors from breaking E2E coverage.

## Reliability Strategy

### Keep Phase One Read-Heavy

Real environments are the priority, so the first suite should avoid risky write flows and focus on page access and visibility checks.

### Centralize Waiting Logic

Do not let each test invent its own timing rules. Create shared waiting helpers for:

- app shell ready
- navigation loaded
- page content ready
- absence of fatal loading overlays when relevant

### Capture Debug Evidence

Enable useful failure diagnostics from day one:

- trace on retry
- screenshot on failure
- retained console or page errors when possible

### Keep Expectations Config-Driven

Menu and visibility expectations should live in `e2e/expectations/ga630.ts`, not inline in every spec.

## Delivery Roadmap

### Phase 1: Foundation

- add Playwright dependencies and config
- define the `GA630` project
- establish local execution commands
- prove one smoke test can run stably

### Phase 2: GA630 Regression Baseline

- add smoke, navigation, and feature visibility suites
- connect common fixtures and helpers
- encode `GA630` expectations in one place

### Phase 3: Maintainability

- harden selectors with `data-e2e`
- improve waiting and diagnostics
- document environment assumptions and local debugging flow

### Phase 4: Optional Future Extension

- add `M6s` or another legacy-related model only when there is actual regression value
- reuse shared flows and add only narrow delta checks

## Risks And Mitigations

### Risk: Backend instability causes noisy failures

Mitigation:

- keep first-phase coverage mostly read-only
- use shared readiness waits
- target one known-good environment

### Risk: Selector fragility

Mitigation:

- explicitly add `data-e2e` attributes
- centralize selectors in helpers

### Risk: Expectation drift as GA630 evolves

Mitigation:

- keep expected menus and feature gates in one configuration file
- update one expectation module rather than many tests

### Risk: Accidental over-investment in legacy models

Mitigation:

- keep only `GA630` mandatory in phase one
- treat other models as optional follow-on work

## Open Assumptions

- A stable `GA630` test environment exists or can be designated.
- A test account with sufficient privileges is available.
- There is a known set of `GA630` pages/features considered critical enough for first-phase regression coverage.
- Adding `data-e2e` attributes to Vue templates is acceptable for this codebase.

## Approval Outcome

The user approved the `GA630-first` direction, the phased roadmap, the initial test scope, and the use of explicit test selectors such as `data-e2e`.
