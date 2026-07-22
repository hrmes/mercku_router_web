/**
 * Neutral Customer Profile — the fail-closed fallback for unknown / failing
 * Customer Profile loads. Also imported directly by
 * `app/profiles/load.js::createNeutralCustomerProfile` for the rare case
 * where even this chunk fails to load (in which case load.js falls back to
 * an in-memory hardcoded object — see the comment there).
 *
 * The Neutral Profile closes ALL customerDisableableCapabilities, forbids
 * 2-level admin and telnet, and ships a brand-neutral skin. It is NOT in
 * the customerProfileLoaders registry — it is the fallback for unknown
 * customerId, not a registered profile.
 *
 * Assets are pulled from the shared `assets/branding/default/` directory so
 * they can also be reused as runtime fallbacks by apply-branding.js /
 * future Vue components. The validate-profiles.mjs validator special-cases
 * `neutral` and skips the per-customer `assets/` directory check because
 * the assets are shared.
 */
import profile from './profile.json';
import logoUrl from '../../../assets/branding/default/logo.svg';
import faviconUrl from '../../../assets/branding/default/favicon.ico';
import loginBackgroundUrl from '../../../assets/branding/default/login-background.svg';

export default {
  ...profile,
  branding: {
    ...profile.branding,
    logoUrl,
    faviconUrl,
    loginBackgroundUrl,
  },
};
