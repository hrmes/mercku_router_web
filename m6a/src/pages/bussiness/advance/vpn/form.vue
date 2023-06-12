<template>
  <div class="page">
    <div v-if="$store.state.isMobile"
         class='page-header'>
      {{$t('trans0402')}}
    </div>
    <div class="page-content">
      <m-form class="form"
              ref="form"
              :model="form"
              :rules='rules'>
        <m-form-item class="item"
                     prop='name'>
          <m-input :label="$t('trans0108')"
                   type="text"
                   :placeholder="$t('trans0321')"
                   v-model="form.name" />
        </m-form-item>
        <m-form-item class="item"
                     prop='protocol'>
          <m-select :label="$t('trans0408')"
                    v-model="form.protocol"
                    :options="protocolsList"></m-select>
        </m-form-item>
        <div v-if="form.protocol === VPNType.openvpn">
          <div class="config-uploader">
            <div class="config-uploader__label">{{$t('trans0673')}}</div>
            <div class="config-uploader__inner">
              <button @click="triggerFileInput"
                      class="config-uploader__button">
                <span>{{ openvpnForm.configFile ? $t('trans0675') : $t('trans0006') }}</span>
                <input type="file"
                       @change="onFileChange"
                       ref="uploadInput"
                       :accept="`.${openvpnForm.fileAccept}`"
                       hidden="hidden" />
              </button>
              <div v-if="openvpnForm.configFile"
                   class="config-uploader__status"
                   :class="{'config-uploader__status--error':isInvalidFile}">
                <span class="config-uploader__icon"></span>
                <span>{{isInvalidFile ? $t('trans0691'): $t('trans0689')}}</span>
              </div>
            </div>
            <div class="config-uploader__tip"
                 :class="{'config-uploader__tip--error':(isInvalidFile || isEmptyFile)}">
              {{$t('trans0678')}}
            </div>
          </div>
          <div class="openvpn__checkbox">
            <m-checkbox v-model="openvpnForm.advance"
                        :text="$t('trans0440')"></m-checkbox>
          </div>
          <div class="openvpn-advance"
               v-if="openvpnForm.advance">
            <m-form-item key="ousernmae"
                         class="item"
                         prop='username'>
              <m-input :label="$t('trans0410')"
                       type="text"
                       :placeholder="$t('trans0321')"
                       v-model="form.username" />
            </m-form-item>
            <m-form-item key="opassword"
                         class="item"
                         prop='password'>
              <m-input :label="$t('trans0003')"
                       type='password'
                       :placeholder="`${$t('trans0321')}`"
                       v-model="form.password"></m-input>
            </m-form-item>
          </div>
        </div>
        <div v-else-if="form.protocol === VPNType.wireguard">
          <m-form-item key="privateKey"
                       class="item"
                       prop='privateKey'>
            <m-input :label="$t('trans0409')"
                     type="text"
                     :placeholder="$t('trans0321')"
                     v-model="form.server" />
          </m-form-item>
        </div>
        <div v-else>
          <m-form-item key="server"
                       class="item"
                       prop='server'>
            <m-input :label="$t('trans0409')"
                     type="text"
                     :placeholder="$t('trans0321')"
                     v-model="form.server" />
          </m-form-item>
          <m-form-item key="username"
                       class="item"
                       prop='username'>
            <m-input :label="$t('trans0410')"
                     type="text"
                     :placeholder="$t('trans0321')"
                     v-model="form.username" />
          </m-form-item>
          <m-form-item key="password"
                       class="item"
                       prop='password'>
            <m-input :label="`${$t('trans0003')} ${$t('trans0411')}`"
                     type='password'
                     :placeholder="`${$t('trans0321')}`"
                     v-model="form.password"></m-input>
          </m-form-item>
          <div class="opz-info"
               v-if="form.protocol===VPNType.pptp">
            <div class="opz">
              <m-checkbox v-model="pptp.mppe"
                          :text="$t('trans0412')"
                          :bold="true"></m-checkbox>
            </div>
            <div class="opz">
              <m-checkbox v-model="pptp.mppc"
                          :text="$t('trans0413')"
                          :bold="true"></m-checkbox>
            </div>
          </div>
        </div>
      </m-form>
      <div class="btn-info form-button">
        <button class="btn btn-middle btn-default"
                @click="$router.go(-1)">{{$t('trans0025')}}</button>
        <button class="btn btn-middle"
                @click="submit()">{{$t('trans0081')}}</button>
      </div>
    </div>

  </div>
