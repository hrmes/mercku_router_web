import { Role, RouterMode } from 'util/constant';

export default function getMenu(role, mode = RouterMode.router) {
  console.log(`Init menus...role is:${role}...mode is:${mode}`);
  const wifi = {
    icon: 'wifi',
    text: 'trans0173',
    children: [
      {
        text: 'trans0365',
        name: 'mesh',
        url: '/dashboard/mesh/topo',
        mode: ['router', 'bridge']
      },
      {
        text: 'trans0235',
        name: 'device',
        url: '/dashboard/device/primary',
        mode: ['router']
      },
      {
        text: 'trans0366',
        name: 'internet',
        url: '/dashboard/internet',
        mode: ['router', 'bridge']
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
        mode: ['router', 'bridge']
      },
      {
        text: 'trans0142',
        name: 'wan',
        url: '/setting/wan',
        mode: ['router']
      },
      {
        text: 'trans0561',
        name: 'safe',
        url: '/setting/safe',
        mode: ['router', 'bridge']
      },
      {
        text: 'trans0020',
        name: 'blacklist',
        url: '/setting/blacklist',
        mode: ['router']
      },
      {
        text: 'trans0272',
        name: 'timezone',
        url: '/setting/timezone',
        mode: ['router']
      },
      {
        url: '/setting/guest',
        name: 'guest',
        text: 'trans0538',
        mode: ['router']
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
        mode: ['router']
      },
      {
        url: '/advance/dmz',
        name: 'advance-dmz',
        text: 'trans0420',
        super: false,
        mode: ['router']
      },
      {
        url: '/advance/dhcp',
        name: 'advance-dhcp',
        text: 'trans0417',
        super: false,
        mode: ['router']
      },
      {
        url: '/advance/rsvdip',
        name: 'advance-rsvdip',
        text: 'trans0444',
        super: false,
        mode: ['router']
      },
      {
        url: '/advance/mac',
        name: 'advance-mac',
        text: 'trans0474',
        super: false,
        mode: ['router']
      },
      {
        url: '/advance/ddns',
        name: 'advance-ddns',
        text: 'trans0418',
        super: false,
        mode: ['router']
      },
      {
        url: '/advance/vpn',
        name: 'advance-vpn',
        text: 'trans0402',
        super: false,
        mode: ['router']
      },
      {
        url: '/advance/mode',
        name: 'advance-mode',
        text: 'trans0539',
        super: false,
        mode: ['router', 'bridge']
      },
      {
        url: '/advance/diagnosis',
        name: 'advance-diagnosis',
        text: 'trans0419',
        super: false,
        mode: ['router']
      },
      {
        url: '/advance/log',
        name: 'advance-log',
        text: 'trans0421',
        super: true,
        mode: ['router']
      },
      {
        url: '/advance/firewall',
        name: 'advance-firewall',
        text: 'trans0424',
        super: true,
        mode: ['router']
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
        mode: ['router', 'bridge']
      },
      {
        url: '/upgrade/offline',
        name: 'offline',
        text: 'trans0204',
        mode: ['router', 'bridge']
      }
    ]
  };
  const tr069 = {
    url: '/advance/remote/tr069',
    name: 'advance-remote',
    text: 'trans0286',
    mode: ['router'],
    super: true
  };

  [wifi, setting, advance, upgrade].forEach(item => {
    item.children.forEach(c => {
      c.disabled = false;
      if (!c.mode.includes(mode)) {
        c.disabled = true;
      }
    });
  });

  let menus = [];
  if (process.env.CUSTOMER_CONFIG.isCik) {
    if (role === Role.super) {
      advance.children.push(tr069);
    } else {
      advance.children = advance.children.filter(a => !a.super);
    }
    menus = [wifi, setting, advance, upgrade];
  } else if (process.env.CUSTOMER_CONFIG.isMercku) {
    menus = [wifi, setting, advance, upgrade];
  }
  return menus;
}
