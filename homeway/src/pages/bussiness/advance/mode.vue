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
        </m-form-item>
      </div>
      <div class="form-button">
        <button class="btn primary"
                v-defaultbutton
                @click="updateMode"
                v-show="modeHasChange">{{$t('trans0081')}}</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  computed: {},
  data() {
    return {
      currentMode: '',
      modeHasChange: false,
      mode: 'router',
      modes: [
        {
          text: this.$t('trans1066'),
          value: 'bridge'
        },
        {
          text: this.$t('trans1059'),
          value: 'wireless_bridge'
        },
        {
          text: this.$t('trans0541'),
          value: 'router'
        },
      ]
    };
  },
  mounted() {
    this.getMode();
  },
  watch: {
    mode(nv) {
      if (this.currentMode === nv) {
        // 模式没变化，就隐藏修改模式按钮
        this.modeHasChange = false;
      } else {
        // 模式有变化，就展示修改模式按钮
        this.modeHasChange = true;
      }
    }
  },
  methods: {
    getMode() {
      this.$loading.open();
      this.$http
        .getMeshMode()
        .then(res => {
          this.currentMode = res.data.result.mode;
          this.$loading.close();
        })
        .catch(() => {
          this.$loading.close();
        });
    },
    updateMode() {
      // 如果提交的mode为有线桥，就要检测是否插入网线，未插入就提示用户
      if (this.mode === 'bridge') {
        // <----------------监测网口是否插入网线接口调用--------------------->
        // 1.如果没有插入网线
        this.$dialog.confirm({
          okText: this.$t('trans0024'),
          cancelText: this.$t('trans0025'),
          message: [this.$t('trans1063'), this.$t('trans1065')],
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
        // 2.插入了网线,直接进行mode update
      }
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
