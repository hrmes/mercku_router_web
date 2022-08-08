<template>
  <div class="srcollbar-wrap">
    <div class="container">
      <div class="app-container router-view">
        <div ref="flexWrap"
             class="flex-wrap"
             :class="{ 'has-menu': navVisible }">
          <m-header :navVisible="navVisible"
                    :isLoginPage="!logoVisible"
                    :logoVisible="logoVisible"
                    :navs="menus"
                    class="header"></m-header>
          <router-view></router-view>
          <m-policy :locale="$i18n.locale"
                    :class="{ 'fix-bottom': !navVisible }"
                    class="policy" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import './style/common.scss';
import { HomewaySnModel, Customers } from '../../base/src/util/constant';
import getMenu from './menu';
import getHomewayMenu from './homeway-menu';

export default {
  data() {
    return {
      HomewaySnModel
    };
  },
  computed: {
    logoVisible() {
      return !this.$route.path.includes('login');
    },
    navVisible() {
      const { path } = this.$route;
      const visible = path.includes('login') || path.includes('wlan') || path.includes('unconnect');
      return !visible;
    },
    // SN规则
    // SN共15位

    // 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15
    // A B C D E F G H I J  K  L  M  N  O

    // J位【model_version】，homeway_m6a为0（所有m6a都是0），homeway_230V为1，homeway_POE单腿为2，homeway_POE双腿为3

    // 1.因为我们M6a文件夹下有多个isp，homeway为新加入的isp，且homeway与之前的isp界面有不一致
    // 2.首先在不影响原有isp的逻辑，去添加homeway的逻辑
    // 3.获取菜单的逻辑：
    // 在获取菜单的时候先判断运行的是否是homeway，是homeway得话，还要判断当前router的SN标志位(J位)是否为0
    // 是0，就当普通m6a处理，只要不是0，则为homeway独立产品，界面就会有变化，菜单也不一致
    // 所以只要下面的判断，通过就按照getHomewayMenu去获取菜单，不然就是getMenu获取菜单
    menus() {
      if (process.env.CUSTOMER_CONFIG.id === Customers.homeway &&
        this.$store.modelVersion !== HomewaySnModel.Homeway_M6a
      ) {
        return getHomewayMenu(this.$store.role, this.$store.mode, this.$store.modelVersion);
      }
      return getMenu(this.$store.role, this.$store.mode);
    }
  },
  methods: {
    setHeight() {
      // fix safari
      const contentMinHeight = 600; // 定义内容区域最小高度
      let height = 0;
      if (document.body.clientHeight > contentMinHeight) {
        height = document.body.clientHeight;
      } else {
        height = contentMinHeight;
      }
      this.$refs.flexWrap.style.minHeight = `${height}px`;
    }
  },
  mounted() {
    this.setHeight();
    window.addEventListener('resize', () => {
      this.setHeight();
    });
  }
};
</script>
<style lang="scss">
.srcollbar-wrap {
  height: 100%;
  overflow: auto;
}
.flex-wrap {
  display: flex;
  flex-direction: column;
}
.container {
  position: relative;
  display: flex;
  .app-container {
    display: flex;
    flex: 1;
    flex-direction: column;
    position: relative;
  }
  .policy {
    width: 100%;
    text-align: center;
    color: #333;
    &.fix-bottom {
      background: #fff;
    }
  }
}
@media screen and (max-width: 768px) {
  .container {
    flex-direction: column;
    .policy {
      font-size: 12px;
      &.fix-bottom {
        position: static;
      }
    }
  }
}
</style>
