<template>
  <div class="page">
    <div class='page-header'>
      {{$t('trans0420')}}
    </div>
    <div class="page-content">
      <m-form ref="form" class='form' :model="dmz" :rules='rules'>
        <m-form-item class="item" prop='ip'>
          <m-input :label="$t('trans0457')" :placeholder="`${$t('trans0321')}`" v-model="dmz.ip"></m-input>
        </m-form-item>
        <div class="checkbox-wrapper">
          <m-checkbox v-model="dmz.enabled" :text="$t('trans0462')"></m-checkbox>
        </div>

      </m-form>
      <div class="form-button">
        <button class="btn" @click="submit()">{{$t('trans0081')}}</button>
      </div>
    </div>
  </div>
</template>
<script>
import { isIP } from '../../../../util/util';

export default {
  data() {
    return {
      dmz: {
        ip: '',
        enabled: false
      },
      rules: {
        ip: [
          {
            rule: value => isIP(value),
            message: this.$t('trans0231')
          }
        ]
      }
    };
  },
  mounted() {
    this.getDMZ();
  },
  methods: {
    getDMZ() {
      this.$loading.open();
      this.$http
        .getDMZ()
        .then(res => {
          this.$loading.close();
          this.dmz = res.data.result;
        })
        .catch(() => {
          this.$loading.close();
        });
    },
    submit() {
      if (this.$refs.form.validate()) {
        this.$loading.open();
        this.$http
          .updateDMZ(this.dmz)
          .then(() => {
            this.$loading.close();
            this.$toast(this.$t('trans0040'), 3000, 'success');
          })
          .catch(() => {
            this.$loading.close();
          });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.form {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  .btn-wrapper {
    display: block;
    text-align: center !important;
  }
  .checkbox-wrapper {
    margin-bottom: 30px;
    width: 350px;
  }
}
@media screen and (max-width: 768px) {
  .form {
    .checkbox-wrapper {
      width: 100%;
    }
  }
}
</style>

