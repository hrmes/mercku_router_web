import { Role, RouterMode } from 'base/util/constant';

const customerId = process.env.CUSTOMER_CONFIG.id;
const modelId = process.env.MODEL_CONFIG.id;

export default function getMenu(role, mode = RouterMode.bridge) {
  console.log('Init menus...');
  console.log(`customer id is: ${customerId}`);
  console.log(`model Id is: ${modelId}`);
  console.log(`role is: ${role}`);
  console.log(`mode is: ${mode}`);

  // homeway菜单默认配置
  const config = {
    show: true,
    auth: [Role.admin, Role.super]
    // modelId: [Models.homeway_230v, Models.homeway_POE1, Models.homeway_POE2]
  };

  const wifi = {
    icon: 'wifi',
    text: 'trans0173',
    children: [
      {
        text: 'trans1087',
        name: 'mesh',
        url: '/dashboard/mesh/table',
        config
      },
      {
        text: 'trans0235',
        name: 'device',
        url: '/dashboard/device/primary',
        config
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
        text: 'trans1094',
        name: 'fan',
        url: '/setting/fan',
        config
      },
      {
        text: 'trans0561',
        name: 'safe',
        url: '/setting/safe',
        config
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
        text: 'trans0538',
        name: 'guest',
        url: '/setting/guest',
        config
      },
      {
        url: '/setting/led',
        name: 'led',
        text: 'trans0779',
        config
      },
      {
        url: '/setting/childLock',
        name: 'childLock',
        text: 'trans1061',
        config
      },
      {
        text: 'trans0962',
        name: 'schedule',
        url: '/setting/schedule',
        config
      }
      // {
      //   text: 'trans0620',
      //   name: 'ipv6',
      //   url: '/setting/ipv6',
      //   config
      // }
    ]
  };
  const advance = {
    icon: 'advance',
    text: 'trans0416',
    children: [
      {
        url: '/advance/mode',
        name: 'advance-mode',
        text: 'trans0539',
        config
      },
      {
        url: '/advance/log',
        name: 'advance-log',
        text: 'trans0421',
        config
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
      // const hiddenModelObj = menu.hiddenModelObj || {};
      // const hiddenConfig = hiddenModelObj[modelId] || {};
      // menu.config = Object.assign({}, menu.config, hiddenConfig);
      menu.config = Object.assign({}, menu.config);
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
  });

  return [wifi, setting, advance, upgrade];
}
