/* eslint-disable import/prefer-default-export */
/**
 * createMenu(runtimeContext, role, mode) — filter the static menuDefinitions
 * based on the composed AppRuntimeContext, the current role and the current
 * router mode.
 *
 * Filtering rules (mirror the legacy menu.js behaviour, but driven by the
 * runtime context instead of process.env):
 *
 *   1. Capability gate:
 *      A leaf with `requiresCapability` is shown only when the composed
 *      effective capability is true.
 *
 *   2. Customer-policy gate:
 *      If a leaf item declares `requiresCustomerPolicy: <flag>`, it is shown
 *      ONLY when runtimeContext.policy[<flag>] === true.
 *
 *   3. Role gate (simple array check, no DSL):
 *      When runtimeContext.policy.allow2LevelAdmin === true, each visible
 *      item must additionally satisfy item.config.auth.includes(role).
 *      When allow2LevelAdmin === false, the role check is skipped (preserving
 *      the legacy "no 2-level admin → no role filtering" semantics).
 *
 *   4. Mode gate:
 *      Items whose config.mode does not include the current mode are kept
 *      visible but marked `disabled: true` (greyed out). This matches the
 *      legacy menu.js behaviour.
 *
 *   5. Parent url:
 *      Each top-level group's url is repointed to its first non-disabled
 *      child (so clicking the group icon lands on an accessible page).
 *
 * The returned tree is frozen so callers cannot accidentally mutate the
 * runtime menu.
 *
 * @param {Object} runtimeContext  composed AppRuntimeContext (from compose())
 * @param {string} role            current Role (admin | super)
 * @param {string} mode            current RouterMode (router | bridge | wirelessBridge)
 * @returns {Object[]} frozen filtered menu tree (same shape as menuDefinitions)
 */
import { menuDefinitions } from './definitions';

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function deepFreeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    Object.getOwnPropertyNames(value).forEach((name) => {
      deepFreeze(value[name]);
    });
  }
  return value;
}

function isCustomerPolicyAllowed(item, policy) {
  if (!item.requiresCustomerPolicy) return true;
  return policy[item.requiresCustomerPolicy] === true;
}

function isCapabilityAllowed(item, capabilities) {
  if (!item.requiresCapability) return true;
  return capabilities[item.requiresCapability] === true;
}

function isRoleAllowed(item, role, policy) {
  // Role check applies only when the customer enables 2-level admin.
  // This preserves the legacy menu.js semantics: without allow2LevelAdmin,
  // role-based filtering is disabled and every visible item is shown to
  // both roles.
  if (policy.allow2LevelAdmin !== true) return true;
  return Array.isArray(item.config.auth) && item.config.auth.includes(role);
}

function isModeCompatible(item, mode) {
  return Array.isArray(item.config.mode) && item.config.mode.includes(mode);
}

/**
 * Filter and decorate a single leaf item. Returns the decorated clone (with
 * `disabled` flag set) or null when the item should be hidden.
 */
function filterLeaf(item, runtimeContext, role, mode) {
  if (!isCapabilityAllowed(item, runtimeContext.effectiveCapabilities)) return null;
  if (!isCustomerPolicyAllowed(item, runtimeContext.policy)) return null;
  if (!isRoleAllowed(item, role, runtimeContext.policy)) return null;

  const clone = { ...item };
  // Remove filtering-only metadata so the output matches the legacy menu.js
  // shape (which never exposed runtime filtering metadata).
  delete clone.requiresCustomerPolicy;
  delete clone.requiresCapability;

  clone.disabled = !isModeCompatible(item, mode);
  return clone;
}

export function createMenu(runtimeContext, role, mode) {
  const tree = deepClone(menuDefinitions);

  tree.forEach((top) => {
    if (!Array.isArray(top.children) || top.children.length === 0) return;

    // Filter leaves by capability / customer policy / role.
    top.children = top.children
      .map((leaf) => filterLeaf(leaf, runtimeContext, role, mode))
      .filter((leaf) => leaf !== null);

    // 2. Mark mode-incompatible items disabled (already done in filterLeaf).
    // 3. Repoint parent url to the first non-disabled child.
    const firstEnabled = top.children.find((c) => !c.disabled);
    if (firstEnabled) {
      top.url = firstEnabled.url;
    }
  });

  deepFreeze(tree);
  return tree;
}
