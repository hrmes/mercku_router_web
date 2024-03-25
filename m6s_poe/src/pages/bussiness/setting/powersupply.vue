<template>
  <div class="page">
    <div v-if="$store.state.isMobile"
         class='page-header'>
      {{$t('trans1239')}}
    </div>
    <div class="page-content">
      <div class="page-content__main">
        <div class="row-1">
          <div class="card">
            <m-form-item class="last">
              <h4 v-if="!$store.state.isMobile"> {{$t('trans1239')}}</h4>
              <p class="des-tips">{{$t('trans1240')}}</p>
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
import { RouterPowerSupplyMode } from 'base/util/constant';

export default {
  data() {
    return {
      mode: RouterPowerSupplyMode.active,
      modesList: [
        { value: RouterPowerSupplyMode.active, text: this.$t('trans1243'), description: this.$t('trans1244') },
        { value: RouterPowerSupplyMode.passive, text: this.$t('trans1241'), description: this.$t('trans1242') }
      ]
    };
  },
  computed: {
    isPassivePoe() {
      return this.mode === RouterPowerSupplyMode.passive;
    }
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
    submit() {
      if (this.isPassivePoe) {
        this.$dialog.confirm({
          title: this.$t('trans0212'),
          okText: this.$t('trans0024'),
          cancelText: this.$t('trans0025'),
          message: this.$t('trans1245'),
          callback: {
            ok: () => {
              this.updateMeshPowerSupplyMode();
            },
            cancel: () => {
              this.mode = RouterPowerSupplyMode.active;
            }
          }
        });
      } else {
        this.updateMeshPowerSupplyMode();
      }
    },
    updateMeshPowerSupplyMode() {
      this.$loading.open();
      this.$http.updateMeshPowerSupplyMode({ mode: this.mode })
        .then(() => {
          this.$toast(this.$t('trans0040'), 3000, 'success');
        })
        .finally(() => {
          this.$loading.close();
        });
    }
  }


};
</script>
<style lang="scss" scoped>
h4 {
  margin: 0;
  padding: 0;
}
</style>
