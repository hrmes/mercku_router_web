/* eslint-disable import/prefer-default-export */
/**
 * Customer Profile registry - static mapping from concrete CUSTOMER_ID to a
 * chunk loader. This is one of the ONLY places in unified/src allowed to
 * mention concrete customer IDs (the other is the per-customer profile
 * directory itself). The ID boundary checker
 * (scripts/check-unified-id-boundaries.mjs) parses this file to extract
 * known IDs and then scans the rest of unified/src for those literals.
 *
 * Static mapping only: NO dynamic path concatenation from user input. Each
 * loader is a literal `import('./<ID>')` so webpack can analyse the call
 * graph at build time and split each Customer Profile into its own chunk.
 *
 * Loader unifies JSON / ES module shape via `module.default || module`
 * (handled in app/profiles/load.js).
 *
 * Unknown or failing Customer Profile loads fall back to the built-in
 * Neutral Profile (see ../app/profiles/load.js and
 * ./neutral/profile.json) with a diagnostic warning - that is the intended
 * behaviour per §3.3. `neutral` is therefore NOT in this registry: it is
 * the fallback for unknown customerId, not a registered profile.
 *
 * Registered customers:
 *   - 0001 (Mercku) - the baseline customer with full language support.
 *   - 0029 (JUNET)  - Swedish ISP customer; allow2LevelAdmin=true.
 *   - 0032 (Viaero) - blue theme and customer-specific branding/i18n.
 *     Other style-only customer dirs (0002/0003/0004) lack
 *     customer-conf/<ID>/conf.json and are deferred pending team confirmation.
 */
export const customerProfileLoaders = Object.freeze({
  '0001': () => import(/* webpackChunkName: "group-profiles" */ './0001'),
  '0029': () => import(/* webpackChunkName: "group-profiles" */ './0029'),
  '0032': () => import(/* webpackChunkName: "group-profiles" */ './0032'),
});
