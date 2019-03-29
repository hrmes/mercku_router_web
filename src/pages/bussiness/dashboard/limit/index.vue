<template>
  <div class="page">
    <div class="page-header">
      <div class="page-header__text">{{$t('trans0019')}}</div>
      <div class="tabs-container">
        <m-tabs class="tabs">
          <m-tab :class="{'selected':isCategory('time')}"
                 @click.native="forward2page('time')">{{$t('trans0075')}}
          </m-tab>
          <m-tab :class="{'selected':isCategory('speed')}"
                 @click.native="forward2page('speed')">{{$t('trans0014')}}
          </m-tab>
          <m-tab :class="{'selected':isCategory('url')}"
                 @click.native="forward2page('url')">{{$t('trans0076')}}</m-tab>
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
      this.$router.push(`/limit/${this.$route.params.mac}/${category}`);
    }
  },
  data() {
    return {
      tab: 'time'
    };
  }
};
</script>
<style lang="scss" scoped>
.page {
  .page-header {
    display: flex;
    justify-content: space-between;
    .page-header__text {
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
      .page-header__text {
      }
      .tabs-container {
        .tabs {
          .tab {
            padding: 18px 0;
            font-size: 14px;
          }
        }
      }
    }
  }
}
</style>
