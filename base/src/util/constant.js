export const IPv6DefaultPlaceholder = '----:----:----:----:----:----:----:----';

export const Customers = {
  mercku: '0001',
  cik: '0002',
  startca: '0003',
  inverto: '0004',
  orion: '0005',
  realnett: '0006',
  altima: '0007',
  fibrestream: '0013',
  skymesh: '0014',
  pentanet: '0019',
  homeway: '0025',
  junet: '0029'
};
export const IP = {
  IPv4: 'ipv4',
  IPv6: 'ipv6'
};
export const EncryptMethod = {
  open: 'open',
  OPEN: 'OPEN',
  wpa: 'wpa',
  wpa2: 'wpa2',
  wpawpa2: 'wpawpa2',
  wpa3: 'wpa3',
  wpa2wpa3: 'wpa2wpa3'
};
export const Role = {
  super: 'super',
  admin: 'admin'
};
export const RouterStatus = {
  online: 'online',
  offline: 'offline',
  installing: 'installing'
};
export const RouterMode = {
  router: 'router',
  bridge: 'bridge',
  wirelessBridge: 'wireless_bridge'
};
export const WanType = {
  pppoe: 'pppoe',
  static: 'static',
  dhcp: 'dhcp',
  auto: 'auto'
};
export const WanNetStatus = {
  testing: 'testing',
  connected: 'connected',
  linked: 'linked',
  unlinked: 'unlinked'
};
export const RouterSnModel = {
  AC: '00',
  M2: '01',
  Bee: '02',
  M6: '06',
  M6a: '08',
  Homeway: '09',
  M6s: '11',
  M6s_Nano: '13',
  'M6s_PoE++': '16'
};
export const Models = {
  M2: 'M2R2',
  M6: 'M6R0',
  M6a: 'M8',
  M6s: 'M11R1',
  M6s_Nano: 'M13R0',
  'M6s_PoE++': 'M16R0'
};
export const ModelsMap = Object.entries(Models).reduce(
  (model, [key, value]) => {
    model[value] = key;
    return model;
  },
  {}
);
export const M6aSeriesModelIDs = {
  M6a: '0',
  M6a_Plus: '1',
  M6c: '2'
};
export const M6aSeriesModelIDMap2Model = Object.entries(
  M6aSeriesModelIDs
).reduce((model, [key, value]) => {
  model[value] = key;
  return model;
}, {});
export const SpeedTestStatus = {
  testing: 'testing',
  done: 'done',
  failed: 'failed'
};
export const Bands = {
  '2.4G': '2.4G',
  '5G': '5G',
  b24g: '2.4G',
  b5g: '5G',
  wired: 'wired'
};
export const channelMode = {
  auto: 'auto',
  manual: 'manual'
};
export const AppMessage = {
  closewebpage: 'CLOSE_WEB_PAGE',
  forward2wifi: 'JUMP_SYSTEM_WIFI_SETTING'
};
export const UploadStatus = {
  ready: 'ready',
  success: 'success',
  fail: 'fail',
  uploading: 'uploading'
};
export const BlacklistMode = {
  free: 'free',
  blacklist: 'blacklist',
  whitelist: 'whitelist'
};
export const VPNType = {
  pptp: 'pptp',
  l2tp: 'l2tp',
  openvpn: 'openvpn',
  wireguard: 'wireguard'
};
export const VPNStatus = {
  connected: 'connected',
  connecting: 'connecting',
  disconnecting: 'disconnecting',
  disconnected: 'disconnected',
  ready: 'ready'
};
export const VPNAction = {
  connect: 'connect',
  disconnect: 'disconnect'
};
export const defaultScrollbarOpt = {
  freeScroll: true,
  disableMouse: false,
  click: true,
  stopPropagation: true,
  mouseWheel: {
    speed: 20,
    invert: false,
    easeTime: 300
  },
  scrollbar: { fade: true }
};
export const Weeks = {
  mon: 'Mon',
  tue: 'Tue',
  wed: 'Wed',
  thu: 'Thu',
  fri: 'Fri',
  sat: 'Sat',
  sun: 'Sun'
};

export const HomewayFanModel = {
  game: 'game',
  standard: 'standard',
  sleep: 'sleep'
};
export const RefreshSVGPath =
  'M7.505.57a.5.5 0 0 1 .692-.53l3.5 1.5a.5.5 0 0 1 .08.876l-3 2a.5.5 0 0 1-.772-.345l-.107-.75a7 7 0 1 0 6.123.949 1 1 0 0 1 1.151-1.636 9 9 0 1 1-7.56-1.314z';
export const AddNodeType = {
  wired: 'wired',
  wireless: 'wireless'
};
export const ConnectionQuality = {
  excellent: 'excellent',
  fair: 'fair',
  offline: 'offline'
};
export const Color = {
  good: '#00d061',
  bad: '#ff6f00',
  offline: '#b3b3b3'
};
export const RouterColor = {
  black: 'black',
  white: 'white',
  grey: 'grey',
  red: 'red'
};
export const RouterPowerSupplyMode = {
  active: 'active', // 主动模式
  passive: 'passive' // 被动模式
};
