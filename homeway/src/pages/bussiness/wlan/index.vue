<template>
  <div class="initialization-container">
    <div class="checklist">
      <div class="checklist-img">
        <img src="../../../assets/images/img_checklist.png"
             alt="">
      </div>
      <div class="checklist-tips">
        <p>{{$t('trans1073')}}</p>
      </div>
      <div class="checklist-container">
        <p class="checklist-content">{{checklist}}</p>
      </div>
      <div class="btn-container">
        <button @click="prepared(modelId)"
                class="btn">{{$t('trans1075')}}</button>
      </div>
    </div>
  </div>
</template>
<script>
import { Models } from '../../../../../base/src/util/constant';

export default {
  created() {
    this.isinitial();
  },
  computed: {
    checklist() {
      let checklist = this.$t('trans1074').format('');
      switch (this.modelId) {
        case Models.homeway_230v:
          checklist = this.$t('trans1074').format('230v');
          break;
        case Models.homeway_POE1:
          checklist = this.$t('trans1074').format('POE');
          break;
        case Models.homeway_POE2:
          checklist = this.$t('trans1074').format('POE');
          break;
        default:
          break;
      }
      return checklist;
    },
    modelId() {
      return process.env.MODEL_CONFIG.id;
    }
  },
  methods: {
    // 如果已经初始化（即不是出厂设置），就转到login直接登录
    isinitial() {
      this.$http.isinitial()
        .then(res => {
          if (!res.data.result.status) {
            this.$router.push({ path: '/login' });
          }
        });
    },
    prepared(modelId) {
      switch (modelId) {
        case Models.homeway_230v:
          this.$router.push({ name: 'wifiSetting_230v' });
          break;
        case Models.homeway_POE1:
        case Models.homeway_POE2:
          this.$router.push({ name: 'wifiSetting' });
          break;
        default:
          break;
      }
    }
  },
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