</template>
<script>
import { VPNType } from 'base/util/constant';
import { getStringByte, isValidPassword } from 'base/util/util';

const MAX_FILE_SIZE = 1000 * 1000;
export default {
  data() {
    return {
      VPNType,
      protocolsList: [
        {
          value: VPNType.pptp,
          text: this.$t('trans0414')
        },
        {
          value: VPNType.l2tp,
          text: this.$t('trans0415')
        },
        {
          value: VPNType.openvpn,
          text: this.$t('trans0676')
        },
         {
          value: VPNType.wireguard,
          text: 'WireGuard'
        }
      ],
      pptp: {
        mppe: false,
        mppc: false
      },
      protocol: VPNType.pptp, // L2TP or PPTP
      form: {
        id: '',
        name: '',
        protocol: VPNType.pptp, // L2TP or PPTP
        server: '',
        username: '',
        password: '',
      },
      openvpnForm: {
        advance: false,
        configFile: null,
        configUrl: '',
        fileAccept: 'ovpn',
      },
      rules: {
        name: [
          {
            rule: value => !/^\s*$/g.test(value.trim()),
            message: this.$t('trans0237')
          },
          {
            rule: value => getStringByte(value.trim()) <= 20,
            message: this.$t('trans0261')
          }
        ],
        server: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          },
          {
            rule: value => getStringByte(value) <= 64,
            message: this.$t('trans0228')
          }
        ],
        username: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          },
          {
            rule: value => getStringByte(value) <= 64,
            message: this.$t('trans0261')
          }
        ],
        password: [
          {
            rule: value => {
              if (!value) {
                return true;
              }
              return isValidPassword(value, 1, 64);
            },
            message: this.$t('trans0125').format(1, 64)
          }
        ]
      },
      isEmptyFile: false
    };
  },
  mounted() {
    if (this.$route.params.id) {
      const { vpn } = this.$store.state.modules;
      // no records in store, redirect to list
      if (vpn.id) {
        this.form = {
          id: vpn.id,
          name: vpn.name,
          protocol: vpn.protocol.toLowerCase()
        };
        if (vpn.protocol === VPNType.openvpn) {
          this.form.username = vpn.username;
          this.form.password = vpn.password;
          this.openvpnForm.advance = !!(vpn.password || vpn.username);
          this.openvpnForm.configFile = {
            update: true
          };
        } else if (vpn.protocol === VPNType.wireguard) {
          console.log(111);
        } else {
          this.form.server = vpn.server;
          this.form.username = vpn.username;
          this.form.password = vpn.password;
          if (vpn.protocol === VPNType.pptp) {
            this.pptp = {
              mppe: vpn.pptp.mppe,
              mppc: vpn.pptp.mppc
            };
          }
        }
      } else {
        this.$router.push('/advance/vpn');
      }
    }
  },
  computed: {
    formType() {
      return this.$route.params.id ? 'update' : 'add';
    },
    formParams() {
      this.form.name = this.form.name.trim();
      const params = {
        id: this.form.id,
        name: this.form.name,
        protocol: this.protocol
      };
      if (this.protocol === VPNType.openvpn) {
        if (this.openvpnForm.advance) {
          params.username = this.form.username;
          params.password = this.form.password;
        }
        if (!this.openvpnForm.configFile.update) {
          params.openvpn = {
            url: this.openvpnForm.configUrl
          };
        }
      } else if (this.protocol === VPNType.wireguard) {
        console.log(123123);
      } else {
        params.server = this.form.server;
        params.username = this.form.username;
        params.password = this.form.password;
        if (this.form.protocol === VPNType.pptp) {
          params.pptp = this.pptp;
        }
      }
      return params;
    },
    isInvalidFile() {
      if (this.openvpnForm.configFile && !this.openvpnForm.configFile.update) {
        // Don't need validate config file extend name
        // const ext = this.openvpnConfigFile.name.split('.').slice(-1)[0];
        // if (ext !== this.openvpnFileAccept) {
        //   return true;
        // }
        const { size } = this.openvpnForm.configFile;
        // 空文件或者大于1M
        if (size <= 0 || size > MAX_FILE_SIZE) {
          return true;
        }
      }
      return false;
    }
  },
  methods: {
    triggerFileInput() {
      this.$refs.uploadInput.click();
    },
    onFileChange(ev) {
      const { files } = ev.target;
      if (files && !files.length) return;
      this.isEmptyFile = false;
      const postFiles = Array.prototype.slice.call(files);
      [this.openvpnForm.configFile] = postFiles;
    },
    upload() {
      const formData = new FormData();
      formData.append('type', 'openvpn');
      formData.append('file', this.openvpnForm.configFile);
      return this.$http.uploadFile(formData, () => {});
    },
    submitForm(method) {
      this.$http[method](this.formParams)
        .then(() => {
          this.$loading.close();
          this.$toast(this.$t('trans0040'), 3000, 'success');
          this.$router.push('/advance/vpn');
        })
        .catch(() => {
          this.$loading.close();
        });
    },
    submit() {
      if (this.form.protocol === VPNType.openvpn) {
        if (!this.openvpnForm.configFile) {
          this.isEmptyFile = true;
          return;
        }
        if (this.isInvalidFile) {
          return;
        }
      }
      if (this.$refs.form.validate()) {
        const fetchMethod = this.formType === 'update' ? 'updateVPN' : 'addVPN';
        this.$loading.open();
        if (this.formParams.protocol === VPNType.openvpn) {
          if (!this.openvpnForm.configFile.update) {
            this.upload()
              .then(res => {
                this.openvpnForm.configUrl = res.data.result.url;
                this.submitForm(fetchMethod);
              })
              .catch(() => {
                this.$toast(this.$t('trans0341'));
                this.$loading.close();
              });
          } else {
            this.submitForm(fetchMethod);
          }
        } else {
          this.submitForm(fetchMethod);
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.opz-info {
  .opz {
    display: flex;
    font-size: 14px;
    margin-bottom: 30px;
    label {
      margin-right: 10px;
    }
  }
}
.openvpn-advance {
  margin-top: 20px;
}
.openvpn__checkbox {
  display: flex;
  &:last-child {
    margin-bottom: 30px;
  }
}
.config-uploader {
  width: 340px;
  margin-bottom: 20px;
  .config-uploader__inner {
    display: flex;
    align-items: center;
  }
  .config-uploader__label {
    color: #333;
    margin-bottom: 5px;
    font-size: 14px;
    margin-right: 12px;
    font-weight: bold;
  }

  .config-uploader__status {
    background: #f1f1f1;
    padding: 5px 24px 5px 12px;
    line-height: 17px;
    margin-left: 10px;
    color: #00d061;
    border-radius: 4px;
    display: flex;
    align-items: center;
    .config-uploader__icon {
      width: 17px;
      height: 17px;
      margin-right: 6px;
      display: inline-block;
      background: #00d061;
      border-radius: 50%;
      position: relative;
      &::before {
        position: absolute;
        content: '';
        display: block;
        width: 5px;
        height: 1px;
        background: #fff;
        top: 11px;
        left: 3px;
        transform: rotate(45deg);
        border-radius: 1px;
      }
      &::after {
        position: absolute;
        content: '';
        display: block;
        width: 9px;
        height: 1px;
        background: #fff;
        top: 9px;
        left: 6px;
        transform: rotate(-45deg);
        border-radius: 1px;
      }
    }
    &.config-uploader__status--error {
      color: #ff0000;
      .config-uploader__icon {
        background: #ff0000;
        &::before {
          width: 9px;
          height: 1px;
          top: 8px;
          left: 4px;
        }
        &::after {
          width: 9px;
          height: 1px;
          top: 8px;
          left: 4px;
        }
      }
    }
  }
  .config-uploader__button {
    border: 1px solid #b6b6b6;
    background: #fff;
    padding: 5px 18px;
    color: #333;
    outline: 0;
    border-radius: 4px;
    cursor: pointer;
  }
  .config-uploader__file {
    margin-top: 8px;
  }
  .config-uploader__tip {
    margin-top: 8px;
    font-size: 12px;
    color: #999;
    &.config-uploader__tip--error {
      color: #ff0000;
    }
  }
}
.form-button {
  display: flex;
  margin-top: 0;
  padding-top: 25px;
  border-top: 1px solid var(--hr-color);
  .btn {
    width: 160px;
    &:first-child {
      margin-right: 20px;
    }
  }
}
</style>
