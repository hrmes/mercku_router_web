<template>
  <div class="initialization-container">
    <div class="checklist">
      <div class="checklist-img">
        <img src="../../../assets/images/img_checklist.png"
             alt="">
      </div>
      <div class="checklist-tips">
        <p>{{'Please prepare the following tools and accessories before installation:'}}</p>
      </div>
      <div class="checklist-container">
        <p class="checklist-content">{{checklist}}</p>
      </div>
      <div class="btn-container">
        <button @click="prepared(currentRouter)"
                class="btn">{{$t('trans1075')}}</button>
      </div>
    </div>
  </div>
</template>
<script>
import { HomewayModel } from '../../../../../base/src/util/constant';

export default {
  data() {
    return {
      modelVersion: null,
      currentRouter: null,
    };
  },
  created() {
    this.isinitial();
  },
  computed: {
    checklist() {
      let checklist = this.$t('trans1074').replace('%s', '');
      switch (this.modelVersion) {
        case HomewayModel.homeway_230v:
          this.currentRouter = '230v';
          checklist = this.$t('trans1074').replace('%s', '230v');
          break;
        case HomewayModel.homeway_POE_1:
          this.currentRouter = 'POE';
          checklist = this.$t('trans1074').replace('%s', 'POE');
          break;
        case HomewayModel.homeway_POE_2:
          this.currentRouter = 'POE';
          checklist = this.$t('trans1074').replace('%s', 'POE');
          break;
        default:
          break;
      }
      return checklist;
    }
  },
  methods: {
    // 如果已经初始化（即不是出厂设置），就转到login直接登录
    isinitial() {
      this.$http.isinitial()
        .then(res => {
          if (!res.data.result.status) {
            this.$router.push({ path: '/login' });
          } else {
            this.getRouter();
          }
        });
    },
    getRouter() {
      this.$http.getRouter()
        .then(res => {
          this.modelVersion = res.data.result.sn.slice(9, 10);
          console.log('modelVersion', this.modelVersion);
        });
    },
    prepared(router) {
      switch (router) {
        case '230v':
          this.$router.push({ name: 'wifiSetting_230v' });
          break;
        case 'POE':
          this.$router.push({ name: 'wifiSetting' });
          break;
        default:
          break;
      }
    }
  },
  beforeRouterEnter: (to, from, next) => {
    next(vm => {
      vm.isinitial();
    });
  }
};
</script>
<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-size: 14px;
}
.initialization-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  flex: auto;
  background: #fff;
  .checklist {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 350px;
    margin: 0 auto;
    > div {
      margin-bottom: 30px;
    }
    > :nth-child(3) {
      margin-bottom: 40px;
    }
    .checklist-img {
      width: 220px;
      height: 220px;
      > img {
        width: inherit;
        height: inherit;
      }
    }
    .checklist-tips {
      width: inherit;
      > p {
        font-size: 14px;
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        letter-spacing: normal;
        text-align: center;
        padding: 0 7px;
        color: #333;
      }
    }
    .checklist-container {
      width: inherit;
      background: #f1f1f1;
      padding: 10px 0 10px 15px;
      border-radius: 5px;
      overflow: hidden;
      .checklist-content {
        white-space: pre-line;
        line-height: 25px;
        transition: all 0.3s ease-in-out;
      }
    }
    .btn-container {
      width: inherit;
      > .btn {
        font-size: 16px;
      }
    }
  }
}
@media screen and(max-width: 768px) {
  .initialization-container {
    // margin-top: 20px;
    > .checklist {
      width: 335px;
      .checklist-img {
        width: 185px;
        height: 185px;
      }
    }
  }
}
</style>
