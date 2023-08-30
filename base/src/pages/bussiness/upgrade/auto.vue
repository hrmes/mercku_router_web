<template>
  <div class="page auto-upgrade">
    <div v-if="$store.state.isMobile"
         class='page-header'>
      {{$t('trans0743')}}
    </div>
    <div class="page-content">
      <div class="page-content__main">
        <div class="row-1">
          <div class="card content">
            <m-form-item :class="{last:!auto_upgrade.enabled}">
              <m-switch v-model="auto_upgrade.enabled"
                        :label="$t('trans0744')"
                        @change="switchAutoUpgrade"></m-switch>
              <div class="des-tips">{{ tips }}</div>
            </m-form-item>
            <template v-if="auto_upgrade.enabled">
              <m-form ref="autoUpgradeForm"
                      :model="auto_upgrade"
                      class="content__item form">
                <m-form-item key="schedule">
                  <m-select :label="$t('trans0082')"
                            v-model="auto_upgrade.schedule"
                            :options="scheduleOption"></m-select>
                </m-form-item>
                <m-form-item key="time"
                             class="last">
                  <label class="item__label"
                         for="">{{$t('trans0745')}}</label>
                  <m-time-picker class="form__time-picker"
                                 v-model="auto_upgrade.time" />
                </m-form-item>
              </m-form>
            </template>
          </div>
        </div>
      </div>
      <div class="page-content__bottom"
           v-if="auto_upgrade.enabled">
        <div class="form-button__wrapper">
          <button class="btn"
                  v-defaultbutton
                  @click="submit">{{$t('trans0081')}}</button>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { Weeks } from 'base/util/constant';
import TimezoneOffset from 'base/mixins/timezone-offset';

const maxTrafficThreshold = 500;
export default {
  mixins: [TimezoneOffset],
  data() {
    return {
      auto_upgrade: {
        enabled: false,
        schedule: '',
        time: '00:59'
      },
      enabledInitialized: false,
      scheduleOption: [
        {
          text: this.$t('trans0086'),
          value: Weeks.mon
        },
        {
          text: this.$t('trans0087'),
          value: Weeks.tue
        },
        {
          text: this.$t('trans0088'),
          value: Weeks.wed
        },
        {
          text: this.$t('trans0089'),
          value: Weeks.thu
        },
        {
          text: this.$t('trans0090'),
          value: Weeks.fri
        },
        {
          text: this.$t('trans0091'),
          value: Weeks.sat
        },
        {
          text: this.$t('trans0092'),
          value: Weeks.sun
        }
      ]
    };
  },
  computed: {
    tips() {
      return this.$t('trans0746').format(
        this.auto_upgrade.traffic_threshold || maxTrafficThreshold
      );
    }
  },
  mounted() {
    this.getMeshAutoUpgrade();
  },
  methods: {
    switchAutoUpgrade(enabled) {
      if (!enabled && this.enabledInitialized !== this.auto_upgrade.enabled) {
        this.updateMeshAutoUpgrade();
      }
    },
    updateMeshAutoUpgrade() {
      const autoUpgrade = {
        enabled: this.auto_upgrade.enabled,
        schedule: [this.auto_upgrade.schedule],
        time: this.auto_upgrade.time
      };
      this.$loading.open();
      this.$http
        .setMeshAutoUpgrade(autoUpgrade)
        .then(() => {
          this.$loading.close();
          if (this.auto_upgrade.enabled) {
            this.isSameTimezoneOffset().then(result => {
              if (result.same || !result.redirect) {
                this.$toast(this.$t('trans0040'), 2000, 'success');
              }
            });
          } else {
            this.$toast(this.$t('trans0040'), 2000, 'success');
          }
        })
        .catch(() => {
          this.$loading.close();
        });
    },
    getMeshAutoUpgrade() {
      this.$loading.open();
      this.$http
        .getMeshAutoUpgrade()
        .then(res => {
          this.$loading.close();
          const { result } = res.data;
          this.auto_upgrade.enabled = result.enabled;
          [this.auto_upgrade.schedule] = result.schedule;
          this.auto_upgrade.time = result.time;
          this.enabledInitialized = this.auto_upgrade.enabled;
        })
        .catch(() => {
          this.$loading.close();
        });
    },
    submit() {
      const scheduleSelected = this.scheduleOption.find(
        item => item.value === this.auto_upgrade.schedule
      );
      this.$dialog.confirm({
        okText: this.$t('trans0024'),
        cancelText: this.$t('trans0025'),
        message: this.$t('trans0747').format(
          scheduleSelected.text,
          this.auto_upgrade.time
        ),
        callback: {
          ok: () => {
            this.updateMeshAutoUpgrade();
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.content {
  .content__text {
    width: 340px;
    font-size: 12px;
    color: #999;
    margin-top: 10px;
    padding-bottom: 20px;
  }
  .form-button {
    margin-top: 25px;
    padding-top: 25px;
    border-top: 1px solid var(--hr-color);
  }
  .content__switch {
    display: flex;
    align-items: center;

    label {
      font-weight: bold;
      margin-right: 10px;
    }
  }
  .item__label {
    display: block;
    margin-bottom: 5px;
    font-size: 14px;
    font-weight: bold;
    color: var(--select-label-color);
  }
  .form__time-picker {
    width: 340px;
  }
}
@media screen and (max-width: 768px) {
  .content {
    .form__time-picker {
      width: 100%;
    }
  }
}
</style>
