/**
 * Customer Profile 0029 (JUNET) - webpack-assembled Customer Profile.
 *
 * profile.json holds only Node-validatable data (validated by
 * scripts/validate-profiles.mjs). index.js pulls the binary branding assets
 * through webpack so a missing file fails the build, and attaches the
 * resolved URLs to branding. The assembled object is the runtime-shaped
 * Customer Profile that bootstrap -> compose -> apply-branding consumes.
 *
 * Asset choices for customer 0029:
 *   - favicon.ico: copied from base/customer-conf/0029/favicon.ico (original
 *     left in place serving the legacy builds).
 *   - logo.webp: copied from base/src/assets/images/customer/junet/logo-light.webp
 *     (the on-light logo; junet assets are webp, not png).
 *   - loginBackgroundUrl is intentionally OMITTED, matching 0001 behaviour.
 *     apply-branding.js handles a missing loginBackgroundUrl by omitting it
 *     from the descriptor.
 *
 * The `routers` field in base/customer-conf/0029/conf.json is model-specific
 * data and does NOT belong here - it goes into Model Profile / suite.
 */
import profile from './profile.json';
import logoUrl from './assets/logo.webp';
import faviconUrl from './assets/favicon.ico';

export default {
  ...profile,
  branding: {
    ...profile.branding,
    logoUrl,
    faviconUrl,
    // loginBackgroundUrl intentionally omitted - see comment above.
  },
};
