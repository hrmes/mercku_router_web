/**
 * Development-only `/app` mock used by `npm run dev:unified`.
 *
 * It covers the active preview pages. Unknown methods receive an empty
 * successful result.
 * Production builds never include or execute this middleware.
 */

const MOCK_RESULTS = Object.freeze({
  // Runtime identity, same shape as the device suite's system.runtimeConfig
  // (see tests/fixtures/runtime-config/valid.v1.json). M6a hardware maps to
  // modelId M8 (see unified/src/profiles/models/registry.js).
  'system.runtimeConfig': {
    schemaVersion: 1,
    revision: 'dev-offline-preview',
    modelId: 'M8',
    customerId: '0001',
    backend: 'mercku_mtk7621',
    detectedCapabilities: {
      sfp: false,
    },
  },
  'router.is_initial': { status: false },
  'router.is_login': { status: true },
  'router.login': { role: 'admin' },
  'router.logout': {},
  'router.meta.get': {
    name: 'Mercku M6A',
    sn: 'OFFLINE-PREVIEW',
  },
  'mesh.mode.get': { mode: 'router', mesh_enabled: true, apclient: null },
  'mesh.mode.update': {},
  'mesh.apclient.scan': {},
  'mesh.apclient.get': [
    {
      ssid: 'Mercku_Office_5G',
      bssid: '4C:77:66:21:8A:10',
      band: '5G',
      channel: 149,
      security: 'wpa2',
      rssi: -51,
    },
    {
      ssid: 'Home_WiFi',
      bssid: 'A8:12:34:7C:90:02',
      band: '2.4G',
      channel: 6,
      security: 'wpa2wpa3',
      rssi: -64,
    },
    {
      ssid: 'Guest_Network',
      bssid: 'BC:90:11:45:72:AF',
      band: '5G',
      channel: 44,
      security: 'open',
      rssi: -73,
    },
  ],
  'mesh.meta.get': {
    smart_connect: true,
    compatibility_mode: false,
    dfs: true,
    tx_power: 'high',
    bands: {
      '2.4G': {
        ssid: 'Router Preview',
        password: 'preview123',
        enabled: true,
        hidden: false,
        encrypt: 'wpa2',
        channel: { mode: 'auto', number: 1, bandwidth: 20 },
      },
      '5G': {
        ssid: 'Router Preview_5G',
        password: 'preview123',
        enabled: true,
        hidden: false,
        encrypt: 'wpa2',
        channel: { mode: 'auto', number: 36, bandwidth: 80 },
      },
    },
  },
  'mesh.channel.supported.get': {
    '2.4G': { numbers: [1, 6, 11] },
    '5G': { numbers: [36, 40, 44, 48] },
  },
  'mesh.config.wifi.update': {},
  'mesh.guestwifi.get': [
    {
      id: 'offline-guest',
      enabled: false,
      duration: -1,
      remaining_duration: 0,
      smart_connect: true,
      bands: {
        '2.4G': {
          ssid: 'Router Preview Guest',
          password: '',
          encrypt: 'open',
        },
        '5G': {
          ssid: 'Router Preview Guest_5G',
          password: '',
          encrypt: 'open',
        },
      },
    },
  ],
  'mesh.guestwifi.update': {},
  'mesh.portfw.get': [],
  'mesh.node.get': [
    {
      is_gw: true,
      name: 'Mercku M6A',
      sn: '080000000000001',
      status: 'online',
      version: { current: '2.1.8' },
      model: { id: '08', version: { id: '0' } },
      lan: { ip: '192.168.127.1' },
      mac: { lan: 'A4:22:49:6C:20:01' },
      neighbors: [],
      stations: [],
    },
    {
      is_gw: false,
      name: 'Living Room Node',
      sn: '080000000000002',
      status: 'offline',
      version: { current: '2.1.8' },
      model: { id: '08', version: { id: '0' } },
      lan: { ip: '192.168.127.12' },
      mac: { lan: 'A4:22:49:6C:20:47' },
      neighbors: [],
      stations: [],
    },
    {
      is_gw: false,
      name: 'Study Node',
      sn: '080000000000003',
      status: 'offline',
      version: { current: '2.1.8' },
      model: { id: '08', version: { id: '0' } },
      lan: { ip: '192.168.127.18' },
      mac: { lan: 'A4:22:49:6C:20:82' },
      neighbors: [],
      stations: [],
    },
  ],
  'mesh.device.count.get': { count: 3 },
  'request.get': { ip: '192.168.1.100' },
  'mesh.device.get': [
    {
      ip: '192.168.1.100',
      name: 'Preview Laptop',
      online_info: { band: 'wired', online_duration: 3600 },
    },
  ],
  'mesh.info.wan.net.get': { type: 'dhcp' },
  'mesh.info.wan.stats.get': {
    speed: { realtime: { up: 128000, down: 1024000 } },
  },
  'mesh.wan.status.get': { status: 'connected' },
  'mesh.node.new.info': {},
  'mesh.wan.intf.get': { interface: 'RJ45' },
  'mesh.wan.intf.update': {},
  'mesh.poe.mode.get': { mode: 'active' },
  'mesh.poe.mode.update': {},
  'mesh.fan.mode.get': { mode: 'sleep' },
  'mesh.fan.mode.update': {},
  'router.config.frozen.get': { enabled: false, configs: [] },
  'router.config.frozen.update': {},
});

const previewModeState = {
  mode: 'router',
  mesh_enabled: true,
  apclient: null,
};

function updatePreviewMode(params = {}) {
  const mode = params.mode || previewModeState.mode;
  previewModeState.mode = mode;
  previewModeState.mesh_enabled = typeof params.mesh_enabled === 'boolean'
    ? params.mesh_enabled
    : mode === 'router';

  if (mode !== 'wireless_bridge') {
    previewModeState.apclient = null;
    return;
  }

  const requestedAp = params.apclient || {};
  const scannedAp = MOCK_RESULTS['mesh.apclient.get'].find(ap => (
    ap.bssid === requestedAp.bssid && ap.band === requestedAp.band
  )) || {};
  previewModeState.apclient = {
    ...requestedAp,
    password: undefined,
    rssi: scannedAp.rssi === undefined ? -60 : scannedAp.rssi,
    ip: '192.168.1.86',
  };
}

function getMockResult(method, params) {
  if (method === 'mesh.mode.get') {
    return { ...previewModeState };
  }
  if (method === 'mesh.mode.update') {
    updatePreviewMode(params);
    return {};
  }
  return Object.prototype.hasOwnProperty.call(MOCK_RESULTS, method)
    ? MOCK_RESULTS[method]
    : {};
}

function sendResult(res, result) {
  res.status(200);
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Mercku-Offline-Preview', '1');
  res.end(JSON.stringify({ result }));
}

function serveOfflineApi(req, res, next) {
  if (process.env.MERCKU_OFFLINE_PREVIEW !== '1') {
    next();
    return;
  }
  if (req.method !== 'POST' || req.path !== '/app') {
    next();
    return;
  }

  if (req.body && typeof req.body === 'object') {
    sendResult(res, getMockResult(req.body.method, req.body.params));
    return;
  }

  let raw = '';
  req.setEncoding('utf8');
  req.on('data', (chunk) => { raw += chunk; });
  req.on('end', () => {
    let body = {};
    try {
      body = raw ? JSON.parse(raw) : {};
    } catch (err) {
      body = {};
    }
    sendResult(res, getMockResult(body.method, body.params));
  });
}

module.exports = serveOfflineApi;
module.exports.getMockResult = getMockResult;
