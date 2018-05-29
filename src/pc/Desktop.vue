<template>
  <div class="container">
    <mercku-menu class="menu" :menus="menus" v-if="!isLogin"></mercku-menu>
    <div class="app-container" :class="{'has-menu':!isLogin}">
      <mercku-header class="header" :class="{'login-page':isLogin}"></mercku-header>
      <router-view></router-view>
    </div>

  </div>

</template>
<script>
import MerckuHeader from './component/header/header.vue';
import MerckuMenu from './component/menu/index.vue';
import './style/common.scss';

export default {
  components: {
    'mercku-header': MerckuHeader,
    'mercku-menu': MerckuMenu
  },
  methods: {
    entered() {
      console.log('entered');
    }
  },
  computed: {
    isLogin() {
      return this.$route.path.includes('login');
    }
  },
  data() {
    return {
      menus: [
        {
          icon: 'wifi',
          text: 'trans0173',
          url: '/home',
          expand: this.$route.path.includes('/home')
        },
        {
          icon: 'setting',
          text: 'trans0019',
          expand:
            this.$route.path.includes('/setting/wifi') ||
            this.$route.path.includes('/setting/network') ||
            this.$route.path.includes('/setting/safe') ||
            this.$route.path.includes('/setting/reboot'),
          children: [
            {
              text: 'trans0103',
              url: '/setting/wifi'
            },
            {
              text: 'trans0142',
              url: '/setting/network'
            },
            {
              text: 'trans0297',
              url: '/setting/safe'
            },
            {
              text: 'trans0122',
              url: '/setting/reboot'
            }
          ]
        }
      ]
    };
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
<style lang="scss" scoped>
.container {
  height: 100%;
  position: relative;
  .header {
    width: 100%;
    padding-left: 300px;
    &.login-page {
      background: #fff;
    }
  }
  .app-container {
    width: 100%;
    height: 100%;
    position: relative;
    &.has-menu {
      padding-left: 300px;
    }
  }
}
@media screen and (max-width: 479px) {
}
@media screen and (max-width: 768px) {
  .container {
    padding-top: 65px;
    .app-container {
      &.has-menu {
        padding-left: 0;
      }
    }
    .header {
      display: none;
    }
  }
}
</style>
