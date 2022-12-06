<template>
  <div class="page">
    <div class="page-top back-wrap">
      <div class="btn-container"
           @click="onBack($route.meta.parentPath)">
        <i class="iconfont icon-ic_back"></i>
      </div>
      <div class="text-container"></div>
    </div>
    <div class="page-bottom">
      <div v-if="isMobile"
           class="mobile-menu-wrap"
           @click="showDropdown">
        <div class="mobile-menu__text">
          {{litmitType}}
        </div>
        <div class="mobile-menu-trigger"
             :class="{'show':dropdownVisible}"></div>
        <div class="tabs-container"
             :class="{'show':dropdownVisible}">
          <ul class="tabs">
            <li class="tab"
                :class="{'selected':isCategory('time')}"
                @click.stop="forward2page('time')">
              <i class="iconfont icon-ic_limit_time_off"></i>
              {{$t('trans0075')}}
              <i class="is-mobile is-checked"
                 v-show="isCategory('time')"></i>
            </li>
            <li class="tab"
                :class="{'selected':isCategory('speed')}"
                @click.stop="forward2page('speed')">
              <i class="iconfont icon-ic_limit_speed_off"></i>
              {{$t('trans0014')}}
              <i class="is-mobile is-checked"
                 v-show="isCategory('speed')"></i>
            </li>
            <li class="tab"
                :class="{'selected':isCategory('url')}"
                @click.stop="forward2page('url')">
              <i class="iconfont icon-ic_limit_website_off"></i>
              {{$t('trans0076')}}
              <i class="is-mobile is-checked"
                 v-show="isCategory('url')"></i>
            </li>
          </ul>
        </div>
      </div>
      <div v-else
           class="laptop-aside-wrap">
        <ul class="menu">
          <li :class="{'selected':isCategory('time')}"
              @click.stop="forward2page('time')">
            <i class="iconfont iconfont icon-ic_limit_time_off"></i>
            <span> {{$t('trans0075')}}</span>
          </li>
          <li :class="{'selected':isCategory('speed')}"
              @click.stop="forward2page('speed')">
            <i class=" iconfont icon-ic_limit_speed_off"></i>
            <span> {{$t('trans0014')}}</span>
          </li>
          <li :class="{'selected':isCategory('url')}"
              @click.stop="forward2page('url')">
            <i class=" iconfont icon-ic_limit_website_off"></i>
            <span> {{$t('trans0076')}}</span>
          </li>
        </ul>
      </div>
      <div class="page-content">
        <router-view></router-view>
      </div>
    </div>
    <div @click="close"
         class="mask"
         v-if="isMobile&&dropdownVisible"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dropdownVisible: false,
    };
  },
  computed: {
    isMobile() {
      return this.$store.isMobile;
    },
    litmitType() {
      return this.$route.meta.text;
    }
  },
  methods: {
    onBack(target) {
      this.$router.replace({ path: target });
    },
    isCategory(category) {
      return this.$route.fullPath.includes(category);
    },
    forward2page(category) {
      this.dropdownVisible = false;
      this.$router.push(`/limit/${this.$route.params.mac}/${category}`);
    },
    showDropdown() {
      this.dropdownVisible = true;
    },
    close() {
      this.dropdownVisible = false;
    }
  },
};
</script>
<style lang="scss" scoped>
.page {
  padding: 0 5%;
  background: var(--flex-warp-has-menu-bgc) !important;
  .page-top {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 60px;
    color: var(--text-default-color);
    .text-container {
      font-size: 18px;
      font-weight: 500;
    }
    .btn-container {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 35px;
      height: 35px;
      border-radius: 50%;
      margin-right: 10px;
      cursor: pointer;
      background: var(--dashboard-unconnect-icon-background-color);
      box-shadow: 0 5px 10px -5px rgba(51, 51, 51, 0.3);
    }
  }
  .page-bottom {
    flex: 1;
    display: flex;
    .mobile-menu-wrap {
      display: flex;
      justify-content: space-between;
      .mobile-menu-trigger {
        display: none;
      }
      .tabs-container {
        .tabs {
          border: 0;
          padding: 0;
          .tab {
            padding: 15px 0;
            font-weight: normal;
            display: flex;
            align-items: center;
            font-size: 14px;
            .is-mobile {
              display: none;
            }
          }
        }
      }
    }
    .laptop-aside-wrap {
      width: 17vw;
      height: 100%;
      background-color: var(--dashboard-icon-background-color);
      border-radius: 10px;
      margin-right: 10px;
      padding: 25px 15px;
      .menu {
        > li {
          display: flex;
          align-items: center;
          width: 100%;
          height: 100%;
          padding: 8px 15px;
          border-radius: 5px;
          margin-bottom: 5px;
          color: var(--text-default-color);
          transition: all 0.3s ease-out;
          cursor: pointer;
          > .iconfont {
            font-size: 20px;
            color: var(--table-action-icon-color);
            margin-right: 10px;
          }
          &:hover {
            background: var(--tab-hover-background-color);
          }
          &.selected {
            color: var(--aside-selected-text-color);
            background: var(--asdie-selected-background);
            > .iconfont {
              color: var(--aside-selected-text-color);
            }
          }
        }
      }
    }
    .page-content {
      flex: 1;
      justify-content: flex-start;
      height: 100%;
      background-color: var(--dashboard-icon-background-color);
    }
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }
  }
}
@media screen and (max-width: 1440px) {
  .page {
    padding: 0 50px;
  }
}
@media screen and (max-width: 768px) {
  .page {
    padding: 0;
    flex-direction: column;
    align-items: inherit;
    .page-top {
      padding: 0 15px;
      height: 55px;
    }
    .page-bottom {
      flex-direction: column;
      .mobile-menu-wrap {
        margin: 0 15px 8px 15px;
        padding: 10px;
        border-radius: 5px;
        background: var(--dashboard-icon-background-color);
        align-items: center;
        .mobile-menu__text {
          font-weight: 600;
          color: var(--primaryColor);
        }
        .mobile-menu-trigger {
          display: block;
          &::before {
            content: '\e65b';
            font-family: 'iconfont';
            display: block;
            width: 15px;
            height: 15px;
            line-height: 15px;
            text-align: center;
            font-size: 10px;
            color: var(--text-default-color);
            transform: rotate(-90deg);
            position: relative;
            top: -2px;
            transition: all 0.2s;
          }
          &.show {
            &::before {
              transform: rotate(0deg);
            }
          }
        }
        .tabs-container {
          position: fixed;
          bottom: 0;
          left: 0;
          transform: translateY(100%);
          width: 100%;
          z-index: 1001;
          transition: all 0.2s ease-out;
          &.show {
            transform: translateY(0);
          }
          .tabs {
            display: flex;
            flex-direction: column;
            padding: 0 25px;
            background: var(--drawer-background);
            // background-color: lightskyblue;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
            .tab {
              display: flex;
              align-items: center;
              position: relative;
              padding: 18px 0;
              color: var(--text-default-color);
              font-size: 14px;
              .iconfont {
                margin-right: 8px;
              }
              .is-mobile {
                position: absolute;
                right: 0;
                top: 50%;
                transform: translateY(-50%);
                display: inline-block;
              }
              &.selected {
                color: var(--tab-selected-text-color);
                &::before {
                  display: none;
                }
                .is-checked {
                  &::after {
                    border-color: var(--header-popup-item-checked-color);
                  }
                }
              }
            }
          }
        }
      }
      .laptop-aside-wrap {
        display: none;
      }
      .page-content {
        padding: 10px;
      }
    }
    .mask {
      width: 100vw;
      height: 100vh;
      position: fixed;
      top: 0;
      z-index: 1000;
      background: rgba(0, 0, 0, 0.6);
    }
  }
}
</style>
