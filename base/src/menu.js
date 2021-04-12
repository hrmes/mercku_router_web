import { Role, RouterMode, Customers } from './util/constant';

const customerId = process.env.CUSTOMER_CONFIG.id;
export default function getMenu(role, mode = RouterMode.router) {
  console.log('Init menus...');
  console.log(`customer id is: ${customerId}`);
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
  const wifi = {
    icon: 'wifi',
    text: 'trans0173',
    children: [
      {
        text: 'trans0365',
        name: 'mesh',
        url: '/dashboard/mesh/topo',
        config
      },
      {
        text: 'trans0235',
        name: 'device',
        url: '/dashboard/device/primary',
        config: strategyA
      },
      {
        text: 'trans0366',
        name: 'internet',
        url: '/dashboard/internet',
        config
      }
    ]
  };
  const setting = {
    icon: 'setting',
    text: 'trans0019',
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
        config
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
      {
        url: '/setting/led',
        name: 'setting.led',
        text: 'trans0779',
        config
      }
      // {
      //   url: '/setting/wps',
      //   name: 'setting.wps',
      //   text: 'trans0794',
      //   config
      // }
    ]
  };
  const advance = {
    icon: 'advance',
    text: 'trans0416',
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
        super: false,
        config: strategyA
      },
      {
        url: '/advance/log',
        name: 'advance-log',
        text: 'trans0421',
        config: strategyA
      },
      {
        url: '/advance/firewall',
        name: 'advance-firewall',
        text: 'trans0424',
        config: strategyA
      },
      {
        url: '/advance/wwa',
        name: 'advance.wwa',
        text: 'trans0511',
        config: strategyA,
        customers: {
          [Customers.altima]: {
            show: false
          },
          [Customers.realnett]: {
            auth: [Role.super]
          }
        }
      },
      {
        url: '/advance/remote/tr069',
        name: 'advance-remote',
        text: 'trans0286',
        config: {
          show: true,
          auth: [Role.super],
          mode: [RouterMode.router]
        },
        customers: {
          [Customers.mercku]: {
            show: false
          },
          [Customers.realnett]: {
            show: false
          },
          [Customers.altima]: {
            show: false
          }
        }
      }
    ]
  };
  const upgrade = {
    icon: 'upgrade',
    text: 'trans0197',
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

  [wifi, setting, advance, upgrade].forEach(item => {
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
  });
  return [wifi, setting, advance, upgrade];
}
