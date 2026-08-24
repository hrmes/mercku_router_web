/**
 * v1 runtime capability keys. Frozen — extending requires bumping schemaVersion
 * across Identity, Model Profile, detectedCapabilities, compose, menu/router
 * and page display. This file is the single source of truth; schemas, compose,
 * menu/router and pages must NOT alias these names.
 */
export const CAPABILITY_KEYS = Object.freeze([
  'sfp',
  'poeControl',
  'fanControl',
  'frozenConfig',
]);

/**
 * Capabilities the customer is allowed to disable via Customer Profile policy.
 * Subset of CAPABILITY_KEYS; extending the whitelist needs separate review and
 * cannot be self-declared by a Customer Profile.
 */
export const CUSTOMER_DISABLEABLE_CAPABILITIES = Object.freeze([
  'sfp',
  'poeControl',
  'fanControl',
  'frozenConfig',
]);
