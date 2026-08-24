/** Assemble validated Mercku profile data with webpack-managed assets. */
import qrCodeUrl from 'base/assets/images/customer/mercku/qr.png';
import appIconUrl from 'base/assets/images/customer/mercku/ic_launcher.png';
import darkLogoUrl from 'base/assets/images/customer/mercku/logo-dark.png';
import profile from './profile.json';
import logoUrl from './assets/logo.png';
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
    // loginBackgroundUrl intentionally omitted — see comment above.
  },
};

// Internal webpack payload, deliberately non-enumerable so the JSON Profile
// contract stays minimal and AJV still validates only product configuration.
Object.defineProperty(customerProfile, 'i18nMessages', {
  value: i18nMessages,
  enumerable: false,
});

export default customerProfile;
