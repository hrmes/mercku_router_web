<template>
  <div class="login-container">
    <button v-if="initial" class="btn btn-primary">{{$t('trans0222')}}</button>
    <div class="login-form" v-if="!initial">
      <input class="input" type="password">
      <button class="btn btn-primary">登陆</button>
    </div>
    <policy/>
  </div>

</template>
<script>
import policy from '../../component/policy/index.vue';

export default {
  components: {
    policy
  },
  data() {
    return {
      initial: false
    };
  },
  mounted() {
    this.$loading.open();
    // 尝试自动登录，如果自动登录成功，则展示设置按钮，否则展示登录按钮。
    this.$http
      .login('')
      .then(() => {
        this.initial = true;
        this.$loading.close();
      })
      .catch(() => {
        this.$loading.close();
      });
  }
};
</script>
<style lang="scss" scoped>
.login-container {
}
</style>

