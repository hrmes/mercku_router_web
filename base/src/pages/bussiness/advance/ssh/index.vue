<template>
  <div class="page">
    <div class="page-content">
      <div class="page-content__main">
        <div class="content">
          <div class="content__item content__switch">
            <m-switch v-model="enabled"
                      @change="updateSsh"></m-switch>
            <label for="">{{ SSH }}</label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { portReg, isIP } from 'base/util/util';

export default {
  data() {
    return {
      enabled: false
    };
  },
  mounted() {
    this.$http.routerSshGet().then(res => {
      const { enabled } = res;
      this.enabled = enabled;
    });
  },
  methods: {
    updateSsh() {
      if (this.enabled) {
        this.$http.routerSshEnable();
      } else {
        this.$http.routerSshDisable();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.page {
  .page-header {
    display: flex;
    justify-content: space-between;
  }
  .page-content {
    display: flex;
    flex-direction: column;
    .form-button {
      margin-top: 0;
      padding-top: 25px;
      border-top: 1px solid var(--hr-color);
    }
  }
}
</style>
