<template>
  <div>
    <mercku-header></mercku-header>
    <router-view class="app-container"></router-view>
  </div>
</template>
<script>
import MerckuHeader from './component/header/header.vue';
import './style/common.scss';

export default {
  components: {
    'mercku-header': MerckuHeader
  },
  created() {
    this.$http
      .checkLogin()
      .then(res => {
        if (!res.data.result) {
          this.$route.replace({ path: '/login' });
        }
      })
      .catch(err => {
        if (err && err.error) {
          this.$toast(this.$t(err.error.code));
        } else {
          this.$toast(this.$t('trans0039'));
        }
      });
  }
};
</script>
