import { Role, RouterMode, Customers } from 'base/util/constant';

const customerId = process.env.CUSTOMER_CONFIG.id;
const modelId = process.env.MODEL_CONFIG.id;
export default function getMenu(role, mode = RouterMode.router) {
  console.log('Init menus...');
  console.log(`customer id is: ${customerId}`);
  console.log(`model id is: ${modelId}`);
  console.log(`role is: ${role}`);
  console.log(`mode is: ${mode}`);
  // 菜单默认配置
  const config = {
    show: true,
    auth: [Role.admin, Role.super],
    mode: [RouterMode.router, RouterMode.bridge, RouterMode.wirelessBridge]
  };
  // 第一种搭配策略
  const strategyA = {
    show: true,
    auth: [Role.admin, Role.super],
    mode: [RouterMode.router]
  };
  const dashboard = {
    icon: 'ic_home_light',
    selectedIcon: 'ic_home_selected',
    text: 'trans0173',
    url: '/dashboard',
    children: []
  };
  const setting = {
    icon: 'ic_home_settings_light',
    selectedIcon: 'ic_home_settings_selected',
    text: '路由器设置',
    name: 'setting',
    url: '/setting/wifi',
    children: [
      {
        text: 'trans0103',
        name: 'wifi',
        url: '/setting/wifi',
        config
      },
      {
        text: 'trans0142',
        name: 'wan',
        url: '/setting/wan',
        config: strategyA
      },
      {
        text: 'trans0620',
        name: 'ipv6',
        url: '/setting/ipv6',
        config: strategyA
      },
      {
        text: 'trans0561',
        name: 'safe',
        url: '/setting/safe',
        config
      },
      {
        url: '/setting/super',
        name: 'super',
        text: 'trans0576',
        config,
        customers: {
          [Customers.mercku]: {
            show: false
          },
          [Customers.qiyou]: {
            show: false
          }
        }
      },
      {
        text: 'trans0020',
        name: 'blacklist',
        url: '/setting/blacklist',
        config: strategyA
      },
      {
        text: 'trans0272',
        name: 'timezone',
        url: '/setting/timezone',
        config
      },
      {
        text: 'trans0639',
        name: 'region',
        url: '/setting/region',
        config
      },
      {
        url: '/setting/upnp',
        name: 'upnp',
        text: 'trans0644',
        config: strategyA
      },
      {
        url: '/setting/led/switch',
        name: 'led.switch',
        text: 'LED开关灯',
        config
      }
      // {
      //   url: '/setting/schedule',
      //   name: 'schedule',
      //   text: 'trans0962',
      //   config
      // }
      // {
      //   url: '/setting/wps',
      //   name: 'wps',
      //   text: 'trans1168',
      //   config
      // }
    ]
  };
  const game = {
    icon: 'ic_home_settings_light',
    selectedIcon: 'ic_home_settings_selected',
    text: '游戏加速',
    name: 'game.acceleration',
    url: '/game/acceleration',
    children: []
  };
  const devices = {
    icon: 'ic_home_settings_light',
    selectedIcon: 'ic_home_settings_selected',
    text: '接入设备',
    name: 'devices',
    url: '/access/devices/primary',
    children: []
  };
  const advance = {
    icon: 'ic_advanced_settings_light',
    selectedIcon: 'ic_advanced_settings_selected',
    text: 'trans0416',
    name: 'advance',
    url: '/advance/portforwarding',
    children: [
      {
        url: '/advance/portforwarding',
        name: 'advance.portforwarding',
        text: 'trans0422',
        config: strategyA
      },
      {
        url: '/advance/dmz',
        name: 'advance.dmz',
        text: 'trans0420',
        config: strategyA
      },
      {
        url: '/advance/dhcp',
        name: 'advance.dhcp',
        text: 'trans0417',
        config: strategyA
      },
      {
        url: '/advance/rsvdip',
        name: 'advance.rsvdip',
        text: 'trans0444',
        config: strategyA
      },
      {
        url: '/advance/mac',
        name: 'advance.mac',
        text: 'trans0474',
        config: strategyA
      },
      {
        url: '/advance/ddns',
        name: 'advance.ddns',
        text: 'trans0418',
        config: strategyA
      },
      {
        url: '/advance/vpn',
        name: 'advance.vpn',
        text: 'trans0402',
        config: strategyA
      },
      {
        url: '/advance/mode',
        name: 'advance.mode',
        text: 'trans0539',
        config,
        customers: {
          [Customers.qiyou]: {
            show: false
          }
        }
      },
      {
        url: '/advance/diagnosis',
        name: 'advance.diagnosis',
        text: 'trans0419',
        config: strategyA
      },
      {
        url: '/advance/firewall',
        name: 'advance.firewall',
        text: 'trans0424',
        config: strategyA
      },
      {
        url: '/advance/wwa',
        name: 'advance.wwa',
        text: 'trans0511',
        config: strategyA
      },
      {
        url: '/advance/tr069',
        name: 'advance.tr069',
        text: 'trans0499',
        config: {
          show: true,
          auth: [Role.super],
          mode: [
            RouterMode.router,
            RouterMode.bridge,
            RouterMode.wirelessBridge
          ]
        },
        customers: {
          [Customers.mercku]: {
            show: true
          }
        }
      },
      {
        url: '/advance/telnet',
        name: 'advance.telnet',
        text: 'trans0497',
        config: {
          show: false,
          auth: [Role.super],
          mode: [RouterMode.router]
        }
      }
    ]
  };
  const system = {
    icon: 'ic_upgrade_firmware_light',
    selectedIcon: 'ic_upgrade_firmware_selected',
    text: '系统设置',
    name: 'system',
    url: '/system/upgrade/offline',
    children: [
      {
        url: '/system/upgrade/offline',
        name: 'offline',
        text: 'trans0204',
        config
      },
      {
        url: '/system/upgrade/online',
        name: 'online',
        text: 'trans0202',
        config
      },
      {
        url: '/system/upgrade/auto',
        name: 'auto',
        text: 'trans0743',
        config
      },
      {
        url: '/system/log',
        name: 'system.log',
        text: 'trans0421',
        config
      },
      {
        url: '/system/backup',
        name: 'system.backup',
        text: 'trans1019',
        config
      },
      {
        url: '/system/restore',
        name: 'system.restore',
        text: '恢复出厂设置',
        config
      }
    ]
  };
  const theme = {
    icon: 'ic_theme_light',
    text: 'trans1119',
    children: []
  };
  [dashboard, setting, game, devices, advance, system, theme].forEach(item => {
    // 根据编译客户生成菜单
    item.children.forEach(menu => {
      menu.config = menu.config || config;
      const customers = menu.customers || {};
      const customerConfig = customers[customerId] || {};
      menu.config = Object.assign({}, menu.config, customerConfig);
    });

    // 过滤不显示的菜单
    item.children = item.children.filter(menu => {
      let { show } = menu.config;
      // 如果支持多级管理员，判断当前角色是否可以查看菜单
      if (process.env.CUSTOMER_CONFIG.allow2LevelAdmin && show) {
        show = menu.config.auth.includes(role);
      }
      return show;
    });

    // 根据模式选择对应的菜单项
    item.children.forEach(menu => {
      menu.disabled = false;
      if (!menu.config.mode.includes(mode)) {
        menu.disabled = true;
      }
    });

    // 根据最后生成的菜单，去设置父级菜单的url值指向哪一个子级菜单
    item.children.length &&
      item.children.some(menu => {
        if (!menu.disabled) {
          item.url = menu.url;
          return true;
        }
      });
  });

  console.log([dashboard, setting, game, devices, advance, system, theme]);
  return [dashboard, setting, game, devices, advance, system, theme];
}
