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
 *   - darkLogoUrl: webpack imports the existing JUNET logo-dark.webp for the
 *     dark top nav.
 *   - loginBackgroundUrl is intentionally OMITTED, matching 0001 behaviour.
 *     apply-branding.js handles a missing loginBackgroundUrl by omitting it
 *     from the descriptor.
 *
 * The `routers` field in base/customer-conf/0029/conf.json is model-specific
 * data and does NOT belong here - it goes into Model Profile / suite.
 */
import qrCodeUrl from 'base/assets/images/customer/junet/qr.png';
import appIconUrl from 'base/assets/images/customer/junet/ic_launcher.png';
import darkLogoUrl from 'base/assets/images/customer/junet/logo-dark.webp';
import profile from './profile.json';
import logoUrl from './assets/logo.webp';
import faviconUrl from './assets/favicon.ico';
import i18nMessages from './messages';

const customerProfile = {
  ...profile,
  branding: {
    ...profile.branding,
    logoUrl,
    darkLogoUrl,
    faviconUrl,
    qrCodeUrl,
    appIconUrl,
    // loginBackgroundUrl intentionally omitted - see comment above.
  },
};

Object.defineProperty(customerProfile, 'i18nMessages', {
  value: i18nMessages,
  enumerable: false,
});

export default customerProfile;
