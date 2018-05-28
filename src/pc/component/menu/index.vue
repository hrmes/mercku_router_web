<template>
  <div class="menu-container">
    <div class="logo-container">
      <img src="../../assets/images/MERCKU_LOGO_web_top.png" alt="">
    </div>
    <ul class="menu">
      <li class="menu-item" @click="jump(menu)" v-for="menu in menus" :class="{'selected':$route.path.includes(menu.url)}">
        <span class="menu-icon" :class="[menu.icon]"></span>
        <span class="menu-text">{{$t(menu.text)}}</span>
        <span v-if="menu.children" :class="{'menu-expand':!menu.expand,'menu-collapse':menu.expand}"></span>
        <ul v-if="menu.children" class="menu-children" :class="{'show':menu.expand}">
          <li class="menu-child" @click.stop="jump(child)" v-for="child in menu.children" :class="{'selected':$route.path.includes(child.url)}">
            <span class="menu-icon"></span>
            <span class="menu-text">{{$t(child.text)}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="qr-container">
      <img src="../../assets/images/qr.png" alt="">
      <div>{{$t('trans0314')}}</div>
    </div>
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
      current: null
    };
  },
  methods: {
    jump(menu) {
      if (!menu.url && menu.children) {
        menu.expand = !menu.expand;
      } else {
        this.$router.push({ path: menu.url });
        this.current = menu;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.menu-container {
  background: #fff;
  .logo-container {
    padding: 60px;
    text-align: center;
    img {
      width: 160px;
      height: 23px;
    }
  }
  .menu {
    .menu-item,
    .menu-child {
      font-size: 16px;
      color: #333;
      list-style: none;
      cursor: pointer;
      &.selected {
        color: #4237dd;
      }
    }
    .menu-item {
      position: relative;
      height: 50px;
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
        }
        &.setting {
          background: url(../../assets/images/ic_setting_router.png) no-repeat
            center;
        }
      }
      &.selected {
        .menu-icon.wifi {
          background: url(../../assets/images/ic_home_selected.png) no-repeat
            center;
        }
      }
      .menu-expand {
        display: inline-block;
        width: 12px;
        height: 6px;
        background: url(../../assets/images/ic_side_bar_pick_up.png) no-repeat
          center;
        position: absolute;
        right: 20px;
        top: 50%;
        margin-top: -3px;
      }
      .menu-collapse {
        display: inline-block;
        width: 12px;
        height: 6px;
        background: url(../../assets/images/ic_side_bar_pull_down.png) no-repeat
          center;
        position: absolute;
        right: 20px;
        top: 50%;
        margin-top: -3px;
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
@media screen and (max-width: 479px) {
  .menu-container {
    .qr-container {
      display: none;
    }
  }
}
</style>
