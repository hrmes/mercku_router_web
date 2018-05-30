<template>
  <div class="setting-safe-container">
    <div class="content">
      <div class='form'>
        <img src="../../../assets/images/img_restart.png" alt="">
        <p> {{$t('trans0121')}}</p>
        <button class="btn re-btn"> {{$t('trans0122')}}</button>
      </div>
    </div>
  </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isPsd: true
    };
  },
  methods: {
    showPsd() {
      this.isPsd = !this.isPsd;
    }
  }
};
</script>
<style lang="scss" scoped>
.setting-safe-container {
  position: relative;
  padding: 0 30px;
  .content {
    border-radius: 8px;
    padding: 0 20px;
    background: white;
    min-height: 510px;
    position: relative;
    .form {
      position: absolute;
      // padding-top: 100px;
      width: 100%;
      padding: 20px;
      text-align: center;
      right: 50%;
      transform: translateX(50%);
      img {
        width: 180px;
      }
      .re-btn {
        margin-top: 50px;
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .setting-safe-container {
    padding: 10px;
    .content {
      min-height: 510px;
      background: white;
    }
  }
}
</style>

