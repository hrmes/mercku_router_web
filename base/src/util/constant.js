export const IPv6DefaultPlaceholder = '----:----:----:----:----:----:----:----';

export const Customers = {
  internal: '0000',
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
  offline: 'offline'
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
  M6c: '07',
  M6a: '08',
  Homeway: '09'
};
export const M6aRouterSnModelVersion = {
  M6a: '0',
  M6a_Plus: '1'
};
export const SpeedTestStatus = {
  testing: 'testing',
  done: 'done',
  failed: 'failed'
};
export const Bands = {
  '2.4G': '2.4G',
  '5G': '5G',
  b24g: '2.4G',
  b5g: '5G'
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
export const Models = {
  m2: 'M2R2',
  m6: 'M6R0',
  m6c: 'M7R0',
  m6a: 'M8',
  homeway_230v: 'M9R0',
  homeway_POE1: 'M9R1',
  homeway_POE2: 'M9R2'
};
export const HomewayFanModel = {
  game: 'game',
  standard: 'standard',
  sleep: 'sleep'
};

export const AddNodeType = {
  wired: 'wired',
  wireless: 'wireless'
};
