import { Role, RouterMode, Customers } from '@/util/constant';

export default function getMenu(role, mode = RouterMode.router) {
  console.log('Init menus...');
  console.log(`customer id is: ${process.env.CUSTOMER_CONFIG.id}`);
  console.log(`role is: ${role}`);
  console.log(`mode is: ${mode}`);

  const allCustomers = Object.keys(Customers).map(key => Customers[key]);
  const wifi = {
    icon: 'wifi',
    text: 'trans0173',
    children: [
      {
        text: 'trans0365',
        name: 'mesh',
        url: '/dashboard/mesh/topo',
        super: false,
        mode: [RouterMode.router, RouterMode.bridge],
        customers: allCustomers
      },
      {
        text: 'trans0235',
        name: 'device',
        url: '/dashboard/device/primary',
        super: false,
        mode: [RouterMode.router],
        customers: allCustomers
      },
      {
        text: 'trans0366',
        name: 'internet',
        url: '/dashboard/internet',
        super: false,
        mode: [RouterMode.router, RouterMode.bridge],
        customers: allCustomers
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
        super: false,
        mode: [RouterMode.router, RouterMode.bridge],
        customers: allCustomers
      },
      {
        text: 'trans0142',
        name: 'wan',
        url: '/setting/wan',
        super: false,
        mode: [RouterMode.router],
        customers: allCustomers
      },
      {
        text: 'trans0620',
        name: 'ipv6',
        url: '/setting/ipv6',
        super: false,
        mode: [RouterMode.router],
        customers: [
          Customers.cik,
          Customers.mercku,
          Customers.internal,
          Customers.startca,
          Customers.inverto,
          Customers.orion
        ]
      },
      {
        text: 'trans0561',
        name: 'safe',
        url: '/setting/safe',
        super: false,
        mode: [RouterMode.router, RouterMode.bridge],
        customers: allCustomers
      },
      {
        text: 'trans0020',
        name: 'blacklist',
        url: '/setting/blacklist',
        super: false,
        mode: [RouterMode.router],
        customers: allCustomers
      },
      {
        text: 'trans0272',
        name: 'timezone',
        url: '/setting/timezone',
        super: false,
        mode: [RouterMode.router],
        customers: allCustomers
      },
      {
        text: 'trans0639',
        name: 'region',
        url: '/setting/region',
        super: false,
        mode: [RouterMode.router, RouterMode.bridge],
        customers: allCustomers
      },
      {
        url: '/setting/guest',
        name: 'guest',
        text: 'trans0538',
        super: false,
        mode: [RouterMode.router],
        customers: allCustomers
      },
      {
        url: '/setting/upnp',
        name: 'upnp',
        text: 'trans0644',
        super: false,
        mode: [RouterMode.router],
        customers: allCustomers
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
        super: false,
        mode: [RouterMode.router],
        customers: allCustomers
      },
      {
        url: '/advance/dmz',
        name: 'advance-dmz',
        text: 'trans0420',
        super: false,
        mode: [RouterMode.router],
        customers: allCustomers
      },
      {
        url: '/advance/dhcp',
        name: 'advance-dhcp',
        text: 'trans0417',
        super: false,
        mode: [RouterMode.router],
        customers: allCustomers
      },
      {
        url: '/advance/rsvdip',
        name: 'advance-rsvdip',
        text: 'trans0444',
        super: false,
        mode: [RouterMode.router],
        customers: allCustomers
      },
      {
        url: '/advance/mac',
        name: 'advance-mac',
        text: 'trans0474',
        super: false,
        mode: [RouterMode.router],
        customers: allCustomers
      },
      {
        url: '/advance/ddns',
        name: 'advance-ddns',
        text: 'trans0418',
        super: false,
        mode: [RouterMode.router],
        customers: allCustomers
      },
      {
        url: '/advance/vpn',
        name: 'advance-vpn',
        text: 'trans0402',
        super: false,
        mode: [RouterMode.router],
        customers: allCustomers
      },
      {
        url: '/advance/mode',
        name: 'advance-mode',
        text: 'trans0539',
        super: false,
        mode: [RouterMode.router, RouterMode.bridge],
        customers: [
          Customers.mercku,
          Customers.inverto,
          Customers.orion,
          Customers.realnett,
          Customers.internal
        ]
      },
      {
        url: '/advance/diagnosis',
        name: 'advance-diagnosis',
        text: 'trans0419',
        super: false,
        mode: [RouterMode.router],
        customers: allCustomers
      },
      {
        url: '/advance/log',
        name: 'advance-log',
        text: 'trans0421',
        super: true,
        mode: [RouterMode.router],
        customers: allCustomers
      },
      {
        url: '/advance/firewall',
        name: 'advance-firewall',
        text: 'trans0424',
        super: true,
        mode: [RouterMode.router],
        customers: allCustomers
      },
      {
        url: '/advance/wwa',
        name: 'advance.wwa',
        text: 'trans0511',
        mode: [RouterMode.router],
        super: false,
        customers: [
          Customers.internal,
          Customers.cik,
          Customers.inverto,
          Customers.startca,
          Customers.orion
        ]
      },
      {
        url: '/advance/remote/tr069',
        name: 'advance-remote',
        text: 'trans0286',
        mode: [RouterMode.router],
        super: true,
        customers: [
          Customers.cik,
          Customers.internal,
          Customers.startca,
          Customers.inverto,
          Customers.orion
        ]
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
        mode: [RouterMode.router, RouterMode.bridge],
        customers: allCustomers
      },
      {
        url: '/upgrade/offline',
        name: 'offline',
        text: 'trans0204',
        mode: [RouterMode.router, RouterMode.bridge],
        customers: allCustomers
      }
    ]
  };

  [wifi, setting, advance, upgrade].forEach(item => {
    // 根据id选择对应的菜单项
    const filter = c => c.customers.includes(process.env.CUSTOMER_CONFIG.id);
    item.children = item.children.filter(filter);

    // 如果支持多级管理员，根据角色过滤选择对应的菜单项
    if (process.env.CUSTOMER_CONFIG.allow2LevelAdmin && role !== Role.super) {
      item.children = item.children.filter(a => !a.super);
    }

    // 根据模式选择对应的菜单项
    item.children.forEach(c => {
      c.disabled = false;
      if (!c.mode.includes(mode)) {
        c.disabled = true;
      }
    });
  });
  return [wifi, setting, advance, upgrade];
}
