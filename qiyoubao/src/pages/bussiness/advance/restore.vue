<template>
  <div class="page">
    <div class="page-content">
      <div class="page-content__main">
        <div class="restore">
          <img :src="require('base/assets/images/common/img_factory_reset.png')">
          <button class="btn"
                  @click.stop="factoryReset">{{$t('trans0205')}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    factoryReset() {
      this.$dialog.confirm({
        okText: this.$t('trans0024'),
        cancelText: this.$t('trans0025'),
        message: this.$t('trans0206'),
        callback: {
          ok: () => {
            this.$http.resetMeshNode({ node_ids: [] }).then(() => {
              this.$reconnect({
                timeout: 90,
                delayTime: 10,
                onsuccess: () => {
                  // this.reset = false;
                  window.location.href = '/';
                },
                ontimeout: () => {
                  window.location.href = '/';
                }
              });
            });
          }
        }
      });
    },
  }
};
</script>

<style lang="scss" scoped>
.restore {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  > img {
    width: 220px;
    height: 220px;
    margin-bottom: 20px;
  }
}
</style>
