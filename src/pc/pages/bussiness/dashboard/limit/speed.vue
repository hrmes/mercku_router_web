<template>
  <layout>
    <div class="device-speed-container">
      <div class="content">
        <div class='w-header'>
          {{$t('trans0014')}}
        </div>
        <div class='form'>
          <div class='input-info'>
            <div class="check-info">
              <label for=""> {{$t('trans0369')}} </label>
              <m-switch v-model="form.enabled" :onChange="changehandle" />
            </div>
            <m-form ref="form" :model="form" :rules='rules'>
              <m-form-item class="item" prop='up'>
                <m-input v-model="form.up" :label="`${$t('trans0304')}(KB/s)`" type='text' :placeholder="`${$t('trans0321')}`" :disabled='disabled'></m-input>
              </m-form-item>
              <m-form-item class="item" prop='down'>
                <m-input v-model="form.down" :label=" `${$t('trans0305')}(KB/s)`" type='text' :placeholder="`${$t('trans0321')}`" :disabled='disabled'></m-input>
              </m-form-item>
            </m-form>
            <div class="btn-info">
              <button class="btn" :disabled='disabled' @click='submit'>{{$t('trans0081')}}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </layout>
</template>
<script>
import Switch from '../../../../component/switch/index.vue';
import Input from '../../../../component/input/input.vue';
import Form from '../../../../component/form/index.vue';
import FormItem from '../../../../component/formItem/index.vue';
import layout from '../../../../layout.vue';

export default {
  components: {
    'm-switch': Switch,
    'm-form-item': FormItem,
    'm-form': Form,
    'm-input': Input,
    layout
  },
  data() {
    function speedTest(v) {
      return /^[1-9]\d*$/.test(v) && Number(v) < 1000 * 1024;
    }
    return {
      disabled: true,
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
            message: this.$t('trans0060')
          }
        ],
        down: [
          {
            rule: value => (value ? speedTest(value) : true),
            message: this.$t('trans0060')
          }
        ]
      }
    };
  },
  mounted() {
    this.mac = this.$route.params.mac;
    if (
      this.$store.state.limits.speed &&
      this.$store.state.limits.speed.speed_limit
    ) {
      const speed = this.$store.state.limits.speed.speed_limit;
      console.log(speed);
      this.disabled = !speed.enabled;
      this.form = {
        ...speed,
        up: this.b_to_KB(speed.up),
        down: this.b_to_KB(speed.down)
      };
    }
  },
  methods: {
    b_to_KB(v) {
      if (v === 0) {
        return '';
      }
      return v / (8 * 1024);
    },
    KB_to_b(v) {
      return v * (8 * 1024);
    },
    changehandle(v) {
      this.$loading.open();
      this.form.enabled = v;
      this.$http
        .speedLimitUpdate({
          mac: this.mac,
          speed_limit: {
            enabled: v
          }
        })
        .then(() => {
          this.$loading.close();
          this.disabled = !v;
          this.$toast(this.$t('trans0040'), 3000, 'success');
        })
        .catch(err => {
          if (err.upgrading) {
            return;
          }
          this.$loading.close();
          if (err && err.error) {
            this.$toast(this.$t(err.error.code));
          } else {
            this.$router.push({ path: '/unconnect' });
          }
        });
    },
    submit() {
      if (this.form.up || this.form.down) {
        this.$loading.open();
        if (this.$refs.form.validate()) {
          this.$http
            .speedLimitUpdate({
              mac: this.mac,
              speed_limit: {
                ...this.form,
                up: this.form.up ? this.KB_to_b(Number(this.form.up)) : 0,
                down: this.form.down ? this.KB_to_b(Number(this.form.down)) : 0
              }
            })
            .then(() => {
              this.$loading.close();
              this.$toast(this.$t('trans0040'), 3000, 'success');
            })
            .catch(err => {
              if (err.upgrading) {
                return;
              }
              this.$loading.close();
              if (err && err.error) {
                this.$toast(this.$t(err.error.code));
              } else {
                this.$router.push({ path: '/unconnect' });
              }
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
.device-speed-container {
  flex: auto;
  padding: 0 2%;
  display: flex;
  .ssid-hidden {
    margin-bottom: 30px;
  }
  position: relative;
  .content {
    border-radius: 8px;
    padding: 0 20px;
    background: white;
    position: relative;
    flex: 1;
    .w-header {
      height: 60px;
      border-bottom: 1px solid #f1f1f1;
      font-size: 16px;
      color: #333333;
      line-height: 60px;
      font-weight: 400;
    }
    .form {
      display: flex;
      justify-content: center;
      padding: 30px 0;

      .btn-info {
        margin-top: 30px;
      }
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
  }
}
@media screen and (max-width: 768px) {
  .device-speed-container {
    padding: 20px 16px;
    .content {
      .w-header {
        font-size: 14px;
        height: 44px;
        line-height: 44px;
      }
      min-height: 450px;
      .form {
        width: 100%;

        .input-info {
          width: 100%;
        }
        .title {
          margin-top: 20px;
          margin-bottom: 10px;
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
        .btn-info {
          margin-top: 30px;
        }
      }
    }
  }
}
</style>

