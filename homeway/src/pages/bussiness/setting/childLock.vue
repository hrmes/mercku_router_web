<template>
  <div class="page">
    <div class="page-header">
      {{$t('trans1061')}}
    </div>
    <div class="page-content">
      <div class="form">
        <m-switch class="form__switch"
                  v-model="form.enabled"
                  :label="$t('trans0462')"
                  @change="print" />
        <div class="form__label">{{$t('trans1060')}}</div>
      </div>
      <div class="form-button">
        <button class="btn primary"
                v-defaultbutton
                @click="onEnabledChange(form.enabled)">{{$t('trans0081')}}</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {
        enabled: false
      }
    };
  },
  methods: {
    print() {
      console.log(this.form.enabled);
    },
    onEnabledChange(newVal) {
      console.log('newval', newVal);
      this.$loading.open();
      this.$http
        .updateChildLockStatus({
          enabled: newVal
        })
        .then(() => {
          this.$loading.close();
          this.$toast(this.$t('trans0040'), 3000, 'success');
        })
        .catch(() => {
          this.$loading.close();
        });
    },
    getChildLockEnable() {
      this.$loading.open();
      this.$http
        .getChildLockStatus()
        .then(res => {
          this.form.enabled = res.data.result.status;
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
