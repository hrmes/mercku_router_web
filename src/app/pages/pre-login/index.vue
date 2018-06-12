<template>
  <div></div>
</template>

<script>
export default {
  mounted() {
    const redirect = this.$route.params.redirect;
    // 没有redirect的页面，表明是接口401，授权已经失效了
    if (!redirect) {
      // 尝试用空密码登录
      this.$http
        .login('')
        .then(() => {
          this.$router.replace({ path: '/wlan' });
        })
        .catch(() => {
          this.$router.replace({ path: '/login' });
        });
    } else if (this.authorize.get()) {
      // 是否已经查询过授权
      this.$router.replace({ path: redirect });
    } else {
      this.$http.checkLogin().then(res => {
        this.authorize.set(res.data.result.status);
        if (!this.authorize.get()) {
          // 未登录
          this.$http
            .login('')
            .then(() => {
              this.authorize.set(true);
              this.$router.replace({ path: '/wlan' });
            })
            .catch(() => {
              this.$router.replace({ path: '/login' });
            });
        } else {
          this.$router.replace({ path: redirect });
        }
      });
    }
  }
};
</script>
