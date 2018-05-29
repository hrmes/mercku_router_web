<template>
  <div class="login-container">
    <!-- <m-step :steps="steps" :current="current"></m-step> -->
    <div class="bg">
      <div class="center-form">
        <div class="download">
          <img src="../../assets/images/qr.png" alt="">
          <div class="text">
            <div>{{$t('trans0314')}}</div>
            <div>
              {{$t('trans0292')}}</div>
          </div>
        </div>
        <div style="clear:both;"></div>
        <span class="welcome-text">{{$t('trans0136')}}</span>
        <button v-if="initial" class="btn">{{$t('trans0222')}}</button>
        <div class="login-form" v-if="!initial">
          <m-input type="password" />
          <button class="btn">{{this.$t('trans0001')}}</button>
        </div>
      </div>
      <policy class="policy" />
    </div>
  </div>

</template>
<script>
import policy from '../../component/policy/index.vue';
import mInput from '../../component/input/input.vue';
import mStep from '../../component/step/index.vue';

export default {
  components: {
    policy,
    mInput,
    mStep
  },
  data() {
    return {
      initial: true,
      steps: ['第一步', '第二步', '第三步'],
      current: 0
    };
  },
  mounted() {
    // this.$loading.open();
    // // 尝试自动登录，如果自动登录成功，则展示设置按钮，否则展示登录按钮。
    // this.$http
    //   .login('')
    //   .then(() => {
    //     this.initial = true;
    //     this.$loading.close();
    //   })
    //   .catch(() => {
    //     this.$loading.close();
    //   });
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
.login-container {
  position: absolute;
  top: 60px;
  width: 100%;
  bottom: 0;
  .bg {
    width: 100%;
    height: 100%;
    background: url(../../assets/images/img_main_picture.png) no-repeat center;
    background-position-y: bottom;
    .center-form {
      text-align: center;
      .download {
        padding: 0 50px;
        width: 200px;
        float: right;
        height: 150px;

        img {
          width: 80px;
          height: 80px;
        }
        .text {
          font-size: 14px;
          text-align: center;
        }
      }
      .welcome-text {
        font-size: 36px;
        color: #4c4c4c;
        display: block;
        margin-bottom: 50px;
      }
    }
  }
  background: -webkit-linear-gradient(
    left bottom,
    #fafafa,
    #fff
  ); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(
    top right,
    #fafafa,
    #fff
  ); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(
    top right,
    #fafafa,
    #fff
  ); /* Firefox 3.6 - 15 */
  background: linear-gradient(to top right, #fafafa, #fff); /* 标准的语法 */
  .policy {
    position: absolute;
    bottom: 10px;
    width: 100%;
    text-align: center;
    color: #333;
  }
}
</style>

