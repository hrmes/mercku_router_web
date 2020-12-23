import { Role, RouterMode, Customers } from '@/util/constant';

const customerId = process.env.CUSTOMER_CONFIG.id;
export default function getMenu(role, mode = RouterMode.router) {
  console.log('Init menus...');
  console.log(`customer id is: ${process.env.CUSTOMER_CONFIG.id}`);
  console.log(`role is: ${role}`);
  console.log(`mode is: ${mode}`);

  const allCustomers = Object.keys(Customers).map(key => Customers[key]);
  // 默认客户配置
  const defaultCustomerConfig = {
    show: true,
    auth: [Role.admin],
    mode: [RouterMode.router, RouterMode.bridge]
  };
  const routerModeCustomerConfig = {
    show: true,
    auth: [Role.admin],
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
        defaultCustomerConfig
        // super: false,
        // mode: [RouterMode.router, RouterMode.bridge],
        // customers: allCustomers
      },
      {
        text: 'trans0235',
        name: 'device',
        url: '/dashboard/device/primary',
        defaultCustomerConfig: routerModeCustomerConfig
        // super: false,
        // mode: [RouterMode.router],
        // customers: allCustomers
      },
      {
        text: 'trans0366',
        name: 'internet',
        url: '/dashboard/internet',
        defaultCustomerConfig
        // super: false,
        // mode: [RouterMode.router, RouterMode.bridge],
        // customers: allCustomers
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
        defaultCustomerConfig
        // super: false,
        // mode: [RouterMode.router, RouterMode.bridge],
        // customers: allCustomers
      },
      {
        text: 'trans0142',
        name: 'wan',
        url: '/setting/wan',
        defaultCustomerConfig: routerModeCustomerConfig
        // super: false,
        // mode: [RouterMode.router],
        // customers: allCustomers
      },
      {
        text: 'trans0561',
        name: 'safe',
        url: '/setting/safe',
        defaultCustomerConfig
        // super: false,
        // mode: [RouterMode.router, RouterMode.bridge],
        // customers: allCustomers
      },
      {
        url: '/setting/super',
        name: 'guest',
        text: 'trans0576',
        defaultCustomerConfig,
        customers: {
          [Customers.mercku]: {
            show: false
          },
          [Customers.realnett]: {
            show: false
          }
        }
        // super: false,
        // mode: [RouterMode.router, RouterMode.bridge],
        // customers: [
        //   Customers.cik,
        //   Customers.internal,
        //   Customers.startca,
        //   Customers.inverto,
        //   Customers.orion
        // ]
      },
      {
        text: 'trans0020',
        name: 'blacklist',
        url: '/setting/blacklist',
        defaultCustomerConfig: routerModeCustomerConfig
        // super: false,
        // mode: [RouterMode.router],
        // customers: allCustomers
      },
      {
        text: 'trans0272',
        name: 'timezone',
        url: '/setting/timezone',
        defaultCustomerConfig: routerModeCustomerConfig
        // super: false,
        // mode: [RouterMode.router],
        // customers: allCustomers
      },
      {
        text: 'trans0639',
        name: 'region',
        url: '/setting/region',
        defaultCustomerConfig
        // super: false,
        // mode: [RouterMode.router, RouterMode.bridge],
        // customers: allCustomers
      },
      {
        url: '/setting/guest',
        name: 'guest',
        text: 'trans0538',
        defaultCustomerConfig: routerModeCustomerConfig
        // super: false,
        // mode: [RouterMode.router],
        // customers: allCustomers
      },

      {
        url: '/setting/upnp',
        name: 'upnp',
        text: 'trans0644',
        defaultCustomerConfig: routerModeCustomerConfig
        // super: false,
        // mode: [RouterMode.router],
        // customers: allCustomers
      }
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
        defaultCustomerConfig: routerModeCustomerConfig
        // super: false,
        // mode: [RouterMode.router],
        // customers: allCustomers
      },
      {
        url: '/advance/dmz',
        name: 'advance-dmz',
        text: 'trans0420',
        defaultCustomerConfig: routerModeCustomerConfig
        // super: false,
        // mode: [RouterMode.router],
        // customers: allCustomers
      },
      {
        url: '/advance/dhcp',
        name: 'advance-dhcp',
        text: 'trans0417',
        defaultCustomerConfig: routerModeCustomerConfig
        // super: false,
        // mode: [RouterMode.router],
        // customers: allCustomers
      },
      {
        url: '/advance/rsvdip',
        name: 'advance-rsvdip',
        text: 'trans0444',
        defaultCustomerConfig: routerModeCustomerConfig
        // super: false,
        // mode: [RouterMode.router],
        // customers: allCustomers
      },
      {
        url: '/advance/mac',
        name: 'advance-mac',
        text: 'trans0474',
        defaultCustomerConfig: routerModeCustomerConfig
        // super: false,
        // mode: [RouterMode.router],
        // customers: allCustomers
      },
      {
        url: '/advance/ddns',
        name: 'advance-ddns',
        text: 'trans0418',
        defaultCustomerConfig: routerModeCustomerConfig
        // super: false,
        // mode: [RouterMode.router],
        // customers: allCustomers
      },
      {
        url: '/advance/vpn',
        name: 'advance-vpn',
        text: 'trans0402',
        defaultCustomerConfig: routerModeCustomerConfig
        // super: false,
        // mode: [RouterMode.router],
        // customers: allCustomers
      },
      {
        url: '/advance/mode',
        name: 'advance-mode',
        text: 'trans0539',
        customers: {
          [Customers.mercku]: defaultCustomerConfig,
          [Customers.inverto]: defaultCustomerConfig,
          [Customers.orion]: defaultCustomerConfig
        }
        // super: false,
        // mode: [RouterMode.router, RouterMode.bridge],
        // customers: [Customers.mercku, Customers.inverto, Customers.orion]
      },
      {
        url: '/advance/diagnosis',
        name: 'advance-diagnosis',
        text: 'trans0419',
        defaultCustomerConfig: routerModeCustomerConfig
        // super: false,
        // mode: [RouterMode.router],
        // customers: allCustomers
      },
      {
        url: '/advance/log',
        name: 'advance-log',
        text: 'trans0421',
        defaultCustomerConfig: routerModeCustomerConfig
        // super: true,
        // mode: [RouterMode.router],
        // customers: allCustomers
      },
      {
        url: '/advance/firewall',
        name: 'advance-firewall',
        text: 'trans0424',
        defaultCustomerConfig: routerModeCustomerConfig
        // super: true,
        // mode: [RouterMode.router],
        // customers: allCustomers
      },
      {
        url: '/advance/wwa',
        name: 'advance.wwa',
        text: 'trans0511',
        defaultCustomerConfig: routerModeCustomerConfig,
        customers: {
          [Customers.realnett]: {
            auth: [Role.super]
          }
        }
        // super: false,
        // mode: [RouterMode.router],
        // customers: allCustomers
      },
      {
        url: '/advance/remote/tr069',
        name: 'advance-remote',
        text: 'trans0286',
        defaultCustomerConfig,
        customers: {
          [Customers.mercku]: {
            show: false
          },
          [Customers.inverto]: {
            show: false
          },
          [Customers.realnett]: {
            show: false
          }
        }
        // mode: [RouterMode.router],
        // super: true,
        // customers: [
        //   Customers.cik,
        //   Customers.internal,
        //   Customers.startca,
        //   Customers.inverto,
        //   Customers.orion
        // ]
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
        defaultCustomerConfig
        // mode: [RouterMode.router, RouterMode.bridge],
        // customers: allCustomers
      },
      {
        url: '/upgrade/offline',
        name: 'offline',
        text: 'trans0204',
        defaultCustomerConfig
        // mode: [RouterMode.router, RouterMode.bridge],
        // customers: allCustomers
      },
      {
        url: '/upgrade/auto',
        name: 'auto',
        text: 'trans0743',
        defaultCustomerConfig
        // mode: [RouterMode.router, RouterMode.bridge],
        // customers: allCustomers
      }
    ]
  };
  [wifi, setting, advance, upgrade].forEach(item => {
    // 构造菜单项的客户列表
    item.children.map(menu => {
      // defaultCustomerConfig：指“默认配置”，每个菜单项只需要配置一次，所有客户基于它生成当前菜单项的配置。
      // customers：指“客户自定义配置”，可以配置多个
      // defaultCustomerConfig与customers必须配置一个
      // 存在defaultCustomerConfig但不存在customers，所有客户基于defaultCustomerConfig生成的配置
      // 存在customers但不存在defaultCustomerConfig，使用customers
      // defaultCustomerConfig与customers都存在，用customers部分替换基于defaultCustomerConfig生成的配置
      if (menu.defaultCustomerConfig) {
        const customerConfig = menu.defaultCustomerConfig;
        if (menu.customers) {
          menu.customers[customerId] = {
            ...customerConfig,
            ...menu.customers[customerId]
          };
        } else {
          menu.customers = {};
          menu.customers[customerId] = customerConfig;
        }
        delete menu.defaultCustomerConfig;
      } else if (menu.customers) {
        menu.customers[customerId] = {
          ...menu.customers[customerId]
        };
      }
    });
    // 根据id与show选择对应的菜单项
    const filter = menu => menu.customers[customerId].show;
    item.children = item.children.filter(filter);

    // 如果支持多级管理员，根据角色过滤选择对应的菜单项
    if (process.env.CUSTOMER_CONFIG.allow2LevelAdmin && role !== Role.super) {
      const filterAuth = menu => {
        const { customers } = menu;
        return customers[process.env.CUSTOMER_CONFIG.id].auth.includes(
          Role.admin
        );
      };
      item.children = item.children.filter(filterAuth);
    }

    // 根据模式选择对应的菜单项
    item.children.forEach(child => {
      child.disabled = false;
      const { customers } = child;
      const menuCustomers = Object.keys(customers);
      menuCustomers.forEach(val => {
        if (!customers[val].mode.includes(mode)) {
          child.disabled = true;
        }
      });
    });
  });

  return [wifi, setting, advance, upgrade];
}
