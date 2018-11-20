<template>
  <div>
    <div class="page">
      <div class="page-header">
        TR069
      </div>
      <div class="page-content">
        <m-form class="form">
          <div class="title">{{$t('trans0491')}}</div>
          <m-form-item>
            <m-input :label="$t('trans0410')" v-model="tr069.remote.username"></m-input>
          </m-form-item>
          <m-form-item>
            <m-input :label="$t('trans0003')" v-model="tr069.remote.password"></m-input>
          </m-form-item>
          <m-form-item>
            <m-input :label="$t('trans0490')" v-model="tr069.remote.interval"></m-input>
          </m-form-item>
          <m-form-item>
            <m-input :label="$t('trans0498')" v-model="tr069.remote.url"></m-input>
          </m-form-item>
        </m-form>
        <m-form class="form">
          <div class="title">{{$t('trans0493')}}</div>
          <m-form-item>
            <m-input :label="$t('trans0494')" v-model="tr069.local.path"></m-input>
          </m-form-item>
          <m-form-item>
            <m-input :label="$t('trans0495')" v-model="tr069.remote.port"></m-input>
          </m-form-item>
          <m-form-item>
            <m-input :label="$t('trans0410')" v-model="tr069.remote.username"></m-input>
          </m-form-item>
          <m-form-item>
            <m-input :label="$t('trans0003')" v-model="tr069.remote.password"></m-input>
          </m-form-item>
          <div class="form-item">
            <m-checkbox :text="$t('trans0492')"></m-checkbox>
          </div>
          <div class="form-item">
            <button class="btn btn-primary">{{$t('trans0081')}}</button>
          </div>
        </m-form>
      </div>
    </div>
    <div class="page">
      <div class="page-header">
        Telnet
      </div>
      <div class="page-content">
        <m-switch :label="$t('trans0496')" v-model="telnet" :onChange="updateTelnet"></m-switch>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tr069: {
        enabled: true,
        remote: {
          username: '',
          password: '',
          interval: '',
          url: ''
        },
        local: {
          port: '',
          path: '',
          username: '',
          password: ''
        }
      },
      telnet: false
    };
  },
  mounted() {
    this.$http.getTelnetEnabled().then(res => {
      this.telnet = res.data.result.enabled;
    });
    this.$http.getTr069().then(res => {
      this.tr069 = res.data.result;
    });
  },
  methods: {
    updateTr069() {
      this.$http.updateTr069();
    },
    updateTelnet(v) {
      this.$http.setTelnetEnabled({
        enabled: v
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.page {
  margin-bottom: 30px;
  &:last-child {
    margin-bottom: 0;
  }
}
.page-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  .form {
    .title {
      font-size: 14px;
      color: #333;
      margin-bottom: 30px;
      font-weight: bold;
    }
  }
}
</style>
