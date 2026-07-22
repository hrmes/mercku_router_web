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
 * - `createNeutralCustomerProfile()` returns a fresh, conservative Customer
 *   Profile that closes ALL CUSTOMER_DISABLEABLE_CAPABILITIES and switches
 *   off `allow2LevelAdmin` / `allowTelnet`. Used as the runtime fallback when
 *   the loaded Customer Profile is unknown, fails to load, or fails schema
 *   validation.
 *
 * No dynamic path concatenation: the registries are static Object.freeze
 * mappings. The loader unifies JSON / ES module shape via
 * `module.default || module`.
 */
import { CUSTOMER_DISABLEABLE_CAPABILITIES } from './capabilities';
import { modelProfileLoaders } from '../../profiles/models/registry';
import { customerProfileLoaders } from '../../profiles/customers/registry';

/**
 * Build a fresh Neutral Customer Profile. The Neutral Profile is the
 * fail-closed fallback: it disables every customer-disableable capability,
 * forbids 2-level admin and telnet, and ships a minimal brand-neutral skin.
 *
 * This in-memory copy mirrors `unified/src/profiles/customers/neutral/profile.json`
 * so the bootstrap can still recover when even the `neutral/` chunk fails to
 * load. `tests/unit/branding/customer-profiles.spec.js` asserts the two stay
 * in sync — update both together if you change Neutral branding or policy.
 */
export function createNeutralCustomerProfile() {
  return {
    profileVersion: 1,
    branding: {
      productName: 'Router',
      wifiName: 'Router Wi-Fi',
      website: { text: 'Support', url: 'https://example.invalid' },
      policyUrl: '',
      appDownloadUrl: '',
      languages: ['en-US'],
      defaultLanguage: 'en-US',
      theme: {
        '--brand-primary': '#333333',
        '--brand-loading': '#333333',
      },
    },
    policy: {
      // §3.3: Neutral Profile closes ALL customerDisableableCapabilities.
      disabledCapabilities: [...CUSTOMER_DISABLEABLE_CAPABILITIES],
      allow2LevelAdmin: false,
      allowTelnet: false,
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
