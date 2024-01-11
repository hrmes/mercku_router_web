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
                  v-defaultbutton
                  @click="submit()">{{$t('trans0462')}}</button>
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
      bandList: [
        { value: '2g', text: this.$t('trans0677') },
        { value: '5g', text: this.$t('trans0679') }
      ]
    };
  },
  mounted() {
    this.getWps();
  },
  methods: {
    async getWps() {
      try {
        this.$loading.open();
        const response = await this.$http.getMeshWps();
        const {
          data: {
            result: { bands }
          }
        } = response;
        let showFirst = false;
        bands.forEach(item => {
          if (item.wps_enabled) {
            this.wpsBand = item.band;
            if (item.band === '2g') showFirst = true;
          }
        });
        if (showFirst) this.wpsBand = '2g';
      } catch (error) {
        console.error(error);
      } finally {
        this.$loading.close();
      }
    },
    submit: debounce(function updateWps() {
      this.$loading.open();
      this.$http
        .updateMeshWps({ band: this.wpsBand, wps_enabled: true })
        .then(() => {
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
