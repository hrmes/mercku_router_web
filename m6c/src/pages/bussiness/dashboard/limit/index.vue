<template>
  <div class="page">
    <div class="page-header"
         @click="showDropdown">
      <div class="page-header__text">{{$t('trans0019')}}</div>

      <div class="page-header-trigger"
           :class="{'show':dropdownVisible}"></div>
      <div class="tabs-container"
           :class="{'show':dropdownVisible}">
        <m-tabs class="tabs">
          <m-tab :class="{'selected':isCategory('time')}"
                 @click.native.stop="forward2page('time')">
            {{$t('trans0075')}}
            <i class="is-mobile is-checked"
               v-show="isCategory('time')"></i>
          </m-tab>
          <m-tab :class="{'selected':isCategory('speed')}"
                 @click.native.stop="forward2page('speed')">
            {{$t('trans0014')}}
            <i class="is-mobile is-checked"
               v-show="isCategory('speed')"></i>
          </m-tab>
          <m-tab :class="{'selected':isCategory('url')}"
                 @click.native.stop="forward2page('url')">
            {{$t('trans0076')}}
            <i class="is-mobile is-checked"
               v-show="isCategory('url')"></i>
          </m-tab>
        </m-tabs>
      </div>
    </div>
    <div class="page-content">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    isCategory(category) {
      return this.$route.fullPath.includes(category);
    },
    forward2page(category) {
      this.dropdownVisible = false;
      this.$router.push(`/limit/${this.$route.params.mac}/${category}`);
    },
    showDropdown() {
      this.dropdownVisible = !this.dropdownVisible;
    }
  },
  data() {
    return {
      dropdownVisible: false
    };
  }
};
</script>
<style lang="scss" scoped>
.page {
  .page-header {
    display: flex;
    justify-content: space-between;
    .page-header-trigger {
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
}
@media screen and (max-width: 768px) {
  .page {
    .page-header {
      position: relative;
      background: $header-bgc;
      color: #fff;
      align-items: center;
      border-top: 1px solid $header-nav-item-border-color;
      .page-header-trigger {
        display: block;
        &::before {
          content: '';
          display: block;
          width: 8px;
          height: 8px;
          border-bottom: 1px solid #fff;
          border-right: 1px solid #fff;
          transform: rotate(45deg);
          position: relative;
          top: -2px;
          transition: all 0.3s linear;
        }
        &.show {
          &::before {
            transform: rotate(225deg);
          }
        }
      }
      .tabs-container {
        display: none;
        &.show {
          display: block;
        }
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        z-index: 999;
        .tabs {
          display: flex;
          flex-direction: column;
          padding: 0 30px;
          background: $header-bgc;
          .tab {
            padding: 18px 0;
            color: #fff;
            font-size: 14px;
            // font-weight: bold;
            margin: 0;
            border-bottom: 1px solid $header-nav-item-border-color;
            display: flex;
            justify-content: space-between;
            .is-mobile {
              display: inline-block;
            }
            &.selected {
              border-bottom: 1px solid $header-nav-item-border-color;
              color: $tab-selected-text-color;
              &::before {
                display: none;
              }
              .is-checked {
                &::after {
                  border-color: $header-popup-item-checked-color;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
