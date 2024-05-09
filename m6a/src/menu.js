import { Role, RouterMode, Customers } from 'base/util/constant';

const customerId = process.env.CUSTOMER_CONFIG.id;
const modelId = process.env.MODEL_CONFIG.id;
export default function getMenu(role, mode = RouterMode.router) {
  console.log('Init menus...');
  console.log(`customer id is: ${customerId}`);
  console.log(`model id is: ${modelId}`);
  console.log(`role is: ${role}`);
  console.log(`mode is: ${mode}`);
  console.log(`is MVU? ${process.env.IS_MVU}`);
  // 菜单默认配置
  const DefaultStrategy = {
    show: true,
    auth: [Role.admin, Role.super],
    mode: [RouterMode.router, RouterMode.bridge]
  };
  // 第一种搭配策略
  const RouterModeStrategy = {
    show: true,
    auth: [Role.admin, Role.super],
    mode: [RouterMode.router]
  };

  // 菜单默认配置是生成全量功能菜单
  const dashboard = {
    icon: 'ic_home_light',
    selectedIcon: 'ic_home_selected',
    text: 'trans0173',
    url: '/dashboard',
    children: []
  };
  const upgrade = {
    icon: 'ic_upgrade_firmware_light',
    selectedIcon: 'ic_upgrade_firmware_selected',
    text: 'trans0197',
    name: 'upgrade',
    url: '/upgrade/offline',
    children: [
      {
        url: '/upgrade/offline',
        name: 'offline',
        text: 'trans0204',
        DefaultStrategy
      },
      {
        url: '/upgrade/online',
        name: 'online',
        text: 'trans0202',
        DefaultStrategy
      },
      {
        url: '/upgrade/auto',
        name: 'auto',
        text: 'trans0743',
        DefaultStrategy
      }
    ]
  };
  const theme = {
    icon: 'ic_theme_light',
    text: 'trans1119',
    children: []
  };
  let setting = {
    icon: 'ic_home_settings_light',
    selectedIcon: 'ic_home_settings_selected',
    text: 'trans0019',
    name: 'setting',
    url: '/setting/wifi',
    children: [
      {
        text: 'trans0103',
        name: 'wifi',
        url: '/setting/wifi',
        DefaultStrategy
      },
      {
        text: 'trans0142',
        name: 'wan',
        url: '/setting/wan',
        DefaultStrategy: RouterModeStrategy
      },
      {
        text: 'trans0620',
        name: 'ipv6',
        url: '/setting/ipv6',
        DefaultStrategy: RouterModeStrategy,
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
        DefaultStrategy
      },
      {
        url: '/setting/super',
        name: 'super',
        text: 'trans0576',
        DefaultStrategy,
        customers: {
          [Customers.mercku]: {
            show: false
          }
        }
      },
      {
        text: 'trans0020',
        name: 'blacklist',
        url: '/setting/blacklist',
        DefaultStrategy: RouterModeStrategy
      },
      {
        text: 'trans0272',
        name: 'timezone',
        url: '/setting/timezone',
        DefaultStrategy
      },
      {
        text: 'trans0639',
        name: 'region',
        url: '/setting/region',
        DefaultStrategy
      },
      {
        url: '/setting/guest',
        name: 'guest',
        text: 'trans0538',
        DefaultStrategy: RouterModeStrategy
      },
      {
        url: '/setting/upnp',
        name: 'upnp',
        text: 'trans0644',
        DefaultStrategy: RouterModeStrategy
      },
      // {
      //   url: '/setting/led',
      //   name: 'led',
      //   text: 'trans0779',
      //   DefaultStrategy
      // },
      {
        url: '/setting/schedule',
        name: 'schedule',
        text: 'trans0962',
        DefaultStrategy
      }
    ]
  };
  let advance = {
    icon: 'ic_advanced_settings_light',
    selectedIcon: 'ic_advanced_settings_selected',
    text: 'trans0416',
    name: 'advance',
    url: '/advance/portforwarding',
    children: [
      {
        url: '/advance/portforwarding',
        name: 'advance-portforwarding',
        text: 'trans0422',
        DefaultStrategy: RouterModeStrategy
      },
      {
        url: '/advance/dmz',
        name: 'advance-dmz',
        text: 'trans0420',
        DefaultStrategy: RouterModeStrategy
      },
      {
        url: '/advance/dhcp',
        name: 'advance-dhcp',
        text: 'trans0417',
        DefaultStrategy: RouterModeStrategy
      },
      {
        url: '/advance/rsvdip',
        name: 'advance-rsvdip',
        text: 'trans0444',
        DefaultStrategy: RouterModeStrategy
      },
      {
        url: '/advance/mac',
        name: 'advance-mac',
        text: 'trans0474',
        DefaultStrategy: RouterModeStrategy
      },
      {
        url: '/advance/ddns',
        name: 'advance-ddns',
        text: 'trans0418',
        DefaultStrategy: RouterModeStrategy
      },
      {
        url: '/advance/vpn',
        name: 'advance-vpn',
        text: 'trans0402',
        DefaultStrategy: RouterModeStrategy
      },
      {
        url: '/advance/mode',
        name: 'advance-mode',
        text: 'trans0539',
        DefaultStrategy
      },
      {
        url: '/advance/diagnosis',
        name: 'advance-diagnosis',
        text: 'trans0419',
        DefaultStrategy: RouterModeStrategy
      },
      // {
      //   url: '/advance/log',
      //   name: 'advance-log',
      //   text: 'trans0421',
      //   DefaultStrategy
      // },
      // {
      //   url: '/advance/frozenCofig',
      //   name: 'advance-frozen-cofig',
      //   text: 'trans1186',
      //   DefaultStrategy
      // },
      {
        url: '/advance/firewall',
        name: 'advance-firewall',
        text: 'trans0424',
        DefaultStrategy: RouterModeStrategy,
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
        DefaultStrategy: RouterModeStrategy,
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
        DefaultStrategy: {
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
        DefaultStrategy: {
          show: false,
          auth: [Role.super],
          mode: [RouterMode.router]
        }
      }
      // {
      //   url: '/advance/backup',
      //   name: 'advance.backup',
      //   text: 'trans1019',
      //   DefaultStrategy
      // }
    ]
  };

  // 如果是最小可用单元,需要省略部分功能菜单
  if (process.env.IS_MVU) {
    setting = {
      icon: 'ic_home_settings_light',
      selectedIcon: 'ic_home_settings_selected',
      text: 'trans0019',
      name: 'setting',
      url: '/setting/wifi',
      children: [
        {
          text: 'trans0103',
          name: 'wifi',
          url: '/setting/wifi',
          DefaultStrategy
        },
        {
          text: 'trans0142',
          name: 'wan',
          url: '/setting/wan',
          DefaultStrategy: RouterModeStrategy
        },
        {
          text: 'trans0561',
          name: 'safe',
          url: '/setting/safe',
          DefaultStrategy,
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
          DefaultStrategy,
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
        }
      ]
    };
    advance = {
      icon: 'ic_advanced_settings_light',
      selectedIcon: 'ic_advanced_settings_selected',
      text: 'trans0416',
      name: 'advance',
      url: '/advance/portforwarding',
      children: [
        {
          url: '/advance/mode',
          name: 'advance-mode',
          text: 'trans0539',
          DefaultStrategy
        }
      ]
    };
  }
  [setting, advance].forEach(item => {
    // 根据编译客户生成菜单
    item.children.forEach(menu => {
      menu.DefaultStrategy = menu.DefaultStrategy || DefaultStrategy;
      const customers = menu.customers || {};
      const customerConfig = customers[customerId] || {};
      menu.DefaultStrategy = Object.assign(
        {},
        menu.DefaultStrategy,
        customerConfig
      );
    });

    // 过滤不显示的菜单
    item.children = item.children.filter(menu => {
      let { show } = menu.DefaultStrategy;
      // 如果支持多级管理员，判断当前角色是否可以查看菜单
      if (process.env.CUSTOMER_CONFIG.allow2LevelAdmin && show) {
        show = menu.DefaultStrategy.auth.includes(role);
      }
      return show;
    });

    // 根据模式选择对应的菜单项
    item.children.forEach(menu => {
      menu.disabled = false;
      if (!menu.DefaultStrategy.mode.includes(mode)) {
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
        return false;
      });
  });
  console.log([dashboard, setting, advance, upgrade, theme]);
  return [dashboard, setting, advance, upgrade, theme];
}
