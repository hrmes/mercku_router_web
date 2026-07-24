/* eslint-disable import/prefer-default-export */
/**
 * Model Profile registry - static mapping from concrete MODEL_ID to a chunk
 * loader. This is one of the ONLY places in unified/src allowed to mention
 * concrete model IDs (the other is profiles/customers/registry.js and the
 * per-profile subdirectories).
 *
 * Declares all eight Model IDs mapped to the six legacy build directories:
 *   - M6R0  (m6)      - frozenConfig=true; legacy main.js with no upgrade
 *                       delay and no mode-switch page.
 *   - M8    (m6a)     - frozenConfig=true; same legacy main.js as m6.
 *   - M11R1 (m6s)     - baseline (all caps false); same m6s main.js as M11R4.
 *   - M11R2 (m6s)     - sfp=true; same m6s main.js as M11R4.
 *   - M11R4 (m6s)     - baseline (all caps false); the proven baseline.
 *   - M13R0 (nano)    - fanControl=true; same delayed behavior as M11R4.
 *   - M16R0 (m6s_poe) - poeControl=true; same m6s-family main.js as M11R4.
 *   - GA630 (ga630)   - baseline (all caps false); ga630 main.js is
 *                       byte-identical to m6s for reconnect/upgrade.
 *
 * Static mapping only: NO dynamic path concatenation from user input. Each
 * loader is a literal `import('./<ID>/profile.json')` so webpack can analyse
 * the call graph at build time. Unlike Customer Profiles, Model Profiles
 * load profile.json directly (no index.js, no binary assets) - capabilities
 * and behavior are pure data. Loader unifies JSON/ES module shape via
 * `module.default || module` (handled in ../app/profiles/load.js).
 *
 * Unknown modelId -> no fallback, no admin UI (capabilities/behavior unsafe)
 * per §3.3. Registry must NOT declare `webpackChunkName` containing IDs.
 */
export const modelProfileLoaders = Object.freeze({
  M6R0: () => import('./M6R0/profile.json'),
  M8: () => import('./M8/profile.json'),
  M11R1: () => import('./M11R1/profile.json'),
  M11R2: () => import('./M11R2/profile.json'),
  M11R4: () => import('./M11R4/profile.json'),
  M13R0: () => import('./M13R0/profile.json'),
  M16R0: () => import('./M16R0/profile.json'),
  GA630: () => import('./GA630/profile.json'),
});
