<template>
  <div class="login-container">
    <button v-if="initial" class="btn btn-primary">{{$t('trans0222')}}</button>
    <div class="login-form" v-if="!initial">
      <input class="input" type="password">
      <button class="btn btn-primary">登陆</button>
    </div>
    <policy/>
    <m-switch :checked="true" :onChange='this.swicthChange' />
    <div style='width:500px;height:500px;background:black;padding-top:50px'>
      <m-progress :width='width' />
    </div>
  </div>

</template>
<script>
import policy from '../../component/policy/index.vue';
import Switch from '../../component/switch/index.vue';
import Progress from '../../component/progress/index.vue';

export default {
  components: {
    policy,
    'm-switch': Switch,
    'm-progress': Progress
  },
  methods: {
    swicthChange(v) {
      console.log(v);
    }
  },
  data() {
    return {
      initial: false,
      width: 50
    };
  },
  mounted() {
    // setInterval(() => {
    //   this.width += 1;
    // }, 200);
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

