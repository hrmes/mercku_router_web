/**
 * Compose the frozen AppRuntimeContext from Identity + Model Profile +
 * Customer Profile.
 *
 * Merge order (§3.4):
 *   identity
 *     -> Model Profile (baseline)
 *     -> Customer Profile (policy + branding)
 *     -> backend mismatch: diagnostic warning only (does not block)
 *     -> detectedCapabilities can only CLOSE a baseline capability
 *     -> Customer disabledCapabilities can only CLOSE a capability
 *     -> behavior (Model Profile wins)
 *     -> branding (Customer Profile wins, Neutral fallback handled by caller)
 *     -> policy (Customer Profile wins)
 *     -> Object.freeze (deep)
 *
 * Effective capability formula (§3.4):
 *   effectiveCapability[key] =
 *     modelProfile.capabilities[key] === true
 *     AND identity.detectedCapabilities[key] !== false
 *     AND key NOT IN customerProfile.policy.disabledCapabilities
 *
 * `detectedCapabilities=true` cannot flip a Model Profile false to true.
 */
import { CAPABILITY_KEYS } from './capabilities';

function deepFreeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    // Use getOwnPropertyNames so we cover arrays and non-enumerable props
    // created by JSON.parse (which produces only own enumerable props, but
    // this keeps the helper robust).
    Object.getOwnPropertyNames(value).forEach((name) => {
      deepFreeze(value[name]);
    });
  }
  return value;
}

// Keep deepFreeze(ctx) from freezing caller-owned schema-validated data.
function deepClone(value) {
  if (value === undefined) return undefined;
  return JSON.parse(JSON.stringify(value));
}

/**
 * Compute the effective capability map. Exposed for unit testing.
 *
 * @param {Object} modelCapabilities  baseline from Model Profile (all 4 keys required)
 * @param {Object} [detectedCapabilities]  optional hardware-existence detection
 * @param {string[]} [customerDisabled]  disabledCapabilities from Customer Profile
 * @returns {Object} frozen map of { sfp, poeControl, fanControl, frozenConfig }
 */
export function computeEffectiveCapabilities(
  modelCapabilities,
  detectedCapabilities,
  customerDisabled
) {
  const detected = detectedCapabilities || {};
  const disabled = Array.isArray(customerDisabled) ? customerDisabled : [];
  const result = {};
  CAPABILITY_KEYS.forEach((key) => {
    const baseline = modelCapabilities[key] === true;
    const detectedNotFalse = detected[key] !== false;
    const notCustomerDisabled = !disabled.includes(key);
    // detectedCapabilities=true CANNOT flip a baseline=false to true.
    result[key] = baseline && detectedNotFalse && notCustomerDisabled;
  });
  return Object.freeze(result);
}

/**
 * Compose the frozen AppRuntimeContext.
 *
 * @param {Object} identity        validated Identity v1
 * @param {Object} modelProfile    validated Model Profile v1
 * @param {Object} customerProfile validated Customer Profile v1 (or Neutral)
 * @param {Array}  [diagnostics]   accumulator for warnings emitted upstream
 * @returns {Object} frozen AppRuntimeContext
 */
export function compose(identity, modelProfile, customerProfile, diagnostics) {
  const diag = Array.isArray(diagnostics) ? diagnostics.slice() : [];

  // §3.4: backend mismatch produces a diagnostic warning only.
  const expectedBackends = Array.isArray(modelProfile.expectedBackends)
    ? modelProfile.expectedBackends
    : [];
  if (!expectedBackends.includes(identity.backend)) {
    diag.push({
      level: 'warning',
      code: 'backend-mismatch',
      message: `identity.backend "${identity.backend}" is not in Model Profile expectedBackends [${expectedBackends.join(', ')}] (diagnostic only, does not block UI)`,
    });
  }

  const effectiveCapabilities = computeEffectiveCapabilities(
    modelProfile.capabilities,
    identity.detectedCapabilities,
    customerProfile.policy.disabledCapabilities
  );

  const ctx = {
    identity: deepClone(identity),
    effectiveCapabilities,
    behavior: deepClone(modelProfile.behavior),
    branding: deepClone(customerProfile.branding),
    policy: deepClone(customerProfile.policy),
    i18nMessages: deepClone(customerProfile.i18nMessages || {}),
    diagnostics: diag,
  };

  deepFreeze(ctx);
  return ctx;
}
