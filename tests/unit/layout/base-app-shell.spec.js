/* eslint-env mocha */
const { expect } = require('chai');

const AppShell = require('../../../base/src/layouts/app-shell.vue').default;
const defaultLayout = require('../../../base/src/layouts/default.vue').default;
const primaryLayout = require('../../../base/src/layouts/primary.vue').default;

const menus = [
  { name: 'dashboard', url: '/dashboard', children: [] },
  {
    name: 'setting',
    url: '/setting/wifi',
    children: [
      { name: 'wifi', url: '/setting/wifi' },
      { name: 'wan', url: '/setting/wan' },
    ],
  },
  {
    name: 'advance',
    url: '/advance/portforwarding',
    children: [{ name: 'dhcp', url: '/advance/dhcp' }],
  },
  {
    name: 'upgrade',
    url: '/upgrade/online',
    children: [{ name: 'offline', url: '/upgrade/offline' }],
  },
];

function asideFor(path, hasAside = true) {
  return AppShell.computed.asideInfo.call({
    menus,
    $route: { path, meta: { hasAside } },
  });
}

describe('Base runtime App Shell', () => {
  it('uses the existing Base default and primary layouts', () => {
    expect(AppShell.components.default).to.equal(defaultLayout);
    expect(AppShell.components.primary).to.equal(primaryLayout);
  });

  [
    ['/setting/wifi', 'setting'],
    ['/advance/dhcp', 'advance'],
    ['/upgrade/offline', 'upgrade'],
  ].forEach(([path, groupName]) => {
    it(`selects ${groupName} secondary navigation for ${path}`, () => {
      const result = asideFor(path);
      expect(result.hasAside).to.equal(true);
      expect(result.subMenu).to.have.lengthOf(1);
      expect(result.subMenu[0].name).to.equal(groupName);
    });
  });

  it('does not show secondary navigation on dashboard', () => {
    expect(asideFor('/dashboard', false)).to.deep.equal({ hasAside: false, subMenu: [] });
  });

  it('matches an optional router base prefix without relying on path segment indexes', () => {
    expect(asideFor('/web/setting/wan').subMenu[0].name).to.equal('setting');
  });
});
