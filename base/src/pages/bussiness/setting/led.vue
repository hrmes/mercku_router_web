<template>
  <div class="page">
    <div v-if="$store.state.isMobile"
         class="page-header">
      {{$t('trans0779')}}
    </div>
    <div class="page-content">
      <div class="page-content__main">
        <div class="row-1">
          <div class="card">
            <m-form-item class="last">
              <m-switch :label="$t('trans0779')"
                        class="smart-connect__switch"
                        v-model="form.enabled" />
              <div class="des-tips">{{$t('trans0777')}}</div>
            </m-form-item>
          </div>
        </div>
        <div class="row-2">
          <div class="card">
            <m-form-item>
              <label class="form-item__label">{{$t('trans0778')}}</label>
              <m-time-picker class="time-picker"
                             v-model="form.begin_time" />
            </m-form-item>
            <m-form-item class="last">
              <label class="form-item__label">{{$t('trans0780')}}</label>
              <m-time-picker class="time-picker"
                             v-model="form.end_time" />
            </m-form-item>
          </div>
        </div>
      </div>
      <div class="page-content__bottom">
        <div class="form-button__wrapper">
          <button class="btn"
                  v-defaultbutton
                  @click="updateLED">{{$t('trans0081')}}</button>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
import TimezoneOffset from 'base/mixins/timezone-offset';

export default {
  mixins: [TimezoneOffset],
  data() {
    return {
      form: {
        enabled: false,
        begin_time: '20:00',
        end_time: '08:00'
      }
    };
  },
  methods: {
    updateLED() {
      this.$loading.open();
      this.$http
        .updateLEDTimeLimit(this.form)
        .then(() => {
          this.$loading.close();
          if (this.form.enabled) {
            this.isSameTimezoneOffset().then(result => {
              if (result.same || !result.redirect) {
                this.$toast(this.$t('trans0040'), 2000, 'success');
              }
            });
          }
        })
        .catch(() => {
          this.$loading.close();
        });
    },
    getLED() {
      this.$loading.open();
      this.$http
        .getLEDTimeLimit()
        .then(res => {
          this.form = res.data.result;
          this.$loading.close();
        })
        .catch(() => {
          this.$loading.close();
        });
    }
  },
  mounted() {
    this.getLED();
  }
};
</script>
