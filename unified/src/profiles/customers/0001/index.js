/**
 * Customer Profile 0001 (Mercku) — webpack-assembled Customer Profile.
 *
 * profile.json holds only Node-validatable data (validated by
 * scripts/validate-profiles.mjs). index.js pulls the binary branding assets
 * through webpack so a missing file fails the build, and attaches the
 * resolved URLs to branding. The assembled object is the runtime-shaped
 * Customer Profile that bootstrap → compose → apply-branding consumes.
 *
 * Asset choices for customer 0001:
 *   - favicon.ico: copied from base/customer-conf/0001/favicon.ico (original
 *     left in place serving the legacy builds).
 *   - logo.png: copied from base/src/assets/images/customer/mercku/logo-light.png
 *     (the on-light logo, used on the login screen and the top nav).
 *   - loginBackgroundUrl is intentionally OMITTED. The legacy customer 0001
 *     login screen renders the logo on top of the brand color; there is no
 *     separate background image. apply-branding.js handles a missing
 *     loginBackgroundUrl by omitting it from the descriptor.
 *
 * The `routers` field in base/customer-conf/0001/conf.json is model-specific
 * data and does NOT belong here — it goes into Model Profile / suite (Task 5).
 */
import profile from './profile.json';
import logoUrl from './assets/logo.png';
import faviconUrl from './assets/favicon.ico';

export default {
  ...profile,
  branding: {
    ...profile.branding,
    logoUrl,
    faviconUrl,
    // loginBackgroundUrl intentionally omitted — see comment above.
  },
};
