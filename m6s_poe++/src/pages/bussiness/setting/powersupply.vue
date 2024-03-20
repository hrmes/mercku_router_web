<template>
  <div class="page">
    <div v-if="$store.state.isMobile"
         class='page-header'>
      Power supply mode
    </div>
    <div class="page-content">
      <div class="page-content__main">
        <div class="row-1">
          <div class="card">
            <m-form-item class="last">
              <h4>Power supply mode</h4>
              <p class="des-tips">Please check the device specifications or consult the manufacturer
                to determine whether your PD (power device) is passive PoE or active PoE.</p>
            </m-form-item>
          </div>
        </div>
        <div class="row-2">
          <div class="card">
            <m-form ref="form"
                    class='form'>
              <m-form-item class="last">
                <m-radio-group v-model="mode"
                               :options="modesList"
                               :bold="true"
                               :needPaddingBgc="true"
                               direction="vertical"></m-radio-group>
              </m-form-item>
            </m-form>
          </div>
        </div>

      </div>
      <div class="page-content__bottom">
        <div class="form-button__wrapper">
          <button class="btn"
                  v-defaultbutton
                  @click.stop="submit">{{$t('trans0081')}}</button>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
import { debounce } from 'base/util/util';
import { RouterPowerSupplyMode } from 'base/util/constant';

export default {
  data() {
    return {
      mode: RouterPowerSupplyMode.active,
      modesList: [
        { value: RouterPowerSupplyMode.active, text: 'Active PoE', description: 'Only supports 48V power receiving devices, not 24V power receiving devices.' },
        { value: RouterPowerSupplyMode.passive, text: 'Passive PoE', description: 'Please ensure that your PD device complies with the IEEE802.3af or 802.3at or 802.3bt standard' }
      ]
    };
  },
  mounted() {
    this.getMeshPowerSupplyMode();
  },
  methods: {
    getMeshPowerSupplyMode() {
      this.$loading.open();
      this.$http.getMeshPowerSupplyMode()
        .then(res => {
          const { data: { result: { mode } } } = res;
          this.mode = mode;
        })
        .finally(() => {
          this.$loading.close();
        });
    },
    submit: debounce(function updateMeshPowerSupplyMode() {
      console.log(this.mode);
      this.$loading.open();
      this.$http.updateMeshPowerSupplyMode({ mode: this.mode })
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
