import { Role, RouterMode, Customers } from 'base/util/constant';
import Http from './http';
import Super from 'base/pages/bussiness/setting/super.vue';

const customerId = process.env.CUSTOMER_CONFIG.id;
const modelId = process.env.MODEL_CONFIG.id;
const pageVersion = process.env.CUSTOMER_CONFIG.version;
const ispName = process.env.CUSTOMER_CONFIG.ispId;

function dashToCamel(dashName) {
  return dashName.split('-').map((word, index) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join('');
}

// default layout。短期内过渡，后续会从后端获取
const layout = {
  super: {
    Super: "hidden",
    Safe: "hidden",
    Schedule: "hidden",
    AdvanceFirewall: "show",
    // ExternalPortForwarding: "hidden",
    Powersupply: "hidden",
  },
  admin: {
    Region: "hidden",
    Ipv6: "hidden",
    Wan: "hidden",
    AdvanceMode: "hidden",
    AdvanceWwa: "hidden",
    AdvanceTr069: "hidden",
    AdvanceMac: "hidden",
    Offline: "hidden",
    Online: "hidden",
    Auto: "hidden",
    Super: "hidden",
    Schedule: "hidden",
    AdvanceFirewall: "show",
    // ExternalPortForwarding: "hidden",
    Powersupply: "hidden",
  }
};

export default function getMenu(role, mode = RouterMode.router, settings = {}) {
  console.log(`version: ${pageVersion}.${ispName}`);
  console.log('Init menus...');
  console.log(`customer id is: ${customerId}`);
  console.log(`model id is: ${modelId}`);
  console.log(`role is: ${role}`);
  console.log(`mode is: ${mode}`);
  settings = layout[role] || {};
  // var settings = {};
  // const http = new Http();
  // Promise.all([http.getSessionProfile()]).then(([res]) => {

  //   console.log('get session profile success', res);
  //   settings = res.data.result["session.profile"]?.layout;
  // }).catch(err => {
  //   console.log('get session profile error', err);
  // });
  // http.getSessionProfile().then(res => {
  //   console.log('get session profile success', res);
  //   settings = res.data.result["session.profile"]?.layout;
  // }).catch(err => {
  //   console.log('get session profile error', err);
  // });
  console.log("settings: ", settings);
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
    icon: 'ic_home_light',
    selectedIcon: 'ic_home_selected',
    text: 'trans0173',
    url: '/dashboard',
    keep: true,
    children: []
  };
  const setting = {
    icon: 'ic_home_settings_light',
    selectedIcon: 'ic_home_settings_selected',
    text: 'trans0019',
    name: 'setting',
    disabled: true,
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
      // {
      //   url: '/setting/led',
      //   name: 'led',
      //   text: 'trans0779',
      //   config
      // },
      {
        url: '/setting/schedule',
        name: 'schedule',
        text: 'trans0962',
        config
      },
      {
        url: '/setting/powersupply',
        name: 'powersupply',
        text: 'trans1239',
        config
      },
      {
        url: '/setting/external-port-forwarding',
        name: 'external-port-forwarding',
        text: 'trans1252',
        config: strategyA
      }
    ]
  };
  const advance = {
    icon: 'ic_advanced_settings_light',
    selectedIcon: 'ic_advanced_settings_selected',
    text: 'trans0416',
    name: 'advance',
    disabled: true,
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
        config
      },
      {
        url: '/advance/diagnosis',
        name: 'advance-diagnosis',
        text: 'trans0419',
        config: strategyA
      },
      // {
      //   url: '/advance/log',
      //   name: 'advance-log',
      //   text: 'trans0421',
      //   config
      // },
      // {
      //   url: '/advance/frozenCofig',
      //   name: 'advance-frozen-cofig',
      //   text: 'trans1186',
      //   config
      // },
      {
        url: '/advance/firewall',
        name: 'advance-firewall',
        text: 'trans0424',
        config: strategyA
      },
      {
        url: '/advance/wwa',
        name: 'advance-wwa',
        text: 'trans0511',
        config: strategyA
      },
      {
        url: '/advance/ssh',
        name: 'advance-ssh',
        text: 'ssh',
        config: strategyA
      },
      {
        url: '/advance/tr069',
        name: 'advance-tr069',
        text: 'trans0499',
        config: {
          show: true,
          auth: [Role.super, Role.admin],
          mode: [RouterMode.router, RouterMode.bridge]
        },
        customers: {
          [Customers.mercku]: {
            show: true
          }
        }
      }
      // {
      //   url: '/advance/telnet',
      //   name: 'advance.telnet',
      //   text: 'trans0497',
      //   config: {
      //     show: false,
      //     auth: [Role.super],
      //     mode: [RouterMode.router]
      //   }
      // }
      // {
      //   url: '/advance/backup',
      //   name: 'advance.backup',
      //   text: 'trans1019',
      //   config
      // }
    ]
  };
  const upgrade = {
    icon: 'ic_upgrade_firmware_light',
    selectedIcon: 'ic_upgrade_firmware_selected',
    text: 'trans0197',
    name: 'upgrade',
    disabled: true,
    url: '/upgrade/online',
    children: [
      {
        url: '/upgrade/offline',
        name: 'offline',
        text: 'trans0204',
        config
      },
      {
        url: '/upgrade/online',
        name: 'online',
        text: 'trans0202',
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
    icon: 'ic_theme_light',
    text: 'trans1119',
    keep: true,
    children: []
  };
  var initMenus = [dashboard, setting, advance, upgrade, theme];
  if (Object.keys(settings).length === 0) {
    initMenus = [dashboard, setting, advance, theme];
  }
  var innerMenus = initMenus.map(item => {
    if (item.name) {
      const camelName = dashToCamel(item.name)
      if (settings[camelName] && settings[camelName] == 'hidden') {
        return null
      }
    }


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

      // 服务端下发数据让其隐藏
      const camelName = dashToCamel(menu.name)
      if (settings[camelName] && settings[camelName] == 'hidden') {
        show = false
      }

      // // 如果支持多级管理员，判断当前角色是否可以查看菜单
      // if (process.env.CUSTOMER_CONFIG.allow2LevelAdmin && show) {
      //   show = menu.config.auth.includes(role);
      // }
      return show;
    });

    // 根据子是否有子级菜单，来判断是否需要 disable 父级菜单
    if (item.children && item.children.length > 0) {
      item.disabled = false;
    }

    // 根据模式选择对应的菜单项
    item.children.forEach(menu => {
      // menu.disabled = false;
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

    return item
  }).filter(Boolean);

  // const menu = innerMenus;

  const menu = innerMenus.filter(item => {
    if (item?.keep) {
      return true;
    }
    if (item?.disabled) {
      return false;
    }
    console.log("item:", item)
    var hasValidChildren = item?.children.some(child => {
      console.log("child enabled?: ", child.name, !child.disabled, child);
      return !child.disabled;
    });
    console.log("item has valid children:", item.name, hasValidChildren)
    return hasValidChildren;
  });

  console.log("menu:", menu);
  return menu;
}
