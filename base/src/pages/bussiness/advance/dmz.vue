<template>
  <div class="page">
    <div v-if="$store.state.isMobile"
         class='page-header'>
      {{$t('trans0420')}}
    </div>
    <div class="page-content">
      <div class="page-content__main">
        <div class="row-1">
          <div class="card">
            <m-form ref="form"
                    class='form'
                    :model="dmz"
                    :rules='rules'>
              <m-form-item prop='ip'>
                <m-input :label="$t('trans0457')"
                         :placeholder="`${$t('trans0321')}`"
                         v-model="dmz.ip"></m-input>
              </m-form-item>
              <div class="checkbox-wrapper">
                <m-checkbox v-model="dmz.enabled"
                            :rect="false"
                            :bold="true"
                            :text="$t('trans0462')"></m-checkbox>
              </div>
            </m-form>
          </div>
        </div>
      </div>
      <div class="page-content__bottom">
        <div class="form-button__wrapper">
          <button class="btn"
                  v-defaultbutton
                  @click="submit()">{{$t('trans0081')}}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { isIP } from 'base/util/util';

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
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          },
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
          this.dmz = res.data.result;
        })
        .finally(() => {
          this.$loading.close();
        });
    },
    submit() {
      if (this.$refs.form.validate()) {
        this.$loading.open();
        this.$http
          .updateDMZ(this.dmz)
          .then(() => {
            this.$toast(this.$t('trans0040'), 2000, 'success');
          })
          .finally(() => {
            this.$loading.close();
          });
      }
    }
  }
};
</script>
