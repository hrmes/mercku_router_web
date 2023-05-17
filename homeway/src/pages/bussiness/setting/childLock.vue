<template>
  <div class="page">
    <div class="page-header">
      {{$t('trans1061')}}
    </div>
    <div class="page-content">
      <m-form class="form">
        <m-form-item class="form__item">
          <m-switch class="form__switch"
                    v-model="enabled"
                    :label="$t('trans0462')"
                    @click="enabled=!enabled"
                    @change="updateChildLockStatus" />
          <div class="form__label">{{$t('trans1060')}}</div>
        </m-form-item>

      </m-form>
    </div>
  </div>
</template>
<script>
import { throttle } from 'base/util/util';

export default {
  data() {
    return {
      enabled: false
    };
  },
  methods: {
    // eslint-disable-next-line func-names
    updateChildLockStatus: throttle(function () {
      this.$loading.open();
      this.$http
        .updateChildLockStatus({
          enabled: this.enabled
        })
        .then(() => {
          this.$loading.close();
          this.$toast(this.$t('trans0040'), 3000, 'success');
        })
        .catch(() => {
          this.$loading.close();
        });
    }, 1000),
    getChildLockEnable() {
      this.$loading.open();
      this.$http
        .getChildLockStatus()
        .then(res => {
          this.enabled = res.data.result.enabled;
          this.$loading.close();
        })
        .catch(() => {
          this.$loading.close();
        });
    }
  },
  mounted() {
    this.getChildLockEnable();
  }
};
</script>
<style lang="scss" scoped>
.page {
  .page-content {
    .form {
      .form__label {
        font-size: 12px;
        color: #999;
        margin-top: 10px;
        max-width: 340px;
      }
      .form__switch {
      }
    }
  }
}
</style>
