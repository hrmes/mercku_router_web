export const WanType = {
  pppoe: 'pppoe',
  static: 'static',
  dhcp: 'dhcp'
};
export const WanNetStatus = {
  testing: 'testing',
  connected: 'connected',
  linked: 'linked',
  unlinked: 'unlinked'
};
export const RouterSnModel = {
  '00': '电源适配器',
  '01': 'M2',
  '02': 'Bee'
};
export const SpeedTestStatus = {
  testing: 'testing',
  done: 'done',
  failed: 'failed'
};
export const Bands = {
  '2.4G': '2.4G',
  '5G': '5G'
};
export const AppMessage = {
  closewebpage: 'CLOSE_WEB_PAGE',
  forward2wifi: 'JUMP_SYSTEM_WIFI_SETTING'
};
export default {
  WanType,
  wanNetStatus,
  routerSnModel,
  speedTestStatus
};
