<template>
  <div class="speed-limit__modal">
    <div class="main"
         key="main">
      <div class="main__title">
        <span>{{$t('trans0014')}}</span>
        <!-- <span class="close btn-icon"
                @click="()=>modalClose()">
            <i class="iconfont icon-ic_close"></i>
          </span> -->
      </div>
      <div class="main__content">
        <div class='form'>
          <div class="item">
            <m-switch :label="$t('trans0462')"
                      v-model="form.enabled"
                      class="enable"></m-switch>
          </div>
          <m-form ref="form"
                  :model="form"
                  :rules='rules'>
            <m-form-item class="item"
                         prop='up'>
              <m-input v-model="form.up"
                       :label="`${$t('trans0304')} (Kbps)`"
                       type='text'
                       :placeholder="`${$t('trans0391')}`"></m-input>
            </m-form-item>
            <m-form-item class="item"
                         prop='down'>
              <m-input v-model="form.down"
                       :label=" `${$t('trans0305')} (Kbps)`"
                       type='text'
                       :placeholder="`${$t('trans0391')}`"></m-input>
            </m-form-item>
          </m-form>
          <div class="btn-container">
            <button class="btn btn-default"
                    @click="()=>modalClose()">{{$t('trans0025')}}</button>
            <button class="btn"
                    @click='submit'>{{$t('trans0081')}}</button>
          </div>
        </div>
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
      return /^[1-9]\d*$/.test(v);
    }
    function Len(v) {
      v = Number(v);
      return v >= 1 && v <= 1000000;
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
            message: this.$t('trans0031')
          },
          {
            rule: value => (value ? Len(value) : true),
            message: this.$t('trans0060')
          }
        ],
        down: [
          {
            rule: value => (value ? speedTest(value) : true),
            message: this.$t('trans0031')
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
    },
  },
  mounted() {
      const limit = this.$store.state.modules.limits[this.mac];
      if (limit && limit.speed_limit) {
        const speed = limit.speed_limit;
        this.form = {
          ...speed,
          up: this.b_to_Kb(speed.up),
          down: this.b_to_Kb(speed.down)
        };
      } else {
        this.getSpeed();
      }
  },
  methods: {
    modalClose() {
      this.$emit('speedLimitClose');
    },
    b_to_Kb(v) {
      if (!v) {
        return '';
      }
      return v / 1000;
    },
    Kb_to_b(v) {
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
      if (this.form.up || this.form.down) {
        if (this.$refs.form.validate()) {
          this.$loading.open();
          const params = {
            enabled: this.form.enabled
          };
          if (this.form.up) {
            params.up = this.Kb_to_b(Number(this.form.up));
          }
          if (this.form.down) {
            params.down = this.Kb_to_b(Number(this.form.down));
          }
          this.$http
            .speedLimitUpdate({
              mac: this.mac,
              speed_limit: params
            })
            .then(() => {
              this.$loading.close();
              this.$store.state.modules.limits[this.mac].speed_limit = params;
              this.$toast(this.$t('trans0040'), 3000, 'success');
              this.modalClose();
              this.$emit('refreshDeviceList');
            })
            .catch(() => {
              this.$loading.close();
            });
        }
      } else {
        this.$toast(this.$t('trans0065'));
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
  background: var(--modal-mask-background-color);
  z-index: 6;
}
.main {
  display: flex;
  flex-direction: column;
  width: 380px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 50px 40px -20px rgba(0, 0, 0, 0.1);
  background-color: var(--modal-content-background);
  z-index: 7;
}
.main__title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 10px;
  .close {
    color: var(--text-default-color);
    background-color: var(--button-close-bgc);
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
          var(--modal-content-background),
          var(--modal-content-background)
        ),
        linear-gradient(104deg, #d6001c, #ee1d4f 42%, #ff6734) !important;
    }
  }
}
@media screen and (max-width: 768px) {
  .speed-limit__modal {
    z-index: 1000;
    .main {
      width: 80%;
    }
  }
}
</style>
