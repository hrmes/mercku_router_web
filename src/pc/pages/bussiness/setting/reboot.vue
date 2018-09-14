<template>
  <layout>
    <div class="setting-safe-container">
      <div v-if="reboot">
        <m-proress :label="$t('trans0322')"></m-proress>
      </div>
      <div class="content">
        <div class='w-header'>
          {{$t('trans0122')}}
        </div>
        <div class='form'>
          <img src="../../../assets/images/img_restart.png" alt="">
          <p> {{$t('trans0121')}}</p>
          <button class="btn re-btn" @click="submit()"> {{$t('trans0122')}}</button>
        </div>
      </div>
    </div>
  </layout>

</template>
<script>
import Progress from '../../../component/progress/index.vue';
import layout from '../../../layout.vue';

export default {
  components: {
    'm-proress': Progress,
    layout
  },
  data() {
    return {
      reboot: false
    };
  },
  methods: {
    submit() {
      this.$http
        .reboot()
        .then(() => {
          this.reboot = true;
          this.$reconnect({
            onsuccess: () => {
              this.$router.push({ path: '/dashboard' });
            },
            ontimeout: () => {
              this.$router.push({ path: '/unconnect' });
            }
          });
        })
        .catch(err => {
          if (err.upgrading) {
            return;
          }
          if (err && err.error) {
            this.$toast(this.$t(err.error.code));
          } else {
            this.$router.push({ path: '/unconnect' });
          }
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
  .content {
    border-radius: 8px;
    padding: 0 20px;
    background: white;
    flex: 1;

    position: relative;
    .w-header {
      height: 60px;
      border-bottom: 1px solid #f1f1f1;
      font-size: 16px;
      color: #333333;
      line-height: 60px;
      font-weight: 400;
    }
    .form {
      width: 100%;
      text-align: center;
      margin: 0 auto;
      padding-bottom: 50px;
      img {
        width: 200px;
      }
      .re-btn {
        margin-top: 30px;
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
      min-height: 510px;
      background: white;
    }
  }
}
</style>

