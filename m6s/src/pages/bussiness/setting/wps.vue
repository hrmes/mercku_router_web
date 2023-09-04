<template>
  <div class="page">
    <div v-if="$store.state.isMobile"
         class='page-header'>
      {{$t('trans1168')}}
    </div>
    <div class="page-content">
      <div class="page-content__main">
        <div class="row-1">
          <div class="card">
            <m-form-item class="last">
              <h4>{{$t('trans1168')}}</h4>
              <p class="des-tips">{{$t('trans1169')}}</p>
            </m-form-item>
          </div>
        </div>
        <div class="row-2">
          <div class="card">
            <m-form ref="form"
                    class='form'>
              <m-form-item class="last">
                <m-select :label="$t('trans1170')"
                          v-model="wpsBand"
                          :options="bandList"></m-select>
                <p class="des-tips">{{$t('trans1171')}}</p>
              </m-form-item>
            </m-form>
          </div>
        </div>

      </div>
      <div class="page-content__bottom">
        <div class="form-button__wrapper">
          <button class="btn"
                  v-defaultbutton
                  @click="submit()">{{$t('trans0081')}}</button>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
import { debounce } from 'base/util/util';

export default {
  data() {
    return {
      wpsBand: '2.4g',
      bandList: [
        { value: '2.4g', text: this.$t('trans0677') },
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
        } = response.data;
        bands.forEach(item => {
          if (item.wps_enabled) {
            this.wpsBand = item.band;
          }
        });
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
</style>
