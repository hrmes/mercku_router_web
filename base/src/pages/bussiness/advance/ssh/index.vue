<template>
  <div class="page">
    <div class="page-content">
      <div class="page-content__main">
        <div class="row-1">
          <div class="card">
            <m-form-item class="last">
              <m-switch class="form__switch"
                        v-model="enabled"
                        :label="$t('ssh')"
                        @change="onEnabledChange" />
              <!-- <p class="des-tips">{{$t('trans0643')}}</p> -->
            </m-form-item>
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
    onEnabledChange() {
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
