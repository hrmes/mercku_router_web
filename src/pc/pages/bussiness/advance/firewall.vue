<template>
  <div class="setting-safe-container">
    <div class="content">
      <div class='w-header'>
        {{$t('trans0424')}}
      </div>
      <div class="switch-container">
        <div class="item">
          <label for="">{{$t('trans0424')}}</label>
          <m-switch v-model="wan.dos" :onChange="updateFirewall"></m-switch>
        </div>
        <div class="item">
          <label for="">{{$t('trans0434')}}</label>
          <m-switch v-model="wan.ping" :onChange="updateFirewall"></m-switch>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      wan: {
        dos: false,
        ping: true
      }
    };
  },
  mounted() {
    this.getFirewall();
  },
  methods: {
    getFirewall() {
      this.$http.getFirewall().then(res => {
        this.wan = res.data.result.wan;
      });
    },
    updateFirewall() {
      this.$loading.open();
      this.$http
        .updateFirewall(this.wan)
        .then(() => {
          this.$loading.close();
          this.$toast(this.$t('trans0040'));
        })
        .catch(() => {
          this.$loading.close();
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.setting-safe-container {
  position: relative;
  flex: auto;
  padding: 0 2%;
  display: flex;
  flex-direction: column;
  .content {
    border-radius: 8px;
    padding: 0 20px;
    background: white;
    position: relative;
    flex: 1;
    margin-bottom: 30px;
    &:last-child {
      margin-bottom: 0;
    }
    .w-header {
      height: 60px;
      border-bottom: 1px solid #f1f1f1;
      font-size: 16px;
      color: #333333;
      line-height: 60px;
      font-weight: bold;
    }
    .switch-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 30px 0;
      .item {
        display: flex;
        align-items: center;
        &:last-child {
          margin-top: 30px;
        }
        label {
          width: 200px;
        }
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .setting-safe-container {
    padding: 20px 16px;
    .content {
      .w-header {
        font-size: 14px;
        height: 44px;
        line-height: 44px;
      }
    }
  }
}
</style>

