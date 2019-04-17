<template>
  <div class="page">
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
                 @click.native="forward2page('/advance/remote/telnet')">{{$t('trans0497')}}</m-tab>
          <m-tab :class="{'selected':isWWA}"
                 @click.native="forward2page('/advance/remote/wwa')">{{$t('trans0511')}}</m-tab>
        </m-tabs>
      </div>
    </div>

    <div class="page-content">
      <div v-if="isTR069">
        <m-form ref="remote"
                class="form"
                :model="remote"
                :rules="remoateRules">
          <div class="title">{{$t('trans0491')}}</div>
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
        <m-form ref="local"
                class="form"
                :model="local"
                :rules="localRules">
          <div class="title">{{$t('trans0493')}}</div>
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
          <div class="form-item">
            <m-checkbox :text="$t('trans0462')"
                        v-model="enabled"></m-checkbox>
          </div>

        </m-form>
        <div class="form-button">
          <button class="btn btn-primary"
                  @click="updateTr069">{{$t('trans0081')}}</button>
        </div>
      </div>
      <div v-if="isTFTP">
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
      <div v-if="isTelnet">
        <div class="form">
          <m-switch :label="$t('trans0462')"
                    v-model="telnet"
                    :onChange="updateTelnet"></m-switch>
        </div>
      </div>
      <div v-if="isWWA">
        <m-form class="form"
                ref="wwa"
                :model="wwa"
                :rules="wwaRules">
          <m-form-item prop="port">
            <m-input :label="$t('trans0495')"
                     v-model="wwa.port"
                     :placeholder="$t('trans0321')"></m-input>
          </m-form-item>
          <div class="form-item">
            <m-checkbox :text="$t('trans0462')"
                        v-model="wwa.enabled"></m-checkbox>
          </div>
        </m-form>
        <div class="form-button">
          <button class="btn btn-primary"
                  @click="updateWWA">{{$t('trans0081')}}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { portReg } from 'util/util';

export default {
  data() {
    return {
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
      },
      telnet: false,
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
      wwa: {
        port: '',
        enabled: false
      },
      wwaRules: {
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
      }
    };
  },
  computed: {
    ...(() => {
      const Tabs = {
        isTR069: 'tr069',
        isTFTP: 'tftp',
        isTelnet: 'telnet',
        isWWA: 'wwa'
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
  mounted() {
    this.$http.getTelnetEnabled().then(res => {
      this.telnet = res.data.result.enabled;
    });
    this.$http.getTr069().then(res => {
      this.remote = res.data.result.remote;
      this.local = res.data.result.local;
      this.enabled = res.data.result.enabled;
    });
    this.$http.getTFTP().then(res => {
      this.tftp = res.data.result;
    });
    this.$http.getWWA().then(res => {
      this.wwa = res.data.result;
    });
  },
  methods: {
    showDropdown() {
      this.dropdownVisible = !this.dropdownVisible;
    },
    forward2page(url) {
      this.$router.push({ path: url });
    },
    updateTr069() {
      if (this.$refs.remote.validate() && this.$refs.local.validate()) {
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
          this.telnet = !v;
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
    },
    updateWWA() {
      if (this.$refs.wwa.validate()) {
        this.$loading.open();
        this.$http
          .updateWWA({
            ...this.wwa,
            port: Number(this.wwa.port)
          })
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
          font-size: 16px;
          padding: 15px 0;
          display: flex;
          align-items: center;
          font-size: 14px;
        }
      }
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
}

@media screen and (max-width: 768px) {
  .page {
    .page-header {
      position: relative;
      background: #333;
      color: #fff;
      align-items: center;
      border-top: 1px solid #666;
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
        background: rgb(88, 73, 73);
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        z-index: 999;
        .tabs {
          display: flex;
          flex-direction: column;
          padding: 0 30px;
          background: #333;
          .tab {
            padding: 18px 0;
            color: #fff;
            font-size: 14px;
            margin: 0;
            border-bottom: 1px solid #666;
            &.selected {
              border-bottom: 1px solid #666;
              color: #d6001c;
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
