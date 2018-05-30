<template>
  <div class="wlan-container">
    <div class="step">
      <m-step :steps="steps" :current="current"></m-step>
    </div>
    <div class="step-content">
      <div class="step-item" v-if="current===0">
        <div class="form-item">
          <label for="">
            <span>{{$t('trans0168')}}</span>
          </label>
          <m-input :placeholder="$t('trans0321')" v-model="ssid" />
        </div>
        <div class="form-item">
          <label for="">
            <span>{{$t('trans0172')}}</span>
          </label>
          <m-input type="password" :placeholder="$t('trans0321')" v-model="ssid" />
        </div>
        <div class="button-container">
          <button @click="step1()" class="btn">{{$t('trans0055')}}</button>
        </div>
      </div>
      <div class="step-item" v-if="current===1">
        <div class="form-item">
          <label for="">
            <span>{{$t('trans0067')}}</span>
          </label>
          <m-input type="password" :placeholder="$t('trans0321')" v-model="ssid" />
        </div>
        <div class="button-container">
          <button @click="step2()" class="btn">{{$t('trans0081')}}</button>
        </div>
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
export default {
  components: {
    mStep,
    mInput
  },
  data() {
    return {
      current: 0,
      ssid: '',
      password: '',
      checked: false,
      admin_password: '',
      countdown: 60
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
    step1() {
      this.current = 1;
    },
    step2() {
      this.current = 2;
      //提交表单
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
    margin-top: 50px;
    text-align: center;
    width: 800px;
    margin: 0 auto;
  }
  .step-content {
    margin: 50px 0;
    text-align: center;
    .step-item {
      display: inline-block;
      text-align: center;
      img {
        display: block;
      }
      .form-item {
        margin-top: 20px;
        &:first-child {
          margin-top: 0;
        }
      }
      .button-container {
        margin-top: 50px;
      }
      label {
        display: block;
        font-size: 14px;
        width: 350px;
        margin-bottom: 10px;
        text-align: left;
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
