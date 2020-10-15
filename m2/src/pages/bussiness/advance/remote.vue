<template>
  <div class="page page__remote">
    <div class="page-header"
         @click="showDropdown">
      <div class="page-header__text">{{$t('trans0286')}}</div>
      <div class="page-header-trigger"
           :class="{'show':dropdownVisible}"></div>
      <div class="tabs-container"
           :class="{'show':dropdownVisible}">
        <m-tabs class="tabs">
          <m-tab :class="{'selected':isTR069}"
                 @click.native="forward2page('/advance/remote/tr069')">{{$t('trans0499')}}
          </m-tab>
          <m-tab :class="{'selected':isTFTP}"
                 @click.native="forward2page('/advance/remote/tftp')">{{$t('trans0503')}}
          </m-tab>
          <m-tab :class="{'selected':isTelnet}"
                 @click.native="forward2page('/advance/remote/telnet')">{{$t('trans0626')}}</m-tab>
        </m-tabs>
      </div>
    </div>

    <div class="page__remote__content">
      <div class="tr069-form"
           key="tr069-form"
           v-if="isTR069">
        <div class="form-checkbox-wrap">
          <div class="form-checkbox">
            <m-checkbox :text="$t('trans0462')"
                        v-model="enabled"></m-checkbox>
          </div>
        </div>
        <div class="title">{{$t('trans0491')}}</div>
        <m-form ref="remote"
                class="form"
                :model="remote"
                :rules="remoateRules">
          <m-form-item prop="url">
            <m-input :label="`${$t('trans0498')}`"
                     v-model="remote.url"
                     :placeholder="$t('trans0321')"></m-input>
          </m-form-item>
          <m-form-item prop="username">
            <m-input :label="$t('trans0410')"
                     v-model="remote.username"
                     :placeholder="$t('trans0321')"></m-input>
          </m-form-item>
          <m-form-item prop="password">
            <m-input :label="$t('trans0003')"
                     type="password"
                     v-model="remote.password"
                     :placeholder="$t('trans0321')"></m-input>
          </m-form-item>
          <m-form-item prop="interval">
            <m-input :label="$t('trans0490')"
                     v-model="remote.interval"
                     :placeholder="$t('trans0321')"></m-input>
          </m-form-item>
        </m-form>
        <div class="title">{{$t('trans0493')}}</div>
        <m-form ref="local"
                class="form"
                :model="local"
                :rules="localRules">
          <m-form-item prop="path">
            <m-input :label="$t('trans0494')"
                     v-model="local.path"
                     :placeholder="$t('trans0321')"></m-input>
          </m-form-item>
          <m-form-item prop="port">
            <m-input :label="$t('trans0495')"
                     v-model="local.port"
                     :placeholder="$t('trans0321')"></m-input>
          </m-form-item>
          <m-form-item>
            <m-input :label="`${$t('trans0410')}${$t('trans0411')}`"
                     v-model="local.username"
                     :placeholder="$t('trans0321')"></m-input>
          </m-form-item>
          <m-form-item>
            <m-input :label="`${$t('trans0003')}${$t('trans0411')}`"
                     type="password"
                     v-model="local.password"
                     :placeholder="$t('trans0321')"></m-input>
          </m-form-item>
        </m-form>
        <div class="title">{{$t('trans0580')}}</div>
        <m-form ref="stun"
                class="form"
                :model="stun"
                :rules="stunRules">
          <m-form-item prop="host">
            <m-input :label="$t('trans0498')"
                     v-model="stun.host"
                     :placeholder="$t('trans0321')"
                     :disabled="stunHostDisable"></m-input>
          </m-form-item>
          <m-form-item prop="port">
            <m-input :label="$t('trans0495')"
                     v-model="stun.port"
                     :placeholder="$t('trans0321')"
                     :disabled="stunPortDisable"></m-input>
          </m-form-item>
          <div class="form-item">
            <m-checkbox :text="$t('trans0462')"
                        v-model="stun.enabled"></m-checkbox>
          </div>
        </m-form>
        <div class="form-button">
          <button class="btn btn-primary"
                  @click="updateTr069">{{$t('trans0081')}}</button>
        </div>
      </div>
      <div class="tftp-form"
           key="tftp-form"
           v-if="isTFTP">
        <m-form class="form"
                :model="tftp"
                :rules="tftpRules"
                ref="tftp">
          <m-form-item prop="server">
            <m-input :label="$t('trans0409')"
                     v-model="tftp.server"
                     :placeholder="$t('trans0321')"></m-input>
          </m-form-item>
          <m-form-item prop="filename">
            <m-input :label="$t('trans0502')"
                     v-model="tftp.filename"
                     :placeholder="$t('trans0321')"></m-input>
          </m-form-item>
        </m-form>
        <div class="form-button">
          <button class="btn btn-primary"
                  @click="updateTFTP">{{$t('trans0081')}}</button>
        </div>
      </div>
      <div class="telnet-form"
           key="telnet-form"
           v-if="isTelnet">
        <m-form class="form"
                :model="remoteShell"
                ref="remoteShell">
          <m-form-item>
            <m-switch :label="$t('trans0497')"
                      class="switch"
                      v-model="remoteShell.telnet"
                      :onChange="updateTelnet"></m-switch>
          </m-form-item>
          <m-form-item>
            <m-switch :label="$t('trans0628')"
                      class="switch"
                      v-model="remoteShell.ssh"
                      :onChange="updateSsh"></m-switch>
          </m-form-item>
        </m-form>
      </div>
    </div>
  </div>
