/**
 * Customer Profile 0032 (Viaero).
 *
 * The legacy Viaero skin uses different aspect ratios for its navigation and
 * login logos. Keep both pairs in the runtime profile so the shared header and
 * M6s login layout can reproduce the original branding without customer CSS.
 */
import appIconUrl from 'base/assets/images/customer/viaero/ic_launcher.png';
import darkLoginLogoUrl from 'base/assets/images/customer/viaero/logo_login_dark.png';
import loginLogoUrl from 'base/assets/images/customer/viaero/logo_login_light.png';
import darkLogoUrl from 'base/assets/images/customer/viaero/logo_nav_dark.png';
import qrCodeUrl from 'base/assets/images/customer/viaero/qr.png';
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
    loginLogoUrl,
    darkLoginLogoUrl,
    faviconUrl,
    qrCodeUrl,
    appIconUrl,
  },
};

Object.defineProperty(customerProfile, 'i18nMessages', {
  value: i18nMessages,
  enumerable: false,
});

export default customerProfile;
