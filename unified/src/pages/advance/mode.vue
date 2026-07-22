<template>
  <div class="page">
    <div v-if="$store.state.isMobile"
         class="page-header">
      {{$t('trans0539')}}
    </div>
    <div class="page-content">
      <div class="page-content__main">
        <div class="row-1">
          <div class="card"
               data-e2e="mode-form-card">
            <m-form>
              <m-form-item class="last">
                <m-radio-group v-model="mode"
                               data-e2e="mode-options"
                               :options="modes"
                               direction="vertical"></m-radio-group>
                <p class="des-tips">{{$t('trans0543')}}</p>
              </m-form-item>
            </m-form>
          </div>
        </div>
      </div>
      <div class="page-content__bottom">
        <div class="form-button__wrapper">
          <button class="btn primary"
                  data-e2e="mode-submit"
                  v-defaultbutton
                  @click="updateMode">{{$t('trans0081')}}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  computed: {},
  data() {
    return {
      mode: 'router',
      modes: [
        {
          text: this.$t('trans0541'),
          value: 'router'
        },
        {
          text: this.$t('trans0542'),
          value: 'bridge'
        }
      ]
    };
  },
  mounted() {
    this.getMode();
  },
  methods: {
    getMode() {
      this.$loading.open();
      this.$http
        .getMeshMode()
        .then(res => {
          this.mode = res.data.result.mode;
          this.$loading.close();
        })
        .catch(() => {
          this.$loading.close();
        });
    },
    updateMode() {
      this.$dialog.confirm({
        okText: this.$t('trans0024'),
        cancelText: this.$t('trans0025'),
        message: this.$t('trans0229'),
        callback: {
          ok: () => {
            this.$loading.open();
            this.$http
              .updateMeshMode({ mode: this.mode })
              .then(() => {
                this.$loading.close();
                this.$reconnect({
                  timeout: 120,
                  delayMs: this.$store.getters.behavior.modeSwitchProbeStartDelayMs,
                  onsuccess: () => {
                    this.$toast(this.$t('trans0040'), 2000, 'success');
                    if (this.$store.state.mode !== this.mode) {
                      this.$store.commit('setMode', this.mode);
                      this.$router.push({ path: '/login' });
                    }
                  },
                  ontimeout: () => {
                    this.$router.push({ path: '/unconnect' });
                  }
                });
              })
              .catch(() => {
                this.$loading.close();
              });
          }
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.des-tips {
  padding-left: 25px;
}
</style>
