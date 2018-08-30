<template>
  <layout>
    <div class="wlan-container">
      <div class="step">
        <m-step :steps="steps" :current="current"></m-step>
      </div>
      <div class="step-content">
        <div class="step-item step-item1" v-show="current===0">
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
        <div class="step-item step-item2" v-show="current===1">
          <m-form ref="form2" :model="form2" :rules="form2Rules">
            <m-form-item class="form-item" prop="admin_password">
              <m-input :label="$t('trans0067')" type="password" :disabled="checked" :placeholder="$t('trans0321')" v-model="form2.admin_password" />
            </m-form-item>
            <m-checkbox class="checkbox" v-model="checked" @change="clearAdminPwd()" :text="$t('trans0293')"></m-checkbox>
            <div class="button-container">
              <button @click="step0()" class="btn btn-default ">{{$t('trans0057')}}</button>
              <button @click="step2()" class="btn">{{$t('trans0081')}}</button>
            </div>
          </m-form>
        </div>
        <div class="step-item step-item3" v-show="current===2">
          <img src="../../../assets/images/img_setting.png" alt="">
          <div>{{$t('trans0294')}}{{countdown}}s</div>
          <div style="margin-top:5px;">{{$t('trans0171')}}</div>
          <div class="wifi-info">
            <div class="wifi-info-inner">
              <div>
                <span class="title">{{$t('trans0168')}}</span>:
                <span class="value">{{form1.ssid}}</span>
              </div>
              <div>
                <span class="title">{{$t('trans0172')}}</span>:
                <span class="value">{{form1.password}}</span>
              </div>
              <div>
                <span class="title">{{$t('trans0067')}}</span>:
                <span class="value">{{form2.admin_password}}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  </layout>

</template>
<script>
import mStep from '../../../component/step/index.vue';
import mInput from '../../../component/input/input.vue';
import mCheckbox from '../../../component/checkbox/index.vue';
import mForm from '../../../component/form/index.vue';
import mFormItem from '../../../component/formItem/index.vue';
import layout from '../../../layout.vue';
import { getStringByte, passwordRule } from '../../../../util/util';

export default {
  components: {
    mStep,
    mInput,
    mCheckbox,
    mForm,
    mFormItem,
    layout
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
            rule: value => getStringByte(value) <= 20,
            message: this.$t('trans0261')
          },
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0237')
          }
        ],
        password: [
          {
            rule: value => passwordRule.test(value),
            message: this.$t('trans0169')
          }
        ]
      },
      form2: {
        admin_password: ''
      },
      form2Rules: {
        admin_password: [
          {
            rule: value => passwordRule.test(value),
            message: this.$t('trans0169')
          }
        ]
      }
    };
  },
  mounted() {
    this.$http
      .isinitial()
      .then(res => {
        if (!res.data.result.status) {
          this.$router.push({ path: '/login' });
        }
      })
      .catch(err => {
        if (err.upgrading) {
          return;
        }
        if (err && err.error) {
          this.$toast(this.$t(err.error.code));
        } else {
          this.$router.push({ path: '/unconnect' });
        }
      });
  },
  computed: {
    steps() {
      return [this.$t('trans0324'), this.$t('trans0067'), this.$t('trans0018')];
    }
  },
  methods: {
    clearAdminPwd(v) {
      if (!v) {
        this.form2.admin_password = '';
      }
    },
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
          if (this.countdown === 0) {
            clearInterval(timer);
            this.$router.push({ path: '/unconnect' });
          }
        }, 1000);

        // 提交表单
        this.$http
          .updateMeshConfig({
            wifi: {
              ssid: this.form1.ssid,
              password: this.form1.password
            },
            admin: {
              password: this.form2.admin_password
            }
          })
          .then(() => {
            // 尝试链接路由器
            this.$reconnect({
              onsuccess: () => {
                clearInterval(timer);
                this.$router.push({ path: '/login' });
              },
              ontimeout: () => {
                clearInterval(timer);
                this.$router.push({ path: '/unconnect' });
              }
            });
          })
          .catch(err => {
            if (err.upgrading) {
              return;
            }
            if (err && err.error) {
              this.$toast(this.$t(err.error.code));
            } else {
              this.$router.push({ path: '/unconnect' });
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
  width: 100%;
  flex: auto;
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
      width: 350px;
      text-align: center;
      &.step-item1 {
        .button-container {
          margin-top: 0;
        }
      }
      &.step-item3 {
        .wifi-info {
          margin-top: 30px;
          display: flex;
          .wifi-info-inner {
            display: inline-block;
            margin: 0 auto;
            text-align: left;
            > div {
              margin-top: 10px;
              &:first-child {
                margin-top: 0;
              }
            }
            .title {
              color: #999;
              font-size: 14px;
            }
            .value {
              color: #333;
              font-size: 14px;
              margin-left: 5px;
            }
          }
        }
      }
      img {
        display: block;
        margin: 0 auto;
        width: 100%;
      }
      .form-item {
        text-align: left;
        .checkbox {
          margin-top: 10px;
        }
      }

      .button-container {
        margin-top: 36px;
        display: flex;
        button {
          display: inline-block;
          flex: 1;
          margin-right: 20px;
          width: auto;
          &:last-child {
            margin-right: 0;
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
        width: 100%;
      }
    }
    .button-container {
      margin-top: 10px;
      button {
        &:last-child {
          margin-top: 0;
        }
      }
    }
  }
}
</style>
