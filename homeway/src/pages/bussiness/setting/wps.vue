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
                    v-model="wpsBand"
                    :options="bandList"></m-select>
          <p class="des-tips">{{$t('trans1122')}}</p>
        </m-form-item>
        <m-form-item>
          <button class="btn"
                  :disabled="wpsIsEnabled"
                  v-defaultbutton
                  @click="submit()">{{wpsIsEnabled?'WPS正在启用中...':$t('trans0462')}}</button>
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
      wpsBand: '2g',
      wpsIsEnabled: false,
      bandList: [
        { value: '2g', text: this.$t('trans0677') },
        { value: '5g', text: this.$t('trans0679') }
      ]
    };
  },
  mounted() {
    this.getWps();
  },
  beforeDestroy() {
    this.clearIntervalTask();
  },
  methods: {
    async getWps(isFirstEnterPage = true) {
      try {
        // Show loading when user is first entering into page
        if (isFirstEnterPage) {
          this.$loading.open();
        }

        const response = await this.$http.getMeshWps();
        let {
          data: {
            result: { bands }
          }
        } = response;
        bands = [
          {
            band: '2g',
            wps_enabled: false
          },
          {
            band: '5g',
            wps_enabled: false
          }
        ];
        this.wpsIsEnabled = bands.some(item => {
          if (item.wps_enabled) {
            this.wpsBand = item.band;
          }
          return item.wps_enabled;
        });

        // WPS每开启一次,有效时长为2分钟, WPS启用期间需要轮询getWps接口,
        // 目的为了界面能及时更新WPS2分钟超时之后的关闭的状态，在这之后WPS才能够再次触发
        if (this.wpsIsEnabled) {
          this.clearIntervalTask();
          this.pollTimer = setTimeout(() => {
            this.getWps(false);
          }, 5000);
        } else { // WPS是关闭的状态下，不再需要轮询getWps
          this.clearIntervalTask();
        }
      } catch {
        this.clearIntervalTask();
        this.wpsIsEnabled = false;
      } finally {
        this.$loading.close();
      }
    },
    clearIntervalTask() {
      clearTimeout(this.pollTimer);
      this.pollTimer = null;
    },
    submit: debounce(function updateWps() {
      this.$loading.open();
      this.$http
        .updateMeshWps({ band: this.wpsBand, wps_enabled: true })
        .then(() => {
          this.getWps();
          this.$toast(this.$t('trans0040'), 3000, 'success');
        })
        .finally(() => {
          this.$loading.close();
        });
    }, 500)
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
