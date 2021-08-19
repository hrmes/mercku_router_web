<template>
  <div class="page led">
    <div class="page-header">
      {{$t('trans0779')}}
    </div>
    <div class="page-content">
      <m-form class="form">
        <m-form-item class="form__item--first">
          <m-switch :label="$t('trans0462')"
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
import TimezoneOffset from '../../../mixins/timezone-offset';

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
          this.isSameTimezoneOffset({
            cancelCb: () => {
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
.page.led {
  .page-content {
    .form {
      width: 340px;
      .row {
        display: flex;
      }
      .form__label {
        display: block;
        text-align: left;
        margin-bottom: 5px;
        font-weight: bold;
        color: #333;
        font-size: 14px;
      }
      .form-item {
        &.form__item--first {
          margin-bottom: 20px;
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
        border-bottom: 1px solid #ebebeb;
        padding-bottom: 20px;
      }
    }
  }
}
</style>
