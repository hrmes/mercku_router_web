<template>
  <div class="pppoe-container">
    <nav-bar :option="option" :onLeftClick="onLeftClick"/>
    <div class="message">{{$t('trans0154')}}</div>
    <div class="form">
      <van-cell-group>
        <van-field type="text" :placeholder="$t('trans0155')" v-model="form.account"/>
        <div class="password-info">
          <van-field :type="!pwdShow?'password':'text'" :placeholder="$t('trans0156')" v-model="form.password"/>
          <div class="pwd-preview">
            <van-icon name="password-view" @click="isShowPwd()"/>
          </div>
        </div>
      </van-cell-group>
      <div class="button-info">
        <van-button size="normal" @click="submit()" :disabled="disabled">{{$t('trans0055')}}</van-button>
      </div>
    </div>
  </div>
</template>
<script>
  import navBar from '../../component/nav-bar.vue';

  export default {
    components: {
      'nav-bar': navBar
    },
    data() {
      return {
        option: {
          left: {
            disabled: true,
            icon: 'arrow-left',
          },
          center: {
            disabled: true,
            text: 'trans0144'
          },
          right: {
            disabled: false,
            text: '',
          }
        },
        form: {
          account: '',
          password: ''
        },
        pwdShow: false
      };
    },
    methods: {
      onLeftClick() {
        this.$router.back();
      },
      isShowPwd() {
        this.pwdShow = !this.pwdShow;
      },
      submit() {
        this.routerConfig.setWan('pppoe', this.form);
        this.$http.update(this.routerConfig.getConfig()).then((res) => {
          this.$router.replace('/complete');
        })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    computed: {
      disabled() {
        return !this.form.account || !this.form.password;
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .pppoe-container {

  .message {
    height: .5rem;
    line-height: .5rem;
    font-size: .12rem;
    text-align: center;
    color: rgb(124, 124, 124);
    background: rgb(0, 0, 0);

  }

  .form {

  }

  .password-info {
    padding-right: .3rem;
    position: relative;
  }

  .van-field {
    margin-top: .3rem;

  }

  .button-info {
    text-align: center;
    margin-top: .6rem;
  }

  .pwd-preview {
    position: absolute;
    right: 0;
    z-index: 1;
    top: 30%;

    width: 0.2rem;
    text-align: center;
  }

  .van-cell-group {
    background: transparent !important;
    padding-right: .15rem;
  }

  .van-hairline--bottom::after, .van-hairline--left::after, .van-hairline--right::after, .van-hairline--surround::after, .van-hairline--top-bottom::after, .van-hairline--top::after, .van-hairline::after {
    border: none !important;
  }

  }


</style>
