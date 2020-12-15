<template>
  <div class="page auto-upgrade">
    <div class='page-header'>
      {{$t('trans0743')}}
    </div>
    <div class="page-content">
      <div class="content">
        <div class="content__text">
          {{$t('trans0746')}}
        </div>
        <div class="content__switch">
          <label for="">{{$t('trans0744')}}</label>
          <m-switch v-model="auto_upgrade.enabled"
                    @change="switchAutoUpgrade"></m-switch>
        </div>
        <template v-if="auto_upgrade.enabled">
          <div class="content__line"></div>
          <m-form ref="autoUpgradeForm"
                  :model="auto_upgrade"
                  class="content__item form">
            <m-form-item key="schedule"
                         class="item">
              <m-select :label="$t('trans0082')"
                        v-model="auto_upgrade.schedule"
                        :options="scheduleOption"></m-select>
            </m-form-item>
            <m-form-item key="time"
                         class="item">
              <label class="item__label"
                     for="">{{$t('trans0745')}}</label>
              <m-time-picker class="form__time-picker"
                             v-model="auto_upgrade.time" />
            </m-form-item>
            <m-form-item>
              <button class="btn"
                      v-defaultbutton
                      @click="submit">{{$t('trans0081')}}</button>
            </m-form-item>
          </m-form>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { schedules } from '@/util/constant';

export default {
  data() {
    return {
      auto_upgrade: {
        enabled: false,
        schedule: [schedules[0].value],
        time: '00:59'
      },
      enabledInitialized: false,
      scheduleOption: schedules
    };
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
      this.$loading.open();
      this.$http
        .setMeshAutoUpgrade(this.auto_upgrade)
        .then(() => {
          this.$loading.close();
        })
        .catch(() => {
          this.$loading.close();
        });
    },
    getMeshAutoUpgrade() {
      this.$loading.open();
      this.$http.getMeshAutoUpgrade().then(res => {
        this.$loading.close();
        this.auto_upgrade = res.data.result;
        this.enabledInitialized = this.auto_upgrade.enabled;
      });
    },
    submit() {
      this.$dialog.confirm({
        okText: this.$t('trans0024'),
        cancelText: this.$t('trans0025'),
        message: `${this.$t('trans0747').replace(
          '%s',
          this.schedule[0].label,
          this.auto_upgrade.time
        )}`,
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
  margin: 0 auto;
  width: 340px;
  .content__text {
    font-size: 14px;
    color: #333333;
    text-align: justify;
  }
  .content__line {
    height: 1px;
    background-color: #ebebeb;
    margin-bottom: 20px;
  }
  .content__switch {
    display: flex;
    align-items: center;
    height: 80px;
    label {
      width: 75px;
      font-weight: bold;
      margin-right: 10px;
    }
  }
  .item__label {
    display: block;
    margin-bottom: 5px;
    font-size: 14px;
    font-weight: bold;
    color: #333;
  }
  .form__time-picker {
    width: 100%;
    height: 48px;
    border: solid 1px #e1e1e1;
    padding: 0 17px 0 10px;
  }
}
</style>
