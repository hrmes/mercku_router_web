<template>
  <div class="page">
    <div class="limit-wrapper">
      <div class="limit-wrapper__title">
        <div>
          <div>{{litmitType}}</div>
          <div class="des"
               v-if="isUrlLimit">{{$t('trans0101')}}</div>
        </div>
        <span class="btn-icon close"
              @click="$router.go(-1)">
          <i class="iconfont  icon-ic_close"></i>
        </span>
      </div>
      <div class="limit-wrapper-__content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  computed: {
    isMobile() {
      return this.$store.state.isMobile;
    },
    isUrlLimit() {
      return this.$route.path.includes('url');
    },
    litmitType() {
      return this.$t(this.$route.meta.text);
    },
    deviceName() {
      return sessionStorage.getItem('deviceName');
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
  padding: 0 30px;
  background: transparent;
  .limit-wrapper {
    flex: 1;
    justify-content: flex-start;
    height: 100%;
    border-radius: 10px;
    padding: 20px;
    background-color: var(--common-card-bgc);
  }
  .limit-wrapper__title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 20px;
    font-weight: 500;
    margin-bottom: 20px;
    .des {
      color: var(--common-gery-color);
      font-size: 12px;
    }
  }
  .limit-wrapper__content {
    flex: 1;
    justify-content: flex-start;
    height: 100%;
    background-color: var(--dashboard-icon-background-color);
  }
}
@media screen and (max-width: 768px) {
  .page {
    padding: 0 15px;
    .limit-wrapper {
      padding: 20px 15px;
    }
    .limit-wrapper__title {
      font-size: 17px;
      .btn-icon {
        width: 26px;
        height: 26px;
        .iconfont {
          font-size: 12px;
        }
      }
    }
  }
}
</style>
