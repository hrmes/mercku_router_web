<template>
  <div class="layout-wrap  primary">
    <div class="content-wrap">
      <div v-if="!isMobile&&asideInfo.hasAside"
           class="left-aside">
        <ul class="menu-result-list">
          <li v-for="menu in asideInfo.subMenu[0].children"
              :key='menu.name'
              @click="jump(menu)"
              :class="{'selected':$route.path.includes(menu.url),'disabled':menu.disabled}">
            {{$t(`${menu.text}`)}}
          </li>
        </ul>
      </div>
      <router-view class="router-view">
      </router-view>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    hasBackWrap: {
      type: Boolean,
      default: false
    },
    asideInfo: {
      type: Object,
      default: () => ({ hasAside: false, subMenu: [] })
    }
  },
  mounted() {
    const that = this;
    this.getIsMobile(that);
    window.addEventListener('resize', () => {
      const w = that.windowWidth();
      if (w <= 768) {
        that.$store.state.isMobile = true;
      } else {
        that.$store.state.isMobile = false;
      }
    });
  },
  computed: {
    isMobile() {
      return this.$store.state.isMobile;
    }
  },
  methods: {
    onBack(target) {
      if (target) {
        this.$router.replace({ path: target });
      } else {
        this.$router.go(-1);
      }
    },
    getIsMobile(that) {
      const w = that.windowWidth();
      if (w <= 768) {
        that.$store.state.isMobile = true;
      } else {
        that.$store.state.isMobile = false;
      }
    },
    windowWidth() {
      if (window.innerWidth) return window.innerWidth;
      if (document.documentElement && document.documentElement.clientWidth) {
        return document.documentElement.clientWidth;
      }
      return 0;
    },
    jump(menu) {
      if (menu.disabled) return;
      this.$router.push({ path: menu.url });
    }
  }
};
</script>

<style lang="scss" scoped>
.primary {
  min-width: 1280px;
  padding: 0 30px;
  display: flex;
  flex-direction: column;
  .content-wrap {
    flex: 1;
    display: flex;
    .left-aside {
      width: 17vw;
      margin-right: 10px;
      padding: 25px 15px;
      background: var(--dashboard-icon-background-color);
      border-radius: 10px;
      ul {
        list-style: none;
        margin: 0;
        padding: 0;
        color: var(--text-default-color);
        > li {
          padding: 10px 15px;
          margin-bottom: 5px;
          cursor: pointer;
          transition: background 0.3s ease-out;
          border-radius: 5px;
          &.selected {
            color: var(--aside-selected-text-color);
            background: var(--asdie-selected-background) !important;
          }
          &.disabled {
            color: var(--aside-disabled-color);
            cursor: not-allowed;
            &:hover {
              background: none;
            }
          }
          &:hover {
            background: var(--aside-hover-background-color);
          }
        }
      }
    }
    .router-view {
      flex: 1;
      border-radius: 10px;
    }
  }
}
@media screen and (max-width: 768px) {
  .primary {
    min-width: auto;
    padding: 0 !important;
    .content-wrap {
      .left-aside {
        display: none;
      }
    }
  }
}
</style>
