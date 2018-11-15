<template>
  <div class="container">
    <m-menu class="menu" :menus="menus" v-if="!menu_hidden"></m-menu>
    <div class="app-container router-view">
      <div class="flex-wrap" :class="{'has-menu':!menu_hidden}">
        <m-header :hasExit="!menu_hidden" class="header" :class="{'has-menu':menu_hidden}"></m-header>
        <router-view></router-view>
        <m-policy :locale="$i18n.locale" :class="{'fix-bottom':menu_hidden}" class="policy" />
      </div>
    </div>
  </div>

</template>
<script>
import './style/common.scss';

export default {
  computed: {
    menu_hidden() {
      return (
        this.$route.path.includes('login') ||
        this.$route.path.includes('wlan') ||
        this.$route.path.includes('unconnect')
      );
    }
  },
  data() {
    return {
      menus: [
        {
          icon: 'wifi',
          text: 'trans0173',
          children: [
            {
              text: 'trans0365',
              name: 'mesh',
              url: '/dashboard/mesh/topo'
            },
            {
              text: 'trans0235',
              name: 'device',
              url: '/dashboard/device'
            },

            {
              text: 'trans0366',
              name: 'internet',
              url: '/dashboard/internet'
            }
          ]
        },
        {
          icon: 'setting',
          text: 'trans0019',
          children: [
            {
              text: 'trans0103',
              name: 'wifi',
              url: '/setting/wifi'
            },
            {
              text: 'trans0142',
              name: 'network',
              url: '/setting/network'
            },
            {
              text: 'trans0297',
              name: 'safe',
              url: '/setting/safe'
            },
            {
              text: 'trans0020',
              name: 'blacklist',
              url: '/setting/blacklist'
            },
            {
              text: 'trans0272',
              name: 'timezone',
              url: '/setting/timezone'
            }
          ]
        },
        {
          icon: 'advance',
          text: 'trans0416',
          children: [
            {
              url: '/advance/portforwarding',
              name: 'advance-portforwarding',
              text: 'trans0422'
            },
            {
              url: '/advance/dhcp',
              name: 'advance-dhcp',
              text: 'trans0417'
            },
            {
              url: '/advance/rsvdip',
              name: 'advance-rsvdip',
              text: 'trans0444'
            },
            {
              url: '/advance/mac',
              name: 'advance-mac',
              text: 'trans0188'
            },
            {
              url: '/advance/ddns',
              name: 'advance-ddns',
              text: 'trans0418'
            },
            {
              url: '/upgrade/online',
              name: 'online',
              text: 'trans0402'
            },
            {
              url: '/advance/diagnosis',
              name: 'advance-diagnosis',
              text: 'trans0419'
            },
            {
              url: '/advance/dmz',
              name: 'advance-dmz',
              text: 'trans0420'
            },
            {
              url: '/advance/log',
              name: 'advance-log',
              text: 'trans0421'
            },
            {
              url: '/advance/firewall',
              name: 'advance-firewall',
              text: 'trans0424'
            }
          ]
        },
        {
          icon: 'upgrade',
          text: 'trans0197',
          children: [
            {
              url: '/upgrade/online',
              name: 'online',
              text: 'trans0202'
            },
            {
              url: '/upgrade/offline',
              name: 'offline',
              text: 'trans0204'
            }
          ]
        }
      ]
    };
  }
};
</script>
<style lang="scss">
.flex-wrap {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}
.container {
  min-height: 100vh;
  position: relative;
  display: flex;
  &.no-menu {
    height: 100%;
  }
  .header {
    width: 100%;
    flex: 0 0 auto;
    &.has-menu {
      background: #fff;
      display: block;
      .logo-container {
        display: inline-block;
      }
    }
  }
  .app-container {
    display: flex;
    flex: 1;
    flex-direction: column;
    position: relative;
  }
  .policy {
    width: 100%;
    text-align: center;
    color: #333;
    &.fix-bottom {
      background: #fff;
    }
  }
}
@media screen and (max-width: 768px) {
  .flex-wrap {
    &.has-menu {
      min-height: calc(100vh - 65px);
    }
  }
  .container {
    flex-direction: column;
    .app-container {
      &.has-menu {
        padding-left: 0;
        height: calc(100% - 65px);
      }
    }
    .header {
      display: none;
    }
    .policy {
      font-size: 12px;
      &.fix-bottom {
        position: static;
      }
    }
  }
}
</style>
