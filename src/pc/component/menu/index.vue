<template>
  <div class="menu-container" :class="{'small-device-expand':showMenu}">
    <div class="menu-top">
      <div class="logo-container">
        <div class="logo"></div>
      </div>
      <div class="small-device">
        <span @click="changeLang()" class="menu-icon language" :class="[$i18n.locale]"></span>
        <span class="menu-icon menu" @click="show()"></span>
      </div>
    </div>
    <ul class="menu" :class="{'show':showMenu}">
      <li class="menu-item" :key="menu.key" @click="jump(menu)" v-for="menu in list" :class="{'selected':$route.name.includes(menu.name)}">
        <span class="menu-icon" :class="[menu.icon]"></span>
        <span class="menu-text">{{$t(menu.text)}}</span>
        <span v-if="menu.children" class="menu-trigle" :class="{'menu-expand':!menu.expand,'menu-collapse':menu.expand}"></span>
        <ul v-if="menu.children" class="menu-children" :class="{'show':menu.expand}">
          <li class="menu-child" :key="child.key" @click.stop="jump(child)" v-for="child in menu.children" :class="{'selected':$route.name.includes(child.name)}">
            <span class="menu-icon"></span>
            <span class="menu-text">{{$t(child.text)}}</span>
          </li>
        </ul>
      </li>
      <li class="menu-item exit" @click="exit()">
        <span class="menu-icon exit"></span>
        <span class="menu-text">{{$t('trans0021')}}</span>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    menus: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      current: null,
      showMenu: false,
      list: []
    };
  },
  methods: {
    jump(menu) {
      if (!menu.url && menu.children) {
        this.list.forEach(l => {
          if (!l.url && l.children && menu !== l) {
            l.expand = false;
          }
        });
        menu.expand = !menu.expand;
      } else {
        this.$router.push({
          path: menu.url
        });
        this.current = menu;
        this.showMenu = false;
        document.body.style.overflow = 'auto';
      }
    },
    changeLang() {
      const zh = 'zh-CN';
      const en = 'en-US';
      this.changeLanguage(this.$i18n.locale === en ? zh : en);
    },
    show() {
      this.showMenu = !this.showMenu;
      if (this.showMenu) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
    },
    exit() {
      this.$dialog.confirm({
        okText: this.$t('trans0024'),
        cancelText: this.$t('trans0025'),
        message: this.$t('trans0323'),
        callback: {
          ok: () => {
            this.$http.loginout().then(() => {
              this.$router.replace({ path: '/login' });
            });
          }
        }
      });
    },
    getList() {
      const list = this.menus.map((m, index) => {
        m.key = index;
        if (m.children) {
          let expand = false;
          const children = m.children.map((mm, ii) => {
            mm.index = ii;
            if (this.$route.name.includes(mm.name)) {
              expand = true;
            }
            return { ...mm, children };
          });
          return { ...m, expand };
        }
        const expand = this.$route.name.includes(m.name);
        return { ...m, expand };
      });
      return list;
    }
  },
  mounted() {
    this.list = this.getList();
  }
};
</script>
<style lang="scss" scoped>
.menu-container {
  background: #fff;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  .menu-top {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  .small-device {
    display: none;

    .menu-icon {
      display: inline-block;
      width: 21px;
      height: 21px;
      &.language {
        &.zh-CN {
          background: url(../../assets/images/ic_language_exchange_02.png)
            no-repeat center;
          background-size: 100%;
        }
        &.en-US {
          background: url(../../assets/images/ic_language_exchange_01.png)
            no-repeat center;
          background-size: 100%;
        }
      }
      &.menu {
        width: 24px;
        margin-left: 40px;
        background: url(../../assets/images/ic_top_bar_pull_down.png) no-repeat
          center;
        background-size: 100%;
      }
    }
  }
  .logo-container {
    padding: 60px 0;
    display: flex;
    justify-content: center;
    width: 100%;
    .logo {
      width: 209px;
      height: 32px;
    }
  }
  .menu {
    background: #fff;
    .menu-item,
    .menu-child {
      font-size: 16px;
      color: #333;
      list-style: none;
      cursor: pointer;
      &.selected {
        color: #d6001c;
      }
    }
    .menu-item {
      position: relative;
      &.exit {
        display: none;
      }
      .menu-icon {
        width: 18px;
        height: 18px;
        display: inline-block;
        margin-left: 30px;
        position: relative;
        top: 3px;
        &.wifi {
          background: url(../../assets/images/ic_home_normal.png) no-repeat
            center;
          background-size: 100%;
        }
        &.setting {
          background: url(../../assets/images/ic_setting_router.png) no-repeat
            center;
          background-size: 100%;
        }
        &.exit {
          background: url(../../assets/images/ic_logout.png) no-repeat center;
          background-size: 100%;
        }
        &.advance {
          background: url(../../assets/images/ic_advanced_setup.png) no-repeat
            center;
          background-size: 100%;
        }
        &.upgrade {
          background: url(../../assets/images/ic_firmware_upgrade.png) no-repeat
            center;
          background-size: 100%;
        }
      }
      .menu-trigle {
        display: inline-block;
        width: 12px;
        height: 6px;
        background: url(../../assets/images/ic_side_bar_pull_down.png) no-repeat
          center;
        background-size: 100%;
        position: absolute;
        right: 20px;
        top: 50%;
        margin-top: -3px;
        transition: transform 0.3s linear;
        &.menu-expand {
          transform: rotate(-180deg);
        }
        &.menu-collapse {
          transform: rotate(0);
          top: 25px;
        }
      }
    }

    .menu-text {
      padding: 15px 0;
      margin-left: 15px;
      display: inline-block;
    }
    .menu-child {
      font-size: 14px;
    }
  }
  .menu-children {
    transition: all 0.1s ease-in-out;
    height: 0;
    overflow: hidden;
    background: #fff;
    &.show {
      height: auto;
    }
  }
  .qr-container {
    position: absolute;
    width: 100%;
    text-align: center;
    bottom: 80px;
    font-size: 14px;
    color: #333;
    img {
      width: 80px;
      height: 80px;
    }
  }
}
@media screen and (min-width: 769px) and (max-width: 1599px) {
  .menu-container {
    width: 250px;
    z-index: 1000;
    position: relative;
    min-height: 650px;
  }
}
@media screen and (min-width: 1600px) {
  .menu-container {
    width: 300px;
    left: 0;
    top: 0;
    z-index: 1000;
    position: relative;
    min-height: 650px;
  }
}
@media screen and (max-width: 768px) {
  .menu-container {
    height: 65px;
    width: 100%;
    border-bottom: 1px solid #e1e1e1;
    justify-content: space-between;
    .menu-top {
      height: 64px;
      flex-shrink: 0;
    }
    &.small-device-expand {
      height: 100%;
      border: none;
      position: fixed;
      overflow: auto;
      z-index: 1000;
      flex-direction: column;
      justify-content: flex-start;
    }
    .small-device {
      display: flex;
      align-items: center;
      padding: 0 20px;
    }
    .logo-container {
      padding: 0;
      padding-left: 20px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      .logo {
        width: 131px;
        height: 20px;
      }
    }
    .menu {
      display: none;
      &.show {
        display: block;
      }
      .menu-item {
        &.exit {
          display: block;
        }
      }
    }
    .qr-container {
      display: none;
    }
  }
}
</style>
