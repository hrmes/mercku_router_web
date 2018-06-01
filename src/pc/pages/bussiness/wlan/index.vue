<template>
  <div class="wlan-container">
    <div class="step">
      <m-step :steps="steps" :current="current"></m-step>
    </div>
    <div class="step-content">
      <div class="step-item" v-if="current===0">
        <m-form ref="form1" :model="form1" :rules="form1Rules">
          <m-form-item class="form-item" prop="ssid">
            <m-input :label="$t('trans0168')" :placeholder="$t('trans0321')" v-model="form1.ssid" />
          </m-form-item>
          <m-form-item class="form-item" prop="password">
            <m-input :label="$t('trans0172')" type="password" :placeholder="$t('trans0321')" v-model="form1.password" />
          </m-form-item>
          <div class="button-container">
            <button @click="step1()" class="btn">{{$t('trans0055')}}</button>
          </div>
        </m-form>

      </div>
      <div class="step-item" v-if="current===1">
        <m-form ref="form2" :model="form2" :rules="form2Rules">
          <m-form-item class="form-item">
            <m-input :label="$t('trans0067')" type="password" :disabled="checked" :placeholder="$t('trans0321')" v-model="form2.admin_password" />
            <m-checkbox class="checkbox" v-model="checked" :text="$t('trans0293')"></m-checkbox>
          </m-form-item>
          <div class="button-container">
            <button @click="step0()" class="btn">{{$t('trans0057')}}</button>
            <button @click="step2()" class="btn">{{$t('trans0081')}}</button>
          </div>
        </m-form>
      </div>
      <div class="step-item" v-if="current===2">
        <img src="../../../assets/images/img_setting.png" alt="">
        <span>{{$t('trans0294')}}{{countdown}}s</span>
      </div>
    </div>

  </div>

</template>
<script>
import mStep from '../../../component/step/index.vue';
import mInput from '../../../component/input/input.vue';
import mCheckbox from '../../../component/checkbox/index.vue';
import mForm from '../../../component/form/index.vue';
import mFormItem from '../../../component/formItem/index.vue';

export default {
  components: {
    mStep,
    mInput,
    mCheckbox,
    mForm,
    mFormItem
  },
  data() {
    return {
      current: 0,
      checked: false,
      countdown: 60,
      form1: {
        ssid: '',
        password: ''
      },
      form1Rules: {
        ssid: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0237')
          },
          { rule: value => /^.{1,20}$/g.test(value), message: this.$t('trans0261') }
        ],
        password: [
          { rule: value => !/\s/g.test(value), message: this.$t('trans0228') },
          { rule: value => /^[a-zA-Z0-9\W_]{8,24}$/g.test(value), message: this.$t('trans0169') }
        ]
      },
      form2: {
        admin_password: ''
      },
      form2Rules: {
        admin_password: [
          { rule: value => !/\s/g.test(value), message: this.$t('trans0228') },
          { rule: value => /^[a-zA-Z0-9\W_]{8,24}$/g.test(value), message: this.$t('trans0169') }
        ]
      }
    };
  },
  mounted() {
    this.$http
      .isinitial()
      .then(res => {
        if (!res.data.result.status) {
          // /this.$router.push({ path: '/login' });
        }
      })
      .catch(err => {
        if (err && err.error) {
          this.$toast(this.$t(err.error.code));
        } else {
          this.$toast(this.$t('trans0039'));
        }
      });
  },
  computed: {
    steps() {
      return [this.$t('trans0167'), this.$t('trans0295'), this.$t('trans0296')];
    }
  },
  methods: {
    step0() {
      this.current = 0;
    },
    step1() {
      if (this.$refs.form1.validate()) {
        this.current = 1;
      }
    },
    step2() {
      if (this.$refs.form2.validate()) {
        this.current = 2;
        const timer = setInterval(() => {
          this.countdown -= 1;
        }, 1000);

        // 清除认证状态
        this.authorize.set(false);
        // 提交表单
        this.$http
          .update({
            wifi: {
              ssid: this.form1.ssid,
              password: this.form1.password,
              admin_password: this.form2.admin_password
            }
          })
          .then(() => {
            // 尝试链接路由器
            const timer1 = setInterval(() => {
              if (this.countdown > 0) {
                this.$http.getRouter().then(() => {
                  clearInterval(timer);
                  clearInterval(timer1);
                  this.$router.push({ path: '/login' });
                });
              } else {
                clearInterval(timer);
                clearInterval(timer1);
                this.$router.push({ path: '/disappear' });
              }
            }, 10000);
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
    checked(newVal) {
      if (newVal === true) {
        this.form2.admin_password = this.form1.password;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.wlan-container {
  position: absolute;
  top: 60px;
  width: 100%;
  bottom: 0;
  background: #fff;
  .step {
    text-align: center;
    width: 800px;
    margin: 0 auto;
    margin-top: 50px;
  }
  .step-content {
    margin: 50px 0;
    text-align: center;
    .step-item {
      display: inline-block;
      text-align: center;
      img {
        display: block;
        margin: 0 auto;
      }
      .form-item {
        margin-top: 20px;
        text-align: left;
        .checkbox {
          margin-top: 10px;
        }
        &:first-child {
          margin-top: 0;
        }
      }
      .button-container {
        margin-top: 50px;
        button {
          display: block;
          margin-top: 10px;
          &.first-child {
            margin-top: 0;
          }
        }
      }
    }
  }
}
@media screen and(max-width: 768px) {
  .wlan-container {
    position: static;
    overflow: hidden;
    .step {
      width: 100%;
    }
    .step-content {
      width: 80%;
      margin: 50px auto;
      .step-item {
        display: block;
      }
    }
  }
}
</style>
