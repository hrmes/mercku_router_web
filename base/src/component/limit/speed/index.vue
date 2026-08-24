<template>
  <div class="speed-limit__modal">
    <div class="main"
         key="main">
      <div class="main__title">
        <span>{{$t('trans0014')}}</span>
      </div>
      <div class="main__content">
        <m-form ref="form"
                :model="form"
                :rules='rules'
                class="form">
          <m-form-item class="item">
            <m-switch :label="$t('trans0462')"
                      v-model="form.enabled"
                      class="enable"></m-switch>
          </m-form-item>

          <m-form-item class="form-item"
                       prop='up'>
            <m-input v-model="form.up"
                     :label="`${$t('trans0304')} (Kbps)`"
                     type='text'
                     :placeholder="`${$t('trans1180')}`"></m-input>
          </m-form-item>
          <m-form-item class="form-item"
                       prop='down'>
            <m-input v-model="form.down"
                     :label=" `${$t('trans0305')} (Kbps)`"
                     type='text'
                     :placeholder="`${$t('trans1180')}`"></m-input>
          </m-form-item>
          <div class="btn-container">
            <button class="btn btn-default"
                    @click="()=>modalClose()">{{$t('trans0025')}}</button>
            <button class="btn"
                    @click='submit'>{{$t('trans0081')}}</button>
          </div>
        </m-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    visiable: { type: Boolean, default: false },
    mac: { type: String, default: '' }
  },
  data() {
    function speedTest(v) {
      return /^[1-9]\d*$/.test(v) && v >= 100;
    }
    function Len(v) {
      v = Number(v);
      return v <= 1000000;
    }
    return {
      form: {
        up: '',
        down: '',
        enabled: false
      },
      rules: {
        up: [
          {
            rule: value => (value ? speedTest(value) : true),
            message: this.$t('trans0687').format('%d', 100, 1000000)
          },
          {
            rule: value => (value ? Len(value) : true),
            message: this.$t('trans0060')
          }
        ],
        down: [
          {
            rule: value => (value ? speedTest(value) : true),
            message: this.$t('trans0687').format('%d', 100, 1000000)
          },
          {
            rule: value => (value ? Len(value) : true),
            message: this.$t('trans0060')
          }
        ]
      }
    };
  },
  computed: {
    isMobile() {
      return this.$store.state.isMobile;
    }
  },
  mounted() {
    const limit = this.$store.state.modules.limits[this.mac];
    if (limit && limit.speed_limit) {
      const speed = limit.speed_limit;
      this.form = {
        ...speed,
        up: this.bps_to_Kbps(speed.up),
        down: this.bps_to_Kbps(speed.down)
      };
    } else {
      this.getSpeed();
    }
  },
  methods: {
    modalClose() {
      this.$emit('speedLimitClose');
    },
    bps_to_Kbps(v) {
      if (!v) {
        return '';
      }
      return v / 1000;
    },
    Kbps_to_bps(v) {
      return v * 1000;
    },
    getSpeed() {
      this.$http.getSpeedLimit({ mac: this.mac }).then(res => {
        const speed = res.data.result;
        this.form = {
          ...speed,
          up: this.b_to_Kb(speed.up),
          down: this.b_to_Kb(speed.down)
        };
      });
    },
    submit() {
      if (this.form.enabled && !this.form.up && !this.form.down) {
        this.$toast(this.$t('trans0065'));
        return;
      }
      if (this.$refs.form.validate()) {
        this.$loading.open();
        const params = {
          enabled: this.form.enabled
        };
        if (this.form.up) {
          params.up = this.Kbps_to_bps(Number(this.form.up));
        } else {
          params.up = 0;
        }
        if (this.form.down) {
          params.down = this.Kbps_to_bps(Number(this.form.down));
        } else {
          params.down = 0;
        }
        this.$http
          .speedLimitUpdate({
            mac: this.mac,
            speed_limit: params
          })
          .then(() => {
            this.$loading.close();
            this.$store.state.modules.limits[this.mac].speed_limit = params;
            this.$toast(this.$t('trans0040'), 2000, 'success');
            this.modalClose();
            this.$emit('refreshDeviceList');
          })
          .catch(() => {
            this.$loading.close();
          });
      }
    }
  }
};
</script>

<style lang="scss">
.speed-limit__modal {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--modal_mask-bgc);
  z-index: 6;
}
.main {
  display: flex;
  flex-direction: column;
  width: 380px;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 50px 40px -20px rgba(0, 0, 0, 0.1);
  background-color: var(--modal_content-bgc);
  z-index: 7;
}
.main__title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 20px;
  .close {
    color: var(--text_default-color);
    background-color: var(--button_close-bgc);
    .iconfont {
      font-size: 12px;
      font-weight: 700;
    }
    &:hover {
      .iconfont {
        color: inherit;
      }
      opacity: 0.8;
    }
  }
}
.main__content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.form {
  .item {
    margin-bottom: 20px;
  }
  .btn-container {
    display: grid;
    grid-template-rows: 100%;
    grid-template-columns: repeat(2, 1fr);
    grid-column-gap: 20px;
    .btn-default {
      background-image: linear-gradient(
          to right,
          var(--modal_content-bgc),
          var(--modal_content-bgc)
        ),
        var(--common_btn_default-bgimg) !important;
    }
  }
}
@media screen and (max-width: 768px) {
  .speed-limit__modal {
    z-index: 1000;
    .main {
      width: 80%;
      padding: 20px;
    }
  }
}
</style>
