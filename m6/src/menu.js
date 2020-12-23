import { Role, RouterMode, Customers } from '@/util/constant';

export default function getMenu(role, mode = RouterMode.router) {
  console.log('Init menus...');
  console.log(`customer id is: ${process.env.CUSTOMER_CONFIG.id}`);
  console.log(`role is: ${role}`);
  console.log(`mode is: ${mode}`);

  const allCustomers = Object.keys(Customers).map(key => Customers[key]);
  // 默认客户配置
  const defaultCustomerConfig = {
    auth: [Role.admin],
    mode: [RouterMode.router, RouterMode.bridge]
  };
  const wifi = {
    icon: 'wifi',
    text: 'trans0173',
    children: [
      {
        text: 'trans0365',
        name: 'mesh',
        url: '/dashboard/mesh/topo',
        customersConfig: defaultCustomerConfig
        // super: false,
        // mode: [RouterMode.router, RouterMode.bridge],
        // customers: allCustomers
      },
      {
        text: 'trans0235',
        name: 'device',
        url: '/dashboard/device/primary',
        customersConfig: {
          auth: [Role.admin],
          mode: [RouterMode.router]
        }
        // super: false,
        // mode: [RouterMode.router],
        // customers: allCustomers
      },
      {
        text: 'trans0366',
        name: 'internet',
        url: '/dashboard/internet',
        customersConfig: defaultCustomerConfig
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
        customersConfig: defaultCustomerConfig
        // super: false,
        // mode: [RouterMode.router, RouterMode.bridge],
        // customers: allCustomers
      },
      {
        text: 'trans0142',
        name: 'wan',
        url: '/setting/wan',
        customersConfig: {
          auth: [Role.admin],
          mode: [RouterMode.router]
        }
        // super: false,
        // mode: [RouterMode.router],
        // customers: allCustomers
      },
      {
        text: 'trans0561',
        name: 'safe',
        url: '/setting/safe',
        customersConfig: defaultCustomerConfig
        // super: false,
        // mode: [RouterMode.router, RouterMode.bridge],
        // customers: allCustomers
      },
      {
        url: '/setting/super',
        name: 'guest',
        text: 'trans0576',
        customers: {
          [Customers.cik]: defaultCustomerConfig,
          [Customers.internal]: defaultCustomerConfig,
          [Customers.startca]: defaultCustomerConfig,
          [Customers.inverto]: defaultCustomerConfig,
          [Customers.orion]: defaultCustomerConfig
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
        customersConfig: {
          auth: [Role.admin],
          mode: [RouterMode.router]
        }
        // super: false,
        // mode: [RouterMode.router],
        // customers: allCustomers
      },
      {
        text: 'trans0272',
        name: 'timezone',
        url: '/setting/timezone',
        customersConfig: {
          auth: [Role.admin],
          mode: [RouterMode.router]
        }
        // super: false,
        // mode: [RouterMode.router],
        // customers: allCustomers
      },
      {
        text: 'trans0639',
        name: 'region',
        url: '/setting/region',
        customersConfig: defaultCustomerConfig
        // super: false,
        // mode: [RouterMode.router, RouterMode.bridge],
        // customers: allCustomers
      },
      {
        url: '/setting/guest',
        name: 'guest',
        text: 'trans0538',
        customersConfig: {
          auth: [Role.admin],
          mode: [RouterMode.router]
        }
        // super: false,
        // mode: [RouterMode.router],
        // customers: allCustomers
      },

      {
        url: '/setting/upnp',
        name: 'upnp',
        text: 'trans0644',
        customersConfig: {
          auth: [Role.admin],
          mode: [RouterMode.router]
        }
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
        customersConfig: {
          auth: [Role.admin],
          mode: [RouterMode.router]
        }
        // super: false,
        // mode: [RouterMode.router],
        // customers: allCustomers
      },
      {
        url: '/advance/dmz',
        name: 'advance-dmz',
        text: 'trans0420',
        customersConfig: {
          auth: [Role.admin],
          mode: [RouterMode.router]
        }
        // super: false,
        // mode: [RouterMode.router],
        // customers: allCustomers
      },
      {
        url: '/advance/dhcp',
        name: 'advance-dhcp',
        text: 'trans0417',
        customersConfig: {
          auth: [Role.admin],
          mode: [RouterMode.router]
        }
        // super: false,
        // mode: [RouterMode.router],
        // customers: allCustomers
      },
      {
        url: '/advance/rsvdip',
        name: 'advance-rsvdip',
        text: 'trans0444',
        customersConfig: {
          auth: [Role.admin],
          mode: [RouterMode.router]
        }
        // super: false,
        // mode: [RouterMode.router],
        // customers: allCustomers
      },
      {
        url: '/advance/mac',
        name: 'advance-mac',
        text: 'trans0474',
        customersConfig: {
          auth: [Role.admin],
          mode: [RouterMode.router]
        }
        // super: false,
        // mode: [RouterMode.router],
        // customers: allCustomers
      },
      {
        url: '/advance/ddns',
        name: 'advance-ddns',
        text: 'trans0418',
        customersConfig: {
          auth: [Role.admin],
          mode: [RouterMode.router]
        }
        // super: false,
        // mode: [RouterMode.router],
        // customers: allCustomers
      },
      {
        url: '/advance/vpn',
        name: 'advance-vpn',
        text: 'trans0402',
        customersConfig: {
          auth: [Role.admin],
          mode: [RouterMode.router]
        }
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
        customersConfig: {
          auth: [Role.admin],
          mode: [RouterMode.router]
        }
        // super: false,
        // mode: [RouterMode.router],
        // customers: allCustomers
      },
      {
        url: '/advance/log',
        name: 'advance-log',
        text: 'trans0421',
        customersConfig: {
          auth: [Role.admin],
          mode: [RouterMode.router]
        }
        // super: true,
        // mode: [RouterMode.router],
        // customers: allCustomers
      },
      {
        url: '/advance/firewall',
        name: 'advance-firewall',
        text: 'trans0424',
        customersConfig: {
          auth: [Role.admin],
          mode: [RouterMode.router]
        }
        // super: true,
        // mode: [RouterMode.router],
        // customers: allCustomers
      },
      {
        url: '/advance/wwa',
        name: 'advance.wwa',
        text: 'trans0511',
        customersConfig: {
          auth: [Role.admin],
          mode: [RouterMode.router]
        },
        customers: {
          [Customers.realnett]: {
            auth: [Role.super],
            mode: [RouterMode.router]
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
        customers: {
          [Customers.cik]: {
            auth: [Role.admin],
            mode: [RouterMode.router]
          },
          [Customers.internal]: {
            auth: [Role.admin],
            mode: [RouterMode.router]
          },
          [Customers.startca]: {
            auth: [Role.admin],
            mode: [RouterMode.router]
          },
          [Customers.orion]: {
            auth: [Role.admin],
            mode: [RouterMode.router]
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
        customersConfig: defaultCustomerConfig
        // mode: [RouterMode.router, RouterMode.bridge],
        // customers: allCustomers
      },
      {
        url: '/upgrade/offline',
        name: 'offline',
        text: 'trans0204',
        customersConfig: defaultCustomerConfig
        // mode: [RouterMode.router, RouterMode.bridge],
        // customers: allCustomers
      },
      {
        url: '/upgrade/auto',
        name: 'auto',
        text: 'trans0743',
        customersConfig: defaultCustomerConfig
        // mode: [RouterMode.router, RouterMode.bridge],
        // customers: allCustomers
      }
    ]
  };
  [wifi, setting, advance, upgrade].forEach(item => {
    // 构造菜单项的客户列表
    item.children.map(menu => {
      // customersConfig：指“默认配置”，每个菜单项只需要配置一次，所有客户基于它生成当前菜单项的配置。
      // customers：指“客户自定义配置”，可以配置多个
      // customersConfig与customers必须配置一个
      // 存在customersConfig但不存在customers，所有客户基于customersConfig生成的配置
      // 存在customers但不存在customersConfig，使用customers
      // customersConfig与customers都存在，用customers部分替换基于customersConfig生成的配置

      if (menu.customersConfig && !menu.customers) {
        menu.customers = {};
        const { customersConfig } = menu;
        allCustomers.forEach(val => {
          menu.customers[val] = customersConfig;
        });
        delete menu.customersConfig;
      } else if (menu.customersConfig && menu.customers) {
        const customers = Object.assign({}, menu.customers);
        const customersKeyList = Object.keys(customers);
        const { customersConfig } = menu;
        allCustomers.forEach(val => {
          customersKeyList.forEach(cVal => {
            if (cVal === val) {
              menu.customers[val] = customers[cVal];
            } else {
              menu.customers[val] = customersConfig;
            }
          });
        });
        delete menu.customersConfig;
      }
    });

    // 根据id选择对应的菜单项
    const filter = menu => {
      const { customers } = menu;
      const menuCustomers = Object.keys(customers);
      const nowCustomer = menuCustomers.find(
        val => val === process.env.CUSTOMER_CONFIG.id
      );
      menu.customers = {
        [nowCustomer]: customers[nowCustomer]
      };
      return menuCustomers.includes(process.env.CUSTOMER_CONFIG.id);
    };
    item.children = item.children.filter(filter);

    // 如果支持多级管理员，根据角色过滤选择对应的菜单项
    if (process.env.CUSTOMER_CONFIG.allow2LevelAdmin && role !== Role.super) {
      const filterAuth = menu => {
        const { customers } = menu;
        return customers[process.env.CUSTOMER_CONFIG.id].auth[0] === Role.admin;
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
