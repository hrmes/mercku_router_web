<template>
  <div class="page auto-upgrade">
    <div class='page-header'>
      自动升级
    </div>
    <div class="page-content">
      <div class="content">
        <div class="content__text">
          开启自动升级之后，路由器会在你设定的时间检查并启动升级命令 (当路由器有大流量在运行（>500kbps）时，将不执行自动升级)。
        </div>
        <div class="content__switch">
          <label for="">自动升级</label>
          <m-switch v-model="auto_upgrade.enabled"
                    :onChange="switchAutoUpgrade"></m-switch>
        </div>
        <template v-if="auto_upgrade.enabled">
          <div class="content__line"></div>
          <m-form ref="autoUpgradeForm"
                  :model="auto_upgrade"
                  :rules="rules"
                  class="content__item form">
            <m-form-item key="schedule"
                         class="item"
                         prop="schedule">
              <m-select label="重复"
                        v-model="auto_upgrade.schedule"
                        :options="scheduleOption"></m-select>
            </m-form-item>
            <m-form-item key="time"
                         class="item"
                         prop="time">
              <label class="item__label"
                     for="">升级时间</label>
              <m-time-picker custom-class="form__time-picker"
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
const Schedule = {
  mon: 'Mon',
  tue: 'Tue',
  wed: 'Wed',
  thu: 'Thu',
  fri: 'Fri',
  sat: 'Sat',
  sun: 'Sun'
};
export default {
  data() {
    return {
      auto_upgrade: {
        mesh_id: '',
        enabled: false,
        schedule: [],
        time: '23:59'
      },
      enabledInitialized: false,
      rules: {
        schedule: {
          rule: value => value.length,
          message: this.$t('trans0237')
        },
        time: {
          rule: value => !/^\s*$/g.test(value.trim()),
          message: this.$t('trans0237')
        }
      },
      scheduleOption: [
        {
          value: Schedule.mon,
          text: 'Mon'
        },
        {
          value: Schedule.tue,
          text: 'Tue'
        },
        {
          value: Schedule.wed,
          text: 'Wed'
        },
        {
          value: Schedule.thu,
          text: 'Thu'
        },
        {
          value: Schedule.fri,
          text: 'Fri'
        },
        {
          value: Schedule.sat,
          text: 'sat'
        },
        {
          value: Schedule.sun,
          text: 'Sun'
        }
      ]
    };
  },
  mounted() {
    // this.getMeshAutoUpgrade();
  },
  methods: {
    switchAutoUpgrade(enabled) {
      if (!enabled) {
        if (this.enabledInitialized !== this.auto_upgrade.enabled) {
          this.updateMeshAutoUpgrade();
        }
      }
    },
    updateMeshAutoUpgrade() {
      this.$loading.open();
      this.$http
        .setMeshAutoUpgrade(this.auto_upgrade)
        .then(() => {
          this.$loading.close();
          this.$toast(this.$t('trans0040'), 3000, 'success');
        })
        .catch(() => {
          this.$loading.close();
        });
    },
    getMeshAutoUpgrade() {
      this.$loading.open();
      this.$http.getMeshAutoUpgrade().then(res => {
        this.$loading.close();
        const data = res.data.result;
        this.auto_upgrade = data;
        this.enabledInitialized = this.auto_upgrade.enabled;
      });
    },
    submit() {
      //
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
