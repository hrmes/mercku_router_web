/**
 * Bootstrap entry point.
 *
 *   bootstrap({ createApp, fetchIdentity, loadModelProfile, loadCustomerProfile, diagnostics })
 *
 * Sequence (§3.4):
 *   1. fetch + validate identity (fail-closed → retryable error)
 *   2. load Model Profile by identity.modelId (static registry; no fallback,
 *      no admin UI on unknown/fail)
 *   3. load Customer Profile by identity.customerId (static registry;
 *      unknown/load-fail/schema-invalid → Neutral Profile + diagnostic warning)
 *   4. validate Model Profile + Customer Profile schemas
 *   5. compose AppRuntimeContext (effective capability formula, behavior,
 *      branding, policy, pageVariants, diagnostics)
 *   6. Object.freeze the runtime context (handled in compose)
 *   7. call `createApp(runtimeContext)` exactly once
 *
 * Task 3 only injects `createApp` in tests — there is no Vue / Router / Store
 * mount logic here. Real `main.js` wiring lands in Task 7.
 *
 * All four dependencies (`fetchIdentity`, `loadModelProfile`,
 * `loadCustomerProfile`, `createApp`) are injectable so the bootstrap can be
 * exercised end-to-end in tests without a DOM or network. Defaults wire up
 * the static registries and the identity fetcher for production use.
 */
import { validateIdentity, getIdentityErrors } from './identity/validate';
import {
  validateModelProfile,
  validateCustomerProfile,
  getModelProfileErrors,
  getCustomerProfileErrors,
  summarizeAjvErrors,
} from './profiles/validate';
import { compose } from './profiles/compose';
import {
  createNeutralCustomerProfile,
  loadModelProfileById,
  loadCustomerProfileById,
} from './profiles/load';
import { fetchIdentity as defaultFetchIdentity } from './identity/load';

export class BootstrapError extends Error {
  constructor(code, message, { retryable = true, cause } = {}) {
    super(message);
    this.name = 'BootstrapError';
    this.code = code;
    this.retryable = retryable === true;
    if (cause) this.cause = cause;
  }
}

/**
 * Predicate used by the error page (Task 7) to decide whether to show a
 * "Retry" button. Identity fetch failures, chunk load failures and schema
 * rejections are retryable. Unknown modelId is NOT retryable (the device
 * suite must ship a matching Model Profile first).
 *
 * Honours an explicit `err.retryable` boolean when present (BootstrapError
 * and any custom error that opts in). Falls back to treating generic
 * fetch/network/chunk/identity errors and 5xx responses as transient.
 */
export function isRetryable(err) {
  if (!err) return false;
  if (typeof err.retryable === 'boolean') return err.retryable;
  // Generic fetch/network/chunk/identity errors are treated as transient.
  if (err.code && /FETCH|HTTP|TIMEOUT|NETWORK|CHUNK|PARSE|IDENTITY/i.test(err.code)) {
    return true;
  }
  if (typeof err.status === 'number' && err.status >= 500) return true;
  return false;
}

function pushDiagnostic(diagnostics, entry) {
  if (Array.isArray(diagnostics)) {
    diagnostics.push(entry);
  }
}

function formatIdentityErrors() {
  return summarizeAjvErrors(getIdentityErrors());
}

function formatModelErrors() {
  return summarizeAjvErrors(getModelProfileErrors());
}

function formatCustomerErrors() {
  return summarizeAjvErrors(getCustomerProfileErrors());
}

export async function bootstrap({
  createApp,
  fetchIdentity,
  loadModelProfile,
  loadCustomerProfile,
  diagnostics = [],
} = {}) {
  if (typeof createApp !== 'function') {
    throw new BootstrapError(
      'missing-createApp',
      'bootstrap requires a createApp function',
      { retryable: false }
    );
  }

  const fetchIdentityFn = fetchIdentity || (async () => defaultFetchIdentity());
  const loadModelProfileFn = loadModelProfile || (async (modelId) => loadModelProfileById(modelId));
  const loadCustomerProfileFn = loadCustomerProfile ||
    (async (customerId) => loadCustomerProfileById(customerId));

  // Step 1: fetch + validate identity.
  let identity;
  try {
    identity = await fetchIdentityFn();
  } catch (err) {
    if (err instanceof BootstrapError) throw err;
    throw new BootstrapError(
      'identity-load-failed',
      `identity fetch failed: ${err.message}`,
      { retryable: true, cause: err }
    );
  }
  if (!validateIdentity(identity)) {
    throw new BootstrapError(
      'identity-invalid',
      `identity failed schema validation: ${formatIdentityErrors()}`,
      { retryable: true }
    );
  }

  // Step 2: load Model Profile (no fallback for unknown modelId).
  let modelProfile;
  try {
    modelProfile = await loadModelProfileFn(identity.modelId);
  } catch (err) {
    if (err instanceof BootstrapError) throw err;
    throw new BootstrapError(
      'model-profile-load-failed',
      `Model Profile chunk failed to load for modelId="${identity.modelId}": ${err.message}`,
      { retryable: true, cause: err }
    );
  }
  if (modelProfile == null) {
    // §3.3: Unknown modelId → no fallback, no admin UI.
    throw new BootstrapError(
      'unknown-model',
      `no Model Profile registered for modelId="${identity.modelId}" (no fallback; admin UI cannot start)`,
      { retryable: false }
    );
  }

  // Step 3: load Customer Profile (unknown/fail → Neutral + warning).
  let customerProfile = null;
  let customerFallbackReason = null;
  try {
    customerProfile = await loadCustomerProfileFn(identity.customerId);
  } catch (err) {
    customerFallbackReason = `load failed: ${err.message}`;
  }
  if (customerFallbackReason === null && customerProfile == null) {
    customerFallbackReason = `unknown customerId "${identity.customerId}"`;
  }

  // Step 4a: validate Model Profile (fail-closed — no fallback).
  if (!validateModelProfile(modelProfile)) {
    throw new BootstrapError(
      'model-profile-invalid',
      `Model Profile failed schema validation: ${formatModelErrors()}`,
      { retryable: true }
    );
  }

  // Step 4b: validate Customer Profile (fall back to Neutral on failure).
  if (customerFallbackReason === null && !validateCustomerProfile(customerProfile)) {
    customerFallbackReason = `schema validation failed: ${formatCustomerErrors()}`;
  }

  if (customerFallbackReason !== null) {
    pushDiagnostic(diagnostics, {
      level: 'warning',
      code: 'customer-profile-neutral-fallback',
      message: `Falling back to Neutral Customer Profile (${customerFallbackReason})`,
    });
    customerProfile = createNeutralCustomerProfile();
  }

  // Steps 5–7: compose (backend mismatch warning + freeze), then call createApp.
  const runtimeContext = compose(identity, modelProfile, customerProfile, diagnostics);

  // Step 8: call createApp exactly once with the frozen runtimeContext.
  return createApp(runtimeContext);
}
