<template>
  <div class="setting-wifi-container">
    <div class="content">
      <div class='w-header'>
        {{$t('trans0167')}}
      </div>
      <div class='form'>
        <div class='input-info'>
          <m-form ref="form" :model="form" :rules='rules'>
            <m-form-item class="item" prop='ssid'>
              <m-input v-model="form.ssid" :label="$t('trans0168')" type='text' :placeholder="`${$t('trans0321')}`"></m-input>
            </m-form-item>
            <m-form-item class="item" prop='password'>
              <m-input v-model="form.password" :label="$t('trans0172')" type='password' :placeholder="`${$t('trans0321')}`"></m-input>
            </m-form-item>
          </m-form>
          <div class="check-info">
            <label for=""> {{$t('trans0255')}}</label>
            <m-switch v-model="form.bands[`2.4G`].enabled" />
            <label for="" style="margin-left:40px"> {{$t('trans0256')}}</label>
            <m-switch v-model="form.bands[`5G`].enabled" />
          </div>
          <div class="btn-info">
            <button class="btn" @click='submit()'>{{$t('trans0081')}}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Switch from '../../../component/switch/index.vue';
import Input from '../../../component/input/input.vue';
import Form from '../../../component/form/index.vue';
import FormItem from '../../../component/formItem/index.vue';

export default {
  components: {
    'm-switch': Switch,
    'm-form-item': FormItem,
    'm-form': Form,
    'm-input': Input
  },
  data() {
    return {
      band1: true,
      band2: true,
      form: {
        ssid: '',
        password: '',
        bands: {
          '2.4G': { enabled: true },
          '5G': { enabled: true }
        }
      },
      rules: {
        ssid: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0237')
          },
          {
            rule: value => /^.{1,20}$/g.test(value),
            message: this.$t('trans0261')
          }
        ],
        password: [
          { rule: value => !/\s/g.test(value), message: this.$t('trans0228') },
          {
            rule: value => /^[a-zA-Z0-9\W_]{8,24}$/g.test(value),
            message: this.$t('trans0169')
          }
        ]
      }
    };
  },
  methods: {
    showPsd() {
      this.isPsd = !this.isPsd;
    },
    submit() {
      if (this.$refs.form.validate()) {
        this.$http
          .update({
            // .getRouter({
            wifi: this.form
          })
          .then(res => {
            this.$dialog.info({});
            this.$reconnect({
              onsuccess: () => {
                this.$router.push({ path: '/home' });
              },
              ontimeout: () => {
                this.$router.push({ path: '/disappear' });
              },
              onprogress: percent => {
                console.log(percent);
              }
            });
            console.log(res);
          })
          .catch(err => {
            if (err && err.error) {
              this.$toast(this.$t(err.error.code));
            } else {
              this.$toast(this.$t('trans0039'));
            }
          });
      }
    }
  },
  watch: {
    form: {
      handler() {
        // const l = this.form.bands['2.4G'].enabled;
        // const h = this.form.bands['5G'].enabled;
        this.form.bands['2.4G'].enabled = false;
        console.log(this.form);
      },
      deep: true
    }
  },
  mounted() {
    // console.log('validatate result:', this.$refs.form.validate());
  }
};
</script>
<style lang="scss" scoped>
.setting-wifi-container {
  position: relative;
  padding: 0 30px;
  // height: 100%;
  .content {
    border-radius: 8px;
    padding: 0 20px;
    background: white;
    // height: 95%;
    position: relative;
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
      .item {
        // margin-bottom: 20px;
      }

      .btn-info {
        margin-top: 40px;
      }
      .check-info {
        display: flex;
        align-items: center;
        label {
          margin-right: 10px;
          font-size: 16px;
          color: #333333;
        }
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .setting-wifi-container {
    padding: 10px;
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
            margin-right: 10px;
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

