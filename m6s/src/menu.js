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
    mode: [RouterMode.router, RouterMode.bridge]
  };
  // 第一种搭配策略
  const strategyA = {
    show: true,
    auth: [Role.admin, Role.super],
    mode: [RouterMode.router]
  };
  const dashboard = {
    icon: 'icon-ic_home_light1',
    selectedIcon: 'icon-ic_home_selected',
    text: 'trans0173',
    url: '/dashboard',
    children: []
  };
  const setting = {
    icon: 'icon-ic_home_settings_light1',
    selectedIcon: 'icon-ic_home_settings_selected_light',
    text: 'trans0019',
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
        config: strategyA,
        customers: {
          [Customers.realnett]: {
            show: false
          }
        }
      },
      {
        text: 'trans0561',
        name: 'safe',
        url: '/setting/safe',
        config,
        customers: {
          [Customers.realnett]: {
            auth: [Role.admin]
          },
          [Customers.pentanet]: {
            auth: [Role.admin]
          }
        }
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
          [Customers.realnett]: {
            show: true,
            auth: [Role.super]
          },
          [Customers.pentanet]: {
            show: true,
            auth: [Role.super]
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
        url: '/setting/guest',
        name: 'guest',
        text: 'trans0538',
        config: strategyA
      },
      {
        url: '/setting/upnp',
        name: 'upnp',
        text: 'trans0644',
        config: strategyA
      },
      // {
      //   url: '/setting/led',
      //   name: 'led',
      //   text: 'trans0779',
      //   config
      // },
      // {
      //   url: '/setting/schedule',
      //   name: 'schedule',
      //   text: 'trans0962',
      //   config
      // }
      {
        url: '/setting/wps',
        name: 'wps',
        text: 'WPS',
        config
      }
    ]
  };
  const advance = {
    icon: 'icon-ic_advanced_settings_light',
    selectedIcon: 'icon-ic_advanced_settings_selected_light',
    text: 'trans0416',
    name: 'advance',
    url: '/advance/portforwarding',
    children: [
      {
        url: '/advance/portforwarding',
        name: 'advance-portforwarding',
        text: 'trans0422',
        config: strategyA
      },
      {
        url: '/advance/dmz',
        name: 'advance-dmz',
        text: 'trans0420',
        config: strategyA
      },
      {
        url: '/advance/dhcp',
        name: 'advance-dhcp',
        text: 'trans0417',
        config: strategyA
      },
      {
        url: '/advance/rsvdip',
        name: 'advance-rsvdip',
        text: 'trans0444',
        config: strategyA
      },
      {
        url: '/advance/mac',
        name: 'advance-mac',
        text: 'trans0474',
        config: strategyA
      },
      {
        url: '/advance/ddns',
        name: 'advance-ddns',
        text: 'trans0418',
        config: strategyA
      },
      {
        url: '/advance/vpn',
        name: 'advance-vpn',
        text: 'trans0402',
        config: strategyA
      },
      {
        url: '/advance/mode',
        name: 'advance-mode',
        text: 'trans0539',
        config,
        customers: {
          [Customers.cik]: {
            show: false
          },
          [Customers.startca]: {
            show: false
          }
        }
      },
      {
        url: '/advance/diagnosis',
        name: 'advance-diagnosis',
        text: 'trans0419',
        config: strategyA
      },
      {
        url: '/advance/log',
        name: 'advance-log',
        text: 'trans0421',
        config
      },
      {
        url: '/advance/firewall',
        name: 'advance-firewall',
        text: 'trans0424',
        config: strategyA,
        customers: {
          [Customers.realnett]: {
            auth: [Role.super]
          }
        }
      },
      {
        url: '/advance/wwa',
        name: 'advance.wwa',
        text: 'trans0511',
        config: strategyA,
        customers: {
          [Customers.realnett]: {
            auth: [Role.super]
          },
          [Customers.pentanet]: {
            auth: [Role.super]
          }
        }
      },
      {
        url: '/advance/tr069',
        name: 'advance.tr069',
        text: 'trans0499',
        config: {
          show: true,
          auth: [Role.super],
          mode: [RouterMode.router, RouterMode.bridge]
        },
        customers: {
          [Customers.mercku]: {
            show: true
          },
          [Customers.realnett]: {
            show: false
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
      },
      {
        url: '/advance/backup',
        name: 'advance.backup',
        text: 'trans1019',
        config
      }
    ]
  };
  const upgrade = {
    icon: 'icon-ic_upgrade_firmware_light1',
    selectedIcon: 'icon-ic_upgrade_firmware_selected_light',
    text: 'trans0197',
    name: 'upgrade',
    url: '/upgrade/online',
    children: [
      {
        url: '/upgrade/online',
        name: 'online',
        text: 'trans0202',
        config
      },
      {
        url: '/upgrade/offline',
        name: 'offline',
        text: 'trans0204',
        config
      },
      {
        url: '/upgrade/auto',
        name: 'auto',
        text: 'trans0743',
        config
      }
    ]
  };
  const theme = {
    icon: 'icon-ic_theme_light',
    text: 'trans1119',
    children: []
  };
  [dashboard, setting, advance, upgrade, theme].forEach(item => {
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

  console.log([dashboard, setting, advance, upgrade, theme]);
  return [dashboard, setting, advance, upgrade, theme];
}
