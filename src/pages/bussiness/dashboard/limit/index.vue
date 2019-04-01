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
                 @click.native.stop="forward2page('time')">{{$t('trans0075')}}
          </m-tab>
          <m-tab :class="{'selected':isCategory('speed')}"
                 @click.native.stop="forward2page('speed')">{{$t('trans0014')}}
          </m-tab>
          <m-tab :class="{'selected':isCategory('url')}"
                 @click.native.stop="forward2page('url')">{{$t('trans0076')}}</m-tab>
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
      return this.tab === category;
    },
    forward2page(category) {
      this.tab = category;
      this.dropdownVisible = false;
      this.$router.push(`/limit/${this.$route.params.mac}/${category}`);
    },
    showDropdown() {
      this.dropdownVisible = !this.dropdownVisible;
    }
  },
  data() {
    return {
      tab: 'time',
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
          font-size: 16px;
          padding: 12px 0;
          font-weight: normal;
          display: flex;
          align-items: center;
          font-size: 14px;
        }
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .page {
    .page-header {
      position: relative;
      background: #333;
      color: #fff;
      align-items: center;
      border-top: 1px solid #666;
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
          top: -3px;
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
        background: #333;
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        z-index: 999;
        .tabs {
          display: flex;
          flex-direction: column;
          padding: 0 30px;
          .tab {
            padding: 18px 0;
            color: #fff;
            font-size: 14px;
            margin: 0;
            border-bottom: 1px solid #666;
            &.selected {
              border-bottom: 1px solid #666;
              color: #d6001c;
            }
          }
        }
      }
    }
  }
}
</style>
