<template>
  <div class="page">
    <div class="page-header">
      {{$t('trans0539')}}
    </div>
    <div class="page-content">
      <div class="form">
        <m-form-item>
          <m-radio-group v-model="mode"
                         :options="modes"
                         direction="vertical"></m-radio-group>
          <p class="note">{{$t('trans0543')}}</p>
        </m-form-item>

      </div>
      <div class="form-button">
        <button class="btn primary"
                v-defaultbutton
                @click="updateMode">{{$t('trans0081')}}</button>
      </div>`
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
                  onsuccess: () => {
                    this.$toast(this.$t('trans0040'), 3000, 'success');
                    // 如果修改了模式，则跳转到登录页面，否则停留在当前页面
                    if (this.$store.mode !== this.mode) {
                      this.$store.mode = this.mode;
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
.page-content {
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.form {
  width: 340px;
  .note {
    color: #999;
    font-size: 12px;
    margin: 0;
    margin-top: 5px;
    padding-left: 26px;
  }
}
@media screen and (max-width: 768px) {
  .form {
    width: 100%;
  }
}
</style>
