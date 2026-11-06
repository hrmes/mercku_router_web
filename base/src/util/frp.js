/* global globalThis */
/**
 * FRP (STCP) helpers shared by the "FRP" advance-settings page.
 *
 * The page sends one `router.frp.update` command containing the complete
 * configuration, so everything that decides the wire payload lives here and
 * stays unit-testable without mounting the Vue component.
 *
 * Rules implemented here:
 *   - legacy Web/SSH settings are migrated into a proxy list;
 *   - the secret key is only part of the payload while FRP is enabled;
 *   - disabling clears the key; enabling accepts a user-supplied key or
 *     generates a new random key when no key was supplied.
 */
export const FRP_DEFAULT_WEB_PORT = 80;
export const FRP_DEFAULT_SSH_PORT = 22;
export const FRP_DEFAULT_SERVER_PORT = 7000;
export const FRP_DEFAULT_LOCAL_IP = '127.0.0.1';
export const FRP_SK_LENGTH = 16;

// Ambiguous glyphs (0/O, 1/l/I) are excluded so the key can be typed by hand
// on the visitor side without guessing.
const SK_ALPHABET =
  'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';

const MIN_PORT = 1;
const MAX_PORT = 65535;

function getCrypto() {
  if (typeof globalThis !== 'undefined' && globalThis.crypto &&
      typeof globalThis.crypto.getRandomValues === 'function') {
    return globalThis.crypto;
  }
  if (typeof window !== 'undefined' && window.crypto &&
      typeof window.crypto.getRandomValues === 'function') {
    return window.crypto;
  }
  return null;
}

/**
 * Generate a random secret key for STCP FRP.
 *
 * Requires crypto.getRandomValues; never fall back to a non-cryptographic
 * random source for an access credential.
 */
export function generateFrpSk(length = FRP_SK_LENGTH) {
  const size = Number(length) > 0 ? Math.floor(Number(length)) : FRP_SK_LENGTH;
  const bytes = new Uint8Array(size);
  const cryptoObj = getCrypto();

  if (!cryptoObj) {
    throw new Error('Secure random number generation is unavailable');
  }
  cryptoObj.getRandomValues(bytes);

  let sk = '';
  for (let i = 0; i < size; i += 1) {
    sk += SK_ALPHABET.charAt(bytes[i] % SK_ALPHABET.length);
  }
  return sk;
}

export function isValidFrpPort(value) {
  if (value === '' || value === null || value === undefined) return false;
  if (!/^\d+$/.test(String(value))) return false;
  const port = Number(value);
  return Number.isInteger(port) && port >= MIN_PORT && port <= MAX_PORT;
}

// Server addresses are hostnames or IPv4 literals, without a URL scheme/port.
export function isValidFrpServer(value) {
  if (typeof value !== 'string') return false;
  const host = value.trim();
  if (!host || host.length > 253) return false;
  if (/^[\d.]+$/.test(host)) {
    return /^(?:\d{1,3}\.){3}\d{1,3}$/.test(host) &&
      host.split('.').every(part => Number(part) <= 255);
  }
  return host.split('.').every(label =>
    /^[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?$/i.test(label));
}

function toPortValue(value, fallback) {
  return isValidFrpPort(value) ? String(Number(value)) : String(fallback);
}

// A conservative UI naming policy for portable FRPC configurations.
export function isValidFrpProxyName(value) {
  return typeof value === 'string' && /^[A-Za-z0-9][A-Za-z0-9_.-]{0,127}$/.test(value.trim());
}

export function createFrpProxyNames(deviceId) {
  const id = typeof deviceId === 'string' ? deviceId.trim() : '';
  if (!/[A-Za-z0-9]/.test(id)) return { web_name: '', ssh_name: '' };
  const prefix = `router_${id.replace(/[^A-Za-z0-9_-]/g, '_').slice(0, 96)}`;
  return { web_name: `${prefix}_web`, ssh_name: `${prefix}_ssh` };
}

export function cloneFrpConfig(config) {
  return { ...config, proxies: config.proxies.map(proxy => ({ ...proxy })) };
}

function normalizeFrpProxy(raw, defaultPort = FRP_DEFAULT_WEB_PORT) {
  const source = raw && typeof raw === 'object' ? raw : {};
  return {
    name: typeof source.name === 'string' ? source.name.trim() : '',
    local_ip: typeof source.local_ip === 'string' ? source.local_ip.trim() : FRP_DEFAULT_LOCAL_IP,
    local_port: toPortValue(source.local_port, defaultPort)
  };
}

/**
 * Normalise a device response (or a local form model) into the shape the page
 * binds to. Ports are kept as strings because they are edited in text inputs.
 */
export function normalizeFrpConfig(raw) {
  const source = raw && typeof raw === 'object' ? raw : {};
  if (Object.prototype.hasOwnProperty.call(source, 'proxies') && !Array.isArray(source.proxies)) {
    throw new Error('Invalid FRP proxy list');
  }
  const enabled =
    source.enabled === true || source.enabled === 1 || source.enabled === '1';
  // An explicitly empty list stays empty; never resurrect deleted defaults.
  const proxies = Array.isArray(source.proxies)
    ? source.proxies.map(proxy => normalizeFrpProxy(proxy))
    : [
      normalizeFrpProxy({
        name: source.web_name, local_ip: source.web_ip, local_port: source.web_port
      }, FRP_DEFAULT_WEB_PORT),
      normalizeFrpProxy({
        name: source.ssh_name, local_ip: source.ssh_ip, local_port: source.ssh_port
      }, FRP_DEFAULT_SSH_PORT)
    ];

  return {
    enabled,
    server_addr: typeof source.server_addr === 'string' ? source.server_addr.trim() : '',
    server_port: toPortValue(source.server_port, FRP_DEFAULT_SERVER_PORT),
    token: typeof source.token === 'string' ? source.token : '',
    sk: typeof source.sk === 'string' ? source.sk : '',
    proxies,
  };
}

/**
 * Apply an enable/disable transition.
 *
 * Disabling drops the key. Enabling keeps a supplied key, or creates one
 * when empty, allowing visitors to use credentials provided by their server.
 */
export function withEnabledState(config, enabled) {
  const next = normalizeFrpConfig(config);
  next.enabled = enabled === true;
  next.sk = next.enabled ? (next.sk || generateFrpSk()) : '';
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
    server_addr: next.server_addr,
    server_port: Number(next.server_port),
    token: next.token,
    sk: next.enabled ? next.sk : '',
    proxies: next.proxies.map(proxy => ({ ...proxy, local_port: Number(proxy.local_port) })),
  };
}
