/**
 * FRP (STCP) helpers shared by the "FRP" advance-settings page.
 *
 * Save sends the complete proxy list. The optional `sk` field replaces the
 * saved secret only when the user enters a new one.
 */
export const FRP_DEFAULT_WEB_PORT = 80;
export const FRP_DEFAULT_SSH_PORT = 22;
export const FRP_DEFAULT_SERVER_PORT = 7000;
export const FRP_DEFAULT_LOCAL_IP = '127.0.0.1';
const MIN_PORT = 1;
const MAX_PORT = 65535;

export function isValidFrpPort(value) {
  if (typeof value !== 'string' && typeof value !== 'number') return false;
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
  if (isValidFrpPort(value)) return String(Number(value));
  if (fallback !== undefined) return String(fallback);
  // Dynamic targets must stay invalid until the user corrects them. Only
  // legacy Web/SSH migration supplies default target ports.
  return typeof value === 'string' || typeof value === 'number' ? String(value) : '';
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

function normalizeFrpProxy(raw, defaultPort) {
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

export function buildFrpUpdateParams(config) {
  const next = normalizeFrpConfig(config);
  return {
    enabled: next.enabled,
    server_addr: next.server_addr,
    server_port: Number(next.server_port),
    token: next.token,
    ...(next.sk.trim() ? { sk: next.sk } : {}),
    proxies: next.proxies.map(proxy => ({ ...proxy, local_port: Number(proxy.local_port) })),
  };
}
