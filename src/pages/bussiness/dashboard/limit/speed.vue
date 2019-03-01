<template>
  <div class="page">
    <div class='page-header'>
      {{$t('trans0014')}}
    </div>
    <div class="page-content">
      <div class='form'>
        <div class='input-info'>
          <m-form ref="form"
                  :model="form"
                  :rules='rules'>
            <m-form-item class="item"
                         prop='up'>
              <m-input v-model="form.up"
                       :label="`${$t('trans0304')} (KB/s)`"
                       type='text'
                       :placeholder="`${$t('trans0391')}`"></m-input>
            </m-form-item>
            <m-form-item class="item"
                         prop='down'>
              <m-input v-model="form.down"
                       :label=" `${$t('trans0305')} (KB/s)`"
                       type='text'
                       :placeholder="`${$t('trans0391')}`"></m-input>
            </m-form-item>
          </m-form>
          <div class="form-item">
            <m-checkbox :text="$t('trans0462')"
                        v-model="form.enabled"></m-checkbox>
          </div>
          <div class="form-item">
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
  data() {
    function speedTest(v) {
      return /^[1-9]\d*$/.test(v);
    }
    function Len(v) {
      return /^[1-9]\d{0,5}$/.test(v);
    }
    return {
      mac: '',
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
  mounted() {
    this.mac = this.$route.params.mac;
    if (
      this.$store.modules.limits.speed &&
      this.$store.modules.limits.speed.speed_limit
    ) {
      const speed = this.$store.modules.limits.speed.speed_limit;
      this.form = {
        ...speed,
        up: this.b_to_KB(speed.up),
        down: this.b_to_KB(speed.down)
      };
    }
    this.getSpeed();
  },
  methods: {
    b_to_KB(v) {
      if (!v) {
        return '';
      }
      return v / (8 * 1000);
    },
    KB_to_b(v) {
      return v * (8 * 1000);
    },
    getSpeed() {
      this.$http.getSpeedLimit({ mac: this.mac }).then(res => {
        const speed = res.data.result;
        this.form = {
          ...speed,
          up: this.b_to_KB(speed.up),
          down: this.b_to_KB(speed.down)
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
            params.up = this.KB_to_b(Number(this.form.up));
          }
          if (this.form.down) {
            params.down = this.KB_to_b(Number(this.form.down));
          }
          this.$http
            .speedLimitUpdate({
              mac: this.mac,
              speed_limit: params
            })
            .then(() => {
              this.$loading.close();
              this.$store.modules.limits.speed = {
                speed_limit: params
              };
              this.$toast(this.$t('trans0040'), 3000, 'success');
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
<style lang="scss" scoped>
.form {
  display: flex;
  justify-content: center;
  .check-info {
    display: flex;
    align-items: center;
    position: relative;
    margin-bottom: 30px;
    label {
      margin-right: 30px;
      font-size: 14px;
      color: #333333;
    }
    .tool {
      position: relative;
      width: 30px;
      img {
        position: relative;
        top: -8px;
        cursor: pointer;
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .form {
    .input-info {
      width: 100%;
    }
    .check-info {
      display: flex;
      align-items: center;
      margin-top: 20px;
      label {
        margin-right: 2px;
        font-size: 16px;
        color: #333333;
      }
    }
  }
}
</style>
