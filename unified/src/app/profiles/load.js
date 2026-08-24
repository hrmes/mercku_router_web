/**
 * Profile loaders.
 *
 * - `loadModelProfileById(modelId)` looks up `modelProfileLoaders` (static).
 *   Returns `undefined` when the modelId is not registered — the bootstrap
 *   flow then fails-closed (no fallback, no admin UI) per §3.3.
 * - `loadCustomerProfileById(customerId)` looks up `customerProfileLoaders`
 *   (static). Returns `undefined` when the customerId is not registered —
 *   the bootstrap flow then falls back to the Neutral Profile with a
 *   diagnostic warning per §3.3.
 * - `createNeutralCustomerProfile()` returns a fresh copy of the neutral
 *   profile with shared default assets attached.
 *
 * No dynamic path concatenation: the registries are static Object.freeze
 * mappings. The loader unifies JSON / ES module shape via
 * `module.default || module`.
 */
import { modelProfileLoaders } from '../../profiles/models/registry';
import { customerProfileLoaders } from '../../profiles/customers/registry';
import neutralCustomerProfile from '../../profiles/customers/neutral/profile.json';
import defaultLogoUrl from '../../assets/branding/default/logo.svg';
import defaultFaviconUrl from '../../assets/branding/default/favicon.ico';
import defaultLoginBackgroundUrl from '../../assets/branding/default/login-background.svg';

/**
 * Build the fail-closed customer fallback from its single JSON source of
 * truth. Nested values are cloned because bootstrap validation and tests may
 * mutate a candidate profile before compose() freezes the runtime context.
 */
export function createNeutralCustomerProfile() {
  return {
    ...neutralCustomerProfile,
    branding: {
      ...neutralCustomerProfile.branding,
      website: { ...neutralCustomerProfile.branding.website },
      languages: [...neutralCustomerProfile.branding.languages],
      theme: { ...neutralCustomerProfile.branding.theme },
      logoUrl: defaultLogoUrl,
      faviconUrl: defaultFaviconUrl,
      loginBackgroundUrl: defaultLoginBackgroundUrl,
    },
    policy: {
      ...neutralCustomerProfile.policy,
      disabledCapabilities: [
        ...neutralCustomerProfile.policy.disabledCapabilities,
      ],
    },
  };
}

function normalizeModule(mod) {
  if (mod && typeof mod === 'object' && 'default' in mod) {
    return mod.default;
  }
  return mod;
}

export async function loadModelProfileById(modelId) {
  const loader = modelProfileLoaders[modelId];
  if (typeof loader !== 'function') {
    return undefined;
  }
  const mod = await loader();
  return normalizeModule(mod);
}

export async function loadCustomerProfileById(customerId) {
  const loader = customerProfileLoaders[customerId];
  if (typeof loader !== 'function') {
    return undefined;
  }
  const mod = await loader();
  return normalizeModule(mod);
}
