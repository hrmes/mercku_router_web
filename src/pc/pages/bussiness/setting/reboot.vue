<template>
    <div class="setting-safe-container">
        <div class="content">
            <div class='header'>
                {{$t('trans0122')}}
            </div>
            <div class='form'>
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
  height: 100%;
  .content {
    border-radius: 8px;
    padding: 0 20px;
    background: white;
    height: 95%;
    position: relative;
    .header {
      height: 60px;
      border-bottom: 1px solid #f1f1f1;
      font-size: 16px;
      color: #333333;
      line-height: 60px;
      font-weight: 400;
    }
    .form {
      position: absolute;
      padding-top: 100px;
      text-align: center;
      right: 50%;
      transform: translateX(50%);
      .re-btn {
        background: red;
        width: 150px;
        height: 40px;
        margin-top: 50px;
        &:active {
          opacity: 0.7;
        }
      }
    }
  }
}
</style>