</template>
<script>
import { portReg } from '@/util/util';

const defalutUrl = '/advance/remote/tr069';
export default {
  data() {
    return {
      preUrl: defalutUrl,
      dropdownVisible: false,
      tftp: {
        server: '',
        filename: ''
      },
      tftpRules: {
        server: [
          {
            rule: value => value,
            message: this.$t('trans0232')
          }
        ],
        filename: [
          {
            rule: value => value,
            message: this.$t('trans0232')
          }
        ]
      },
      enabled: false,
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
      },
      remoteShell: {
        telnet: false,
        ssh: false
      },
      remoateRules: {
        url: [
          {
            rule: value => value,
            message: this.$t('trans0232')
          }
        ],
        username: [
          {
            rule: value => value,
            message: this.$t('trans0232')
          }
        ],
        interval: [
          {
            rule: value => value,
            message: this.$t('trans0232')
          },
          {
            rule: value => /^\d*$/g.test(value),
            message: this.$t('trans0500')
          },
          {
            rule: value => {
              const v = parseInt(value, 10);
              if (Number.isNaN(v)) {
                return false;
              }
              if (v <= 0 || v > 999999999) {
                return false;
              }
              return true;
            },
            message: this.$t('trans0500')
          }
        ]
      },
      localRules: {
        port: [
          {
            rule: value => value,
            message: this.$t('trans0232')
          },
          {
            rule: value => portReg.test(value),
            message: this.$t('trans0478')
          }
        ],
        path: [
          {
            rule: value => value,
            message: this.$t('trans0232')
          }
        ]
      },
      stun: {
        enabled: false,
        host: '',
        port: ''
      },
      stunHostDisable: false,
      stunPortDisable: false,
      stunRules: {},
      stunEnableRule: {
        host: [
          {
            rule: value => value,
            message: this.$t('trans0232')
          }
        ],
        port: [
          {
            rule: value => value,
            message: this.$t('trans0232')
          },
          {
            rule: value => portReg.test(value),
            message: this.$t('trans0478')
          }
        ]
      },
      stunDisenableRule: {
        host: [],
        port: []
      }
    };
  },
  computed: {
    ...(() => {
      const Tabs = {
        isTR069: 'tr069',
        isTFTP: 'tftp',
        isTelnet: 'telnet'
      };
      const result = {};
      Object.keys(Tabs).forEach(key => {
        result[key] = function temp() {
          return this.$route.params.category === Tabs[key];
        };
      });
      return result;
    })()
  },
  watch: {
    'stun.enabled': {
      handler(val) {
        if (val) {
          this.stunRules = this.stunEnableRule;
          this.stunHostDisable = false;
          this.stunPortDisable = false;
        } else {
          this.stunRules = this.stunDisenableRule;
          this.stunHostDisable = true;
          this.stunPortDisable = true;
          this.stun.host = '';
          this.stun.port = '';
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.$http.getTelnetEnabled().then(res => {
      this.remoteShell.telnet = res.data.result.enabled;
    });
    this.$http.getSSHEnabled().then(res => {
      this.remoteShell.ssh = res.data.result.enabled;
    });
    this.$http.getTr069().then(res => {
      this.remote = res.data.result.remote;
      this.local = res.data.result.local;
      this.stun = res.data.result.stun;
      this.stun.port = this.stun.port === 0 ? '' : this.stun.port;
      this.enabled = res.data.result.enabled;
    });
    this.$http.getTFTP().then(res => {
      this.tftp = res.data.result;
    });
  },
  methods: {
    showDropdown() {
      this.dropdownVisible = !this.dropdownVisible;
    },
    forward2page(url) {
      if (this.preUrl && this.preUrl === url) {
        return;
      }
      this.preUrl = url;
      this.$router.replace({ path: url });
    },
    updateTr069() {
      if (
        this.$refs.remote.validate() &&
        this.$refs.local.validate() &&
        this.$refs.stun.validate()
      ) {
        this.$loading.open();
        const remote = {
          username: this.remote.username,
          interval: Number(this.remote.interval),
          url: this.remote.url
        };
        const local = {
          username: this.local.username,
          port: Number(this.local.port),
          path: this.local.path
        };
        const stun = {
          enabled: this.stun.enabled,
          host: this.stun.host,
          port: this.stun.port * 1
        };

        if (this.remote.password) {
          remote.password = this.remote.password;
        }
        if (this.local.password) {
          local.password = this.local.password;
        }
        this.$http
          .updateTr069({
            remote,
            local,
            stun,
            enabled: this.enabled
          })
          .then(() => {
            this.$loading.close();
            this.$toast(this.$t('trans0040'), 3000, 'success');
          })
          .catch(() => {
            this.$loading.close();
          });
      }
    },
    updateTelnet(v) {
      this.$loading.open();
      this.$http
        .setTelnetEnabled({
          enabled: v
        })
        .then(() => {
          this.$loading.close();
          this.$toast(this.$t('trans0040'), 3000, 'success');
        })
        .catch(() => {
          this.$loading.close();
          this.remoteShell.telnet = !v;
        });
    },
    updateSsh(v) {
      this.$loading.open();
      this.$http
        .setSSHEnabled({
          enabled: v
        })
        .then(() => {
          this.$loading.close();
          this.$toast(this.$t('trans0040'), 3000, 'success');
        })
        .catch(() => {
          this.$loading.close();
          this.remoteShell.ssh = !v;
        });
    },
    updateTFTP() {
      if (this.$refs.tftp.validate()) {
        this.$loading.open();
        this.$http
          .updateTFTP(this.tftp)
          .then(() => {
            this.$loading.close();
            this.$toast(this.$t('trans0040'), 3000, 'success');
          })
          .catch(() => {
            this.$loading.close();
          });
      }
    }
  }
};
</script>
<style lang="scss">
.page__remote {
  .page__remote__content {
    .telnet-form {
      label {
        font-weight: bold;
        width: 75px;
        font-weight: bold;
        text-align: right;
        margin-right: 10px;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.page {
  .page-header {
    display: flex;
    justify-content: space-between;
    .page-header-trigger {
      display: none;
    }
    .tabs-container {
      .tabs {
        border: 0;
        padding: 0;
        .tab {
          padding: 15px 0;
          display: flex;
          align-items: center;
          font-size: 14px;
          font-weight: normal;
        }
      }
    }
  }
  .page__remote__content {
    border-radius: 8px;
    padding: 30px 20px;
    display: flex;
    justify-content: center;
    .tr069-form {
      width: 100%;
      .form-checkbox-wrap {
        display: flex;
        justify-content: center;
        margin-bottom: 30px;
      }
      .form-checkbox {
        display: flex;
        width: 340px;
      }
      .title {
        width: 100%;
        font-size: 14px;
        margin-bottom: 30px;
        font-weight: bold;
        color: #999;
        border-bottom: 1px solid #f1f1f1;
        height: 50px;
        line-height: 50px;
      }
      .form {
        width: 340px;
        margin: 0 auto;
      }
      .form-button {
        display: flex;
        justify-content: center;
      }
    }
    .tftp-form {
      width: 100%;
      .form {
        width: 340px;
        margin: 0 auto;
      }
      .form-button {
        display: flex;
        justify-content: center;
      }
    }
    .telnet-form {
      width: 100%;
      .form {
        width: 340px;
        margin: 0 auto;
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .page {
    .page-header {
      position: relative;
      background: $header-background-color;
      color: #fff;
      align-items: center;
      border-top: 1px solid $header-nav-item-border-color;
      .page-header-trigger {
        display: block;
        &::before {
          content: '';
          display: block;
          width: 8px;
          height: 8px;
          border-bottom: 1px solid #fff;
          border-right: 1px solid #fff;
          transform: rotate(45deg);
          position: relative;
          top: -2px;
          transition: all 0.3s linear;
        }
        &.show {
          &::before {
            transform: rotate(225deg);
          }
        }
      }
      .tabs-container {
        display: none;
        &.show {
          display: block;
        }
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        z-index: 999;
        .tabs {
          display: flex;
          flex-direction: column;
          padding: 0 30px;
          background: $header-background-color;
          .tab {
            padding: 18px 0;
            color: #fff;
            font-size: 14px;
            margin: 0;
            border-bottom: 1px solid $header-nav-item-border-color;
            &.selected {
              border-bottom: 1px solid $header-nav-item-border-color;
              color: $primaryColor;
              &::before {
                display: none;
              }
            }
          }
        }
      }
    }
    .page-content {
      > div {
        width: 100%;
      }
    }
  }
}
</style>
