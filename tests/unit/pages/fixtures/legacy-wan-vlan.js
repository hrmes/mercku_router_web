// Source-shaped fixtures, NOT Suite projections or captured DUT replies.
// Gen1 fal_wan.c vlan_config_to_json/fal_wan_*_to_json; CH ch_fal_wan.c
// mercku_fal_wan_net_vlan_to_json. Gen1 SAL currently leaves type=0 (UNKNOW);
// NAT/BRIDGE/HW_NAT also exercise the serializer's supported struct values.
module.exports = function legacyWan(platform, type, count = 2) {
  const port = (id, tagged) => ({ port: { id, name: platform === 'mt7981' ? 'wan' : '', type: 'wan' }, tagged });
  const vlan = [
    { enabled: true, id: 35, priority: 3, is_bridged: false, ports: [port(4, true)] },
    { enabled: false, id: 100, priority: 5, is_bridged: platform !== 'mt7981', ports: [port(1, true), port(2, false)] }
  ].slice(0, count);
  vlan.forEach(row => {
    if (platform !== 'ipq60xx') row.name = row.id === 35 ? 'internet' : 'voice';
    if (platform !== 'mt7981') row.type = row.is_bridged ? 'BRIDGE' : 'NAT';
  });
  const get = { type, vlan, netinfo: { ip: '', mask: '', gateway: '', dns: platform === 'ipq60xx' ? ['0.0.0.0'] : [] } };
  if (type === 'dhcp') get.dhcp = platform === 'mt7981' ? { dns: [] } : {};
  if (type === 'static') get.static = { netinfo: { ip: '10.1.1.2', mask: '255.255.255.0', gateway: '10.1.1.1', dns: ['1.1.1.1'] } };
  if (type === 'pppoe') {
    get.pppoe = { account: 'legacy-account', password: 'legacy-password' };
    if (platform === 'mt7981') get.pppoe.dns = [];
    else get.pppoe.vlan = JSON.parse(JSON.stringify(vlan));
  }
  return get;
};
