<template>
  <div class="page">
    <div v-if="$store.state.isMobile"
         class="page-header">
      {{$t('trans0962')}}
    </div>
    <div class="page-content">
      <m-form class="form">
        <m-form-item class="form__item--first">
          <m-switch :label="$t('trans0962')"
                    class="smart-connect__switch"
                    v-model="form.enabled"
                    @change="onEnableChange" />
        </m-form-item>
        <div v-show="form.enabled"
             class="form-wrapper">
          <div class="form__advance">
            <m-form-item class="form__item schedule-item">
              <label class="form__label">{{$t('trans0082')}}</label>
              <div class="schedules">
                <m-checkbox class="schedules__schedule"
                            v-for="schedule in schedules"
                            :key="schedule.value"
                            v-model="schedule.checked"
                            :text="schedule.label"></m-checkbox>
                <label v-show="showErrorTip"
                       class="schedules__error">{{$t('trans0388')}}</label>
              </div>

            </m-form-item>

            <m-form-item class="form__item">
              <label class="form__label">{{$t('trans0965')}}</label>
              <m-time-picker class="time-picker"
                             v-model="form.time_begin" />
            </m-form-item>

            <m-form-item class="form__item">
              <label class="form__label">{{$t('trans0966')}}</label>
              <m-time-picker class="time-picker"
                             v-model="form.time_end" />
            </m-form-item>
          </div>
        </div>
      </m-form>
      <div class="form-button"
           v-show="form.enabled">
        <button class="btn primary"
                v-defaultbutton
                @click="updateWIFITimeLimit">{{$t('trans0081')}}</button>
      </div>
    </div>
  </div>
</template>
<script>
import TimezoneOffset from 'base/mixins/timezone-offset';
import { Weeks } from 'base/util/constant';

export default {
  mixins: [TimezoneOffset],
  data() {
    return {
      form: {
        id: '0',
        enabled: false,
        time_begin: '22:00',
        time_end: '07:00',
        bands: ['2.4g', '5g']
      },
      originEnabled: false,
      showErrorTip: false,
      schedules: [
        {
          label: this.$t('trans0086'),
          checked: false,
          value: Weeks.mon
        },
        {
          label: this.$t('trans0087'),
          checked: false,
          value: Weeks.tue
        },
        {
          label: this.$t('trans0088'),
          checked: false,
          value: Weeks.wed
        },
        {
          label: this.$t('trans0089'),
          checked: false,
          value: Weeks.thu
        },
        {
          label: this.$t('trans0090'),
          checked: false,
          value: Weeks.fri
        },
        {
          label: this.$t('trans0091'),
          checked: false,
          value: Weeks.sat
        },
        {
          label: this.$t('trans0092'),
          checked: false,
          value: Weeks.sun
        }
      ]
    };
  },
  watch: {
    schedules: {
      handler: function schedulesHandler() {
        const someChecked = this.schedules.some(n => n.checked);
        if (someChecked) {
          this.showErrorTip = false;
        }
      },
      deep: true
    }
  },
  methods: {
    onEnableChange(enabled) {
      if (!enabled && this.originEnabled) {
        this.updateWIFITimeLimit();
      }
    },
    updateWIFITimeLimit() {
      const schedule = this.schedules.filter(s => s.checked).map(s => s.value);
      if (!schedule.length) {
        this.showErrorTip = true;
        return;
      }
      this.$loading.open();
      this.$http
        .updateWIFITimeLimit({
          ...this.form,
          schedule
        })
        .then(() => {
          this.$loading.close();
          this.originEnabled = this.form.enabled;
          if (this.form.enabled) {
            this.isSameTimezoneOffset().then(result => {
              if (result.same || !result.redirect) {
                this.$toast(this.$t('trans0040'), 3000, 'success');
              }
            });
          } else {
            this.$toast(this.$t('trans0040'), 3000, 'success');
          }
        })
        .catch(() => {
          this.$loading.close();
        });
    },
    getWIFITimeLimit() {
      this.$loading.open();
      this.$http
        .getWIFITimeLimit()
        .then(res => {
          const [first] = res.data.result;
          this.originEnabled = first.enabled;
          this.form = {
            id: first.id,
            enabled: first.enabled,
            time_begin: first.time_begin,
            time_end: first.time_end,
            bands: first.bands
          };
          this.schedules.forEach(s => {
            if (first.schedule.includes(s.value)) {
              s.checked = true;
            }
          });
          this.$loading.close();
        })
        .catch(() => {
          this.$loading.close();
        });
    }
  },
  mounted() {
    this.getWIFITimeLimit();
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
        &.form__item--first {
          margin-bottom: 0;
          padding-bottom: 25px;
        }
        &.schedule-item {
          margin-bottom: 15px;
        }
        .time-picker {
          height: 48px;
        }
      }
      .form-wrapper {
        border-top: 1px solid var(--hr-color);
      }
      .form__advance {
        width: 340px;
        padding-top: 25px;
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
    .schedules {
      position: relative;
      padding-bottom: 15px;
      .schedules__schedule {
        width: 50%;
        margin-bottom: 12px;
        &:nth-last-of-type(1) {
          margin-bottom: 0;
        }
      }
      .schedules__error {
        position: absolute;
        left: 0;
        bottom: 0;
        font-size: 12px;
        color: #ff0001;
        display: inline-block;
        height: 14px;
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
        .form__advance {
          width: auto;
        }
      }
    }
  }
}
</style>
