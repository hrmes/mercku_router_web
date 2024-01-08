<template>
  <div class="initialization-container">
    <div class="checklist">
      <div class="checklist-img">
        <img src="@/assets/images/img_checklist.png"
             alt="">
      </div>
      <div class="checklist-title">
        <p>{{$t('trans1073')}}</p>
      </div>
      <div class="checklist-container">
        <p class="checklist-content">{{$t('trans1074')}}</p>
      </div>
      <div class="checklist-tips">若要作为节点组网使用，请先将homeway重置（使用针状物长按Reset大于10秒）</div>
      <div class="btn-container">
        <button @click="prepared"
                class="btn">{{$t('trans1075')}}</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  created() {
    this.isinitial();
  },
  methods: {
    // 如果已经初始化（即不是出厂设置），就转到login直接登录
    isinitial() {
      this.$http.isinitial().then(res => {
        if (!res.data.result.status) {
          this.$router.push({ path: '/login' });
        }
      });
    },
    prepared() {
      this.$router.push({ path: '/wlan/wifiSetting' });
    }
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
      margin-bottom: 20px;
    }
    .checklist-img {
      width: 220px;
      height: 220px;
      > img {
        width: inherit;
        height: inherit;
      }
    }
    .checklist-title {
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
    .checklist-tips {
      text-align: center;
    }
    .checklist-container {
      width: inherit;
      background: #f1f1f1;
      padding: 10px 15px;
      border-radius: 5px;
      overflow: hidden;
      .checklist-content {
        word-break: keep-all;
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
