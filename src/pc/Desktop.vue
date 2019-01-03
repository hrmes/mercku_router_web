<template>
  <m-scrollbar class="srcollbar-wrap">
    <div class="container">
      <m-menu class="menu"
              :menus="menus"
              v-if="!menu_hidden"></m-menu>
      <div class="app-container router-view">
        <div class="flex-wrap"
             :class="{'has-menu':!menu_hidden}">
          <m-header :hasExit="!menu_hidden"
                    class="header"
                    :class="{'no-menu':menu_hidden}"></m-header>
          <router-view></router-view>
          <m-policy :locale="$i18n.locale"
                    :class="{'fix-bottom':menu_hidden}"
                    class="policy" />
        </div>
      </div>
    </div>
  </m-scrollbar>

</template>
<script>
import './style/common.scss';
import { Access } from 'util/constant';

export default {
  computed: {
    menu_hidden() {
      return (
        this.$route.path.includes('login')
        || this.$route.path.includes('wlan')
        || this.$route.path.includes('unconnect')
      );
    }
  },
  watch: {
    '$store.state.access': function watcher() {
      this.access = this.$store.state.access;
    },
    access() {
      this.menus = this.getMenus();
    }
  },
  methods: {
    getMenus() {
      const wifi = {
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
            url: '/dashboard/device/1'
          },
          {
            text: 'trans0366',
            name: 'internet',
            url: '/dashboard/internet'
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
          },
          {
            url: '/advance/portforwarding',
            name: 'advance-portforwarding',
            text: 'trans0422',
            super: true
          },

          {
            url: '/advance/rsvdip',
            name: 'advance-rsvdip',
            text: 'trans0444',
            super: true
          },
          {
            url: '/advance/vpn',
            name: 'advance-vpn',
            text: 'trans0402',
            super: true
          },
          {
            url: '/advance/dmz',
            name: 'advance-dmz',
            text: 'trans0420',
            super: true
          },
          {
            url: '/advance/ddns',
            name: 'advance-ddns',
            text: 'trans0418',
            super: true
          }
        ]
      };
      const advance = {
        icon: 'advance',
        text: 'trans0416',
        children: [
          {
            url: '/advance/dhcp',
            name: 'advance-dhcp',
            text: 'trans0417',
            super: false
          },

          {
            url: '/advance/mac',
            name: 'advance-mac',
            text: 'trans0474',
            super: false
          },
          {
            url: '/advance/diagnosis',
            name: 'advance-diagnosis',
            text: 'trans0419'
          },
          {
            url: '/advance/log',
            name: 'advance-log',
            text: 'trans0421',
            super: true
          },
          {
            url: '/advance/firewall',
            name: 'advance-firewall',
            text: 'trans0424',
            super: true
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
            text: 'trans0202'
          },
          {
            url: '/upgrade/offline',
            name: 'offline',
            text: 'trans0204'
          }
        ]
      };
      let menus = [];
      const { access } = this.$store.state;
      if (process.env.CUSTOMER_CONFIG.IS_CIK) {
        if (access === Access.super) {
          advance.children.push({
            url: '/advance/remote/tr069',
            name: 'advance-remote',
            text: 'trans0286'
          });
        } else {
          advance.children = advance.children.filter(a => !a.super);
        }
        menus = [wifi, setting, advance, upgrade];
      } else if (process.env.CUSTOMER_CONFIG.IS_MERCKU) {
        menus = [wifi, setting, advance, upgrade];
      }
      return menus;
    }
  },
  data() {
    return {
      access: this.$store.state.access,
      menus: this.getMenus(),
      scroll: null
    };
  }
};
</script>
<style lang="scss">
.srcollbar-wrap {
  height: 100%;
}
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
    &.no-menu {
      background: #fff;
      display: flex;
      justify-content: space-between;
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
