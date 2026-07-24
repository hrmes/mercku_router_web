/**
 * Development-only `/app` mock used by `npm run dev:unified`.
 *
 * It covers the active preview pages. Unknown methods receive an empty
 * successful result.
 * Production builds never include or execute this middleware.
 */

const MOCK_RESULTS = Object.freeze({
  'router.is_initial': { status: false },
  'router.is_login': { status: true },
  'router.login': { role: 'admin' },
  'router.logout': {},
  'router.meta.get': {
    name: 'Offline Router',
    sn: 'OFFLINE-PREVIEW',
  },
  'mesh.mode.get': { mode: 'router' },
  'mesh.mode.update': {},
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
    { is_gw: true, name: 'Offline Router', sn: 'OFFLINE-PREVIEW' },
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

function getMockResult(method) {
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
    sendResult(res, getMockResult(req.body.method));
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
    sendResult(res, getMockResult(body.method));
  });
}

module.exports = serveOfflineApi;
module.exports.getMockResult = getMockResult;
