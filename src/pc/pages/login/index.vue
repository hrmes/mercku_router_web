<template>
  <div class="login-container">
    <m-step :steps="steps" :current="current"></m-step>
    <button v-if="initial" class="btn">{{$t('trans0222')}}</button>
    <div class="login-form" v-if="!initial">
      <m-input type="password" />
      <button class="btn">登陆</button>
    </div>
    <policy/>
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
      initial: false,
      steps: ['第一步', '第二步', '第三步'],
      current: 0
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

