/* global globalThis */
/**
 * FRP (STCP) helpers shared by the "FRP" advance-settings page.
 *
 * The page sends one `router.frp.update` command containing the complete
 * configuration, so everything that decides the wire payload lives here and
 * stays unit-testable without mounting the Vue component.
 *
 * Rules implemented here:
 *   - ports fall back to the STCP defaults (web 80 / ssh 22) whenever the
 *     device returns a missing or unusable value;
 *   - the secret key is only part of the payload while FRP is enabled;
 *   - disabling clears the key, re-enabling always issues a fresh random key
 *     (so a key is never reused after an off/on cycle).
 */
export const FRP_DEFAULT_WEB_PORT = 80;
export const FRP_DEFAULT_SSH_PORT = 22;
export const FRP_SK_LENGTH = 16;

// Ambiguous glyphs (0/O, 1/l/I) are excluded so the key can be typed by hand
// on the visitor side without guessing.
const SK_ALPHABET =
  'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';

const MIN_PORT = 1;
const MAX_PORT = 65535;

function getCrypto() {
  if (typeof globalThis !== 'undefined' && globalThis.crypto) {
    return globalThis.crypto;
  }
  return null;
}

/**
 * Generate a random secret key for STCP FRP.
 *
 * Uses crypto.getRandomValues when the runtime provides it (browsers do) and
 * falls back to Math.random for older WebViews / test environments.
 */
export function generateFrpSk(length = FRP_SK_LENGTH) {
  const size = Number(length) > 0 ? Math.floor(Number(length)) : FRP_SK_LENGTH;
  const bytes = new Uint8Array(size);
  const cryptoObj = getCrypto();

  if (cryptoObj && typeof cryptoObj.getRandomValues === 'function') {
    cryptoObj.getRandomValues(bytes);
  } else {
    for (let i = 0; i < size; i += 1) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }

  let sk = '';
  for (let i = 0; i < size; i += 1) {
    sk += SK_ALPHABET.charAt(bytes[i] % SK_ALPHABET.length);
  }
  return sk;
}

export function isValidFrpPort(value) {
  if (value === '' || value === null || value === undefined) return false;
  const port = Number(value);
  return Number.isInteger(port) && port >= MIN_PORT && port <= MAX_PORT;
}

function toPortValue(value, fallback) {
  return isValidFrpPort(value) ? String(Number(value)) : String(fallback);
}

/**
 * Normalise a device response (or a local form model) into the shape the page
 * binds to. Ports are kept as strings because they are edited in text inputs.
 */
export function normalizeFrpConfig(raw) {
  const source = raw && typeof raw === 'object' ? raw : {};
  const enabled =
    source.enabled === true || source.enabled === 1 || source.enabled === '1';

  return {
    enabled,
    sk: typeof source.sk === 'string' ? source.sk : '',
    web_port: toPortValue(source.web_port, FRP_DEFAULT_WEB_PORT),
    ssh_port: toPortValue(source.ssh_port, FRP_DEFAULT_SSH_PORT),
  };
}

/**
 * Apply an enable/disable transition.
 *
 * Disabling drops the key; enabling always mints a new one — this is the
 * "cleared on disable, regenerated on re-enable" contract of the device API.
 */
export function withEnabledState(config, enabled) {
  const next = normalizeFrpConfig(config);
  next.enabled = enabled === true;
  next.sk = next.enabled ? generateFrpSk() : '';
  return next;
}

/**
 * Build the `router.frp.update` parameters. `sk` is always transmitted as an
 * empty string while disabled (the device clears the stored key), and ports
 * are sent as numbers.
 */
export function buildFrpUpdateParams(config) {
  const next = normalizeFrpConfig(config);
  return {
    enabled: next.enabled,
    sk: next.enabled ? next.sk : '',
    web_port: Number(next.web_port),
    ssh_port: Number(next.ssh_port),
  };
}
