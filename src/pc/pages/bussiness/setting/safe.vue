<template>
    <div class="setting-safe-container">
        <div class="content">
            <div class='header'>
                {{$t('')}} 修改管理密码
            </div>
            <div class='form'>

                <label for="" class="title">{{$t('trans0117')}}</label>
                <div class='input-box'>
                    <input :type="isPsd?'password':'text'" :placeholder="`${$t('trans0321')}`" class="psd-input" />
                    <span class='psd-icon'>
                        <i :class="isPsd?'is-psd':'no-psd'" @click="showPsd()"></i>
                    </span>
                </div>
                <label for="" class="title">{{$t('trans0113')}}</label>
                <div class='input-box'>
                    <input :type="isPsd?'password':'text'" :placeholder="`${$t('trans0321')}`" class="psd-input" />
                    <span class='psd-icon'>
                        <i :class="isPsd?'is-psd':'no-psd'" @click="showPsd()"></i>
                    </span>
                </div>
                <div class="btn-info">
                    <button class="btn">{{$t('trans0081')}}</button>
                </div>
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
      right: 50%;
      transform: translateX(50%);
      .input-box {
        width: 350px;
        height: 50px;
        border: 1px solid #b6b6b6;
        position: relative;
        margin-top: 10px;
        border-radius: 3px;
        box-sizing: border-box;
        input {
          margin: 1px;
          height: 46px;
          width: 346px;
          border: none;
          font-size: 16px;
          outline: none;
          padding-left: 10px;
          position: relative;
        }
      }
      .title {
        display: inline-block;
        font-size: 14px;
        color: #333333;
        margin-top: 30px;
      }

      .psd-input {
        width: 286px !important;
      }
      .psd-icon {
        display: inline-block;
        width: 54px;
        text-align: center;
        .is-psd {
          display: inline-block;
          cursor: pointer;
          width: 20px;
          height: 14px;
          background: url('../../../assets/images/ic_invisible.png');
        }
        .no-psd {
          display: inline-block;
          cursor: pointer;
          width: 20px;
          height: 12px;
          background: url('../../../assets/images/ic_visible.png');
        }
      }
      .btn-info {
        margin-top: 40px;
      }
      .check-info {
        display: flex;
        align-items: center;
        margin-top: 30px;
        label {
          margin-right: 10px;
          font-size: 16px;
          color: #333333;
        }
      }
    }
  }
}
</style>

