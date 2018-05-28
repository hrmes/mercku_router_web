<template>
  <div class="container">

    <mercku-menu class="menu" :menus="menus" v-if="!isLogin"></mercku-menu>
    <div class="app-container" :class="{'has-menu':!isLogin}">
      <mercku-header class="header"></mercku-header>
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
          url: '/bussiness/wodewifi',
          expand: this.$route.path.includes('/bussiness/wodewifi')
        },
        {
          icon: 'setting',
          text: 'trans0019',
          expand:
            this.$route.path.includes('/bussiness/wifishezhi') ||
            this.$route.path.includes('/bussiness/wangluoshezhi') ||
            this.$route.path.includes('/bussiness/anquan') ||
            this.$route.path.includes('/bussiness/chongqi'),
          children: [
            {
              text: 'trans0103',
              url: '/bussiness/wifishezhi'
            },
            {
              text: 'trans0142',
              url: '/bussiness/wangluoshezhi'
            },
            {
              text: 'trans0297',
              url: '/bussiness/anquan'
            },
            {
              text: 'trans0122',
              url: '/bussiness/chongqi'
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
  // padding-top: 80px;
  position: relative;
  .header {
    // position: fixed;
    top: 0;
    width: 100%;
    padding-left: 300px;
  }
  .menu {
    width: 300px;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1000;
  }
  .app-container {
    width: 100%;
    height: 100%;
    &.has-menu {
      padding-left: 300px;
    }
  }
}
</style>
