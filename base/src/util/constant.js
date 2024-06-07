export const IPv6DefaultPlaceholder = '----:----:----:----:----:----:----:----';

export const Customers = {
  mercku: '0001'
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
export const RouterSnAB2Model = {
  AC: '00',
  M6: '06',
  M6a: '08',
  M6s: '11',
  M6s_Nano: '13'
};
export const Models = {
  M6: 'M6R0',
  M6a: 'M8',
  M6s: 'M11R1',
  M6s_SFP: 'M11R2',
  M6s_Nano: 'M13R0'
};
export const ModelIds = {
  M6R0: 'M6',
  M8: 'M6a',
  M11R1: 'M6s',
  M11R2: 'M6s_SFP',
  M13R0: 'M6s_Nano'
};
export const SnABJMapName = {
  '06': { 0: 'M6' },
  '08': { 0: 'M6a', 1: 'M6a_Plus', 2: 'M6c' },
  11: { 0: 'M6s', 1: 'M6s', 2: 'M6s_SFP' },
  13: { 0: 'M6s_Nano' }
};
// export const ModelIdJMapName = {
//   M6R0: { 0: 'M6' },
//   M8: { 0: 'M6a', 1: 'M6a_Plus', 2: 'M6c' },
//   M11R1: { 0: 'M6s', 1: 'M6s', 2: 'M6s_SFP' },
//   M11R2: { 0: 'M6s', 1: 'M6s', 2: 'M6s_SFP' },
//   M13R0: { 0: 'M6s Nano' }
// };
export const RouterHasModelDistinctionMap = {
  M6a: '0',
  M6a_Plus: '1',
  M6c: '2',
  M6s: '1',
  M6s_SFP: '2'
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
