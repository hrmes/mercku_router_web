<template>
  <div class="page led">
    <div v-if="$store.state.isMobile"
         class="page-header">
      {{$t('trans0779')}}
    </div>
    <div class="page-content">
      <m-form class="form">
        <m-form-item class="form__item--first">
          <m-switch :label="$t('trans0779')"
                    class="smart-connect__switch"
                    v-model="form.enabled" />
          <div class="tip__label">{{$t('trans0777')}}</div>
        </m-form-item>
        <m-form-item class="form__item">
          <label class="form__label">{{$t('trans0778')}}</label>
          <m-time-picker class="time-picker"
                         v-model="form.begin_time" />
        </m-form-item>
        <m-form-item class="form__item">
          <label class="form__label">{{$t('trans0780')}}</label>
          <m-time-picker class="time-picker"
                         v-model="form.end_time" />
        </m-form-item>
      </m-form>
      <div class="form-button">
        <button class="btn primary"
                v-defaultbutton
                @click="updateLED">{{$t('trans0081')}}</button>
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
          this.isSameTimezoneOffset().then(result => {
            if (result.same || !result.redirect) {
              this.$toast(this.$t('trans0040'), 3000, 'success');
            }
          });
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

<style lang="scss" scoped>
.page {
  .page-content {
    .form {
      .row {
        display: flex;
      }
      .form__label {
        display: block;
        text-align: left;
        margin-bottom: 5px;
        font-weight: bold;
        color: var(--text-default-color);
        font-size: 14px;
      }
      .form-item {
        width: 340px;
        &.form__item--first {
          width: auto;
          padding-bottom: 25px;
          border-bottom: 1px solid var(--hr-color);
        }
        .time-picker {
          height: 48px;
        }
      }
      .tip__label {
        font-size: 12px;
        color: #999;
        margin-top: 10px;
        max-width: 340px;
      }
    }
    .form-button {
      margin-top: 0;
      padding-top: 25px;
      border-top: 1px solid var(--hr-color);
    }
  }
}
@media screen and (max-width: 768px) {
  .page {
    .page-content {
      width: 100vw;
      .form {
        .form-item {
          width: auto;
        }
      }
    }
  }
}
</style>
