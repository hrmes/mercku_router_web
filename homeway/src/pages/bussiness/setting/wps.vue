<template>
  <div class="page">
    <div class='page-header'>{{$t('trans0794')}}</div>
    <div class="page-content">
      <m-form>
        <m-form-item>
          <h4>{{$t('trans0794')}}</h4>
          <p class="des-tips">{{$t('trans1120')}}</p>
        </m-form-item>
        <m-form-item>
          <m-select label="Wi-Fi"
                    v-model="wpsEnabledBand"
                    :disabled="wpsIsEnabled"
                    :options="bandList"></m-select>
          <p class="des-tips">{{$t('trans1122')}}</p>
        </m-form-item>
        <m-form-item>
          <button class="btn"
                  v-defaultbutton
                  :disabled="wpsIsEnabled"
                  @click="submit()">{{wpsIsEnabled?`${$t('trans1124')}${formatTime(wpsRemainingTime)}`:$t('trans0462')}}</button>
        </m-form-item>
      </m-form>
    </div>
  </div>
</template>
<script>
import { debounce } from 'base/util/util';

export default {
  data() {
    return {
      wpsRemainingTime: 0,
      wpsEnabledBand: '2g',
      bandList: [
        { value: '2g', text: this.$t('trans0677') },
        { value: '5g', text: this.$t('trans0679') }
      ],
      countdownTimer: null
    };
  },
  computed: {
    wpsIsEnabled() {
      return this.wpsRemainingTime > 0;
    }
  },
  mounted() {
    this.getWps();
  },
  beforeDestroy() {
    this.clearIntervalTask();
  },
  methods: {
    async getWps() {
      try {
        this.$loading.open();
        const response = await this.$http.getMeshWps();

        const { data: { result: { bands } } } = response;
        const { data: { result: { remaining_duration: remain } } } = response;

        this.wpsRemainingTime = remain;
        this.wpsEnabledBand = bands.find(band => band.wps_enabled).band;

        if (this.wpsIsEnabled) {
          this.setWpsCountdown();
        } else { // WPS是关闭的状态下，不再需要轮询getWps
          this.clearIntervalTask();
        }
      } catch (error) {
        this.clearIntervalTask();
        this.wpsRemainingTime = 0;
      } finally {
        this.$loading.close();
      }
    },
    clearIntervalTask() {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    },
    submit: debounce(function updateWps() {
      this.$loading.open();
      this.$http
        .updateMeshWps({ band: this.wpsEnabledBand, wps_enabled: true })
        .then(() => {
          this.getWps();
          this.$toast(this.$t('trans0040'), 3000, 'success');
        })
        .finally(() => {
          this.$loading.close();
        });
    }, 500),
    setWpsCountdown() {
      this.clearIntervalTask();
      if (this.wpsIsEnabled) {
        this.createIntervalTask();
      }
    },
    createIntervalTask() {
      if (this.wpsRemainingTime > 0) {
        this.clearIntervalTask();
        this.wpsRemainingTime -= 1; // 倒计时应该少1s
        this.countdownTimer = setInterval(() => {
          this.wpsRemainingTime -= 1;
          if (this.wpsRemainingTime <= 0) {
            clearInterval(this.countdownTimer);
            this.countdownTimer = null;
          }
        }, 1000);
      }
    },
    formatTime(time) {
      if (time === -1) {
        return this.$t('trans0530');
      }
      const arr = [60, 60];
      const temp = ['00', '00'];
      let index = 0;
      let a = time;
      let b = 0;
      const topArr = [];
      while (index <= arr.length && a > 0) {
        if (index === arr.length) {
          b = a;
        } else {
          b = a % arr[index];
        }
        a = parseInt(a / arr[index], 10);
        if (b < 10) {
          b = `0${b}`;
        }
        topArr.push(b);
        index += 1;
      }
      const topStr = temp
        .map((n, j) => {
          if (topArr[j]) {
            return topArr[j];
          }
          return n;
        })
        .reverse()
        .join(' : ');
      return topStr;
    },
  }
};
</script>
<style lang="scss" scoped>
h4 {
  margin: 0;
  padding: 0;
}
.page {
  .page-content {
    width: 340px;
    margin: 0 auto;
  }
}
</style>
