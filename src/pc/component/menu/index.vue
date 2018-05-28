<template>
  <div class="menu-container">
    <ul class="menu">
      <li class="menu-item" @click="jump(menu)" v-for="menu in menus" :class="{'selected':$route.path.includes(menu.url)}">
        <span class="menu-icon"></span>
        <span class="menu-text">{{$t(menu.text)}}</span>
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
    .menu-text {
      padding: 15px 35px;
      display: block;
    }
    .menu-child {
      font-size: 14px;
    }
  }
  .menu-children {
    transition: all 5s linear;
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
