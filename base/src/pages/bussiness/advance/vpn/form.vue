<template>
  <div class="popup-page">
    <div class="popup-page__content">
      <div class="popup-page__content--main">
        <m-form class="form"
                ref="form"
                :model="form"
                :rules='rules'>
          <m-form-item prop='name'>
            <m-input :label="$t('trans0108')"
                     type="text"
                     :placeholder="$t('trans0321')"
                     v-model="form.name" />
          </m-form-item>
          <m-form-item prop='protocol'>
            <m-select :label="$t('trans0408')"
                      v-model="form.protocol"
                      :disabled="isEdit"
                      :options="protocolsList"></m-select>
          </m-form-item>
          <div v-if="form.protocol.toLowerCase() === VPNType.openvpn">
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
                         :placeholder="passwordConfigured ? '••••••••' : `${$t('trans0321')}`"
                         v-model="form.password"></m-input>
              </m-form-item>
            </div>
          </div>
          <div v-else-if="form.protocol.toLowerCase() === VPNType.wireguard">
            <div class="interface__wrapper">
              <m-form-item key="privateKey"
                           prop="wireguard.interface.private_key"
                           :rules="privateKeyRules.length ? privateKeyRules : wireguardRules.key">
                <m-input :label="$t('trans1177')"
                         type="text"
                         :placeholder="privateKeyConfigured ? '••••••••' : $t('trans0321')"
                         v-model="form.wireguard.interface.private_key" />
              </m-form-item>
              <m-form-item key="addresses"
                           prop="wireguard.interface.addresses[0]"
                           :rules="wireguardRules.ip">
                <m-input label="IP"
                         type="text"
                         :placeholder="$t('trans0321')"
                         v-model="form.wireguard.interface.addresses[0]" />
              </m-form-item>
              <m-form-item key="listen_port"
                           prop="wireguard.interface.listen_port"
                           :rules="wireguardRules.port">
                <m-input :label="$t('trans1155')"
                         type="number"
                         :placeholder="$t('trans0478')"
                         v-model.number="form.wireguard.interface.listen_port" />
              </m-form-item>
              <m-form-item key="mtu"
                           prop="wireguard.interface.mtu"
                           :rules="wireguardRules.mtu">
                <m-input :label="$t('trans1164')"
                         type="number"
                         :placeholder="$t('trans1184')"
                         v-model.number="form.wireguard.interface.mtu" />
              </m-form-item>
            </div>
            <div class="peers">
              <h4 class="title">{{$t('trans1165')}}</h4>
              <div class="peer"
                   v-for="(peer,index) in form.wireguard.peers"
                   :key="index">
                <m-form-item key="preshared_key"
                             :prop="`wireguard.peers[${index}].preshared_key`"
                             :rules="wireguardRules.preshared_key">
                  <m-input :label="$t('trans1166')"
                           type="text"
                           :placeholder="peer.preshared_key_set ? '••••••••' : $t('trans0321')"
                           v-model="peer.preshared_key" />
                </m-form-item>
                <m-form-item key="public_key"
                             :prop="`wireguard.peers[${index}].public_key`"
                             :rules="wireguardRules.key">
                  <m-input :label="$t('trans1176')"
                           type="text"
                           :placeholder="$t('trans0321')"
                           v-model="peer.public_key" />
                </m-form-item>
                <m-form-item key="allowed_ips"
                             :prop="`wireguard.peers[${index}].allowed_ips[0]`"
                             :rules="wireguardRules.ip">
                  <m-input :label="$t('trans1175')"
                           type="text"
                           :placeholder="$t('trans0321')"
                           v-model="peer.allowed_ips[0]" />
                </m-form-item>
                <m-form-item key="endpoint_host"
                             :prop="`wireguard.peers[${index}].endpoint_host`"
                             :rules="wireguardRules.optional_ip">
                  <m-input :label="`${$t('trans1167')} ${$t('trans0411')}`"
                           type="text"
                           :placeholder="$t('trans0321')"
                           v-model="peer.endpoint_host" />
                </m-form-item>
                <m-form-item key="endpoint_port"
                             :prop="`wireguard.peers[${index}].endpoint_port`"
                             :rules="wireguardRules.port">
                  <m-input :label="`${$t('trans1178')} ${$t('trans0411')}`"
                           type="number"
                           :placeholder="$t('trans0478')"
                           v-model.number="peer.endpoint_port" />
                </m-form-item>
                <m-form-item key="route_allowed_ips"
                             :prop="`wireguard.peers[${index}].route_allowed_ips`">
                  <m-checkbox :text="$t('trans1157')"
                              :bold="true"
                              v-model="peer.route_allowed_ips" />
                </m-form-item>
                <m-form-item key="persistent_keepalive"
                             class="persistent-keepalive"
                             :prop="`wireguard.peers[${index}].persistent_keepalive`">
                  <m-checkbox class="checkbox"
                              :text="$t('trans1179')"
                              :bold="true"
                              v-model="isKeepAlive"
                              @change="handleClickKeepAlive" />
                  <m-input v-if="isKeepAlive"
                           type="text"
                           :disabled="true"
                           :placeholder="$t('trans0321')"
                           :value="peer.persistent_keepalive" />
                </m-form-item>
              </div>
            </div>
          </div>
          <div v-else>
            <m-form-item key="server"
                         prop='server'>
              <m-input :label="$t('trans0409')"
                       type="text"
                       :placeholder="$t('trans0321')"
                       v-model="form.server" />
            </m-form-item>
            <m-form-item key="username"
                         prop='username'>
              <m-input :label="$t('trans0410')"
                       type="text"
                       :placeholder="$t('trans0321')"
                       v-model="form.username" />
            </m-form-item>
            <m-form-item key="password"
                         prop='password'>
              <m-input :label="`${$t('trans0003')} ${$t('trans0411')}`"
                       type='password'
                       :placeholder="passwordConfigured ? '••••••••' : `${$t('trans0321')}`"
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
      </div>
      <div class="popup-page__content--bottom">
        <div class="form-button__wrapper">
          <button class="btn btn-middle btn-default"
                  @click="closeForm">{{$t('trans0025')}}</button>
          <button class="btn btn-middle"
                  @click="submit()">{{$t('trans0081')}}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { VPNType } from 'base/util/constant';
import { getStringByte, isValidPassword } from 'base/util/util';
import wireguardConfig from 'base/mixins/wireguard-config';

const FormType = {
  add: 'add',
  update: 'update'
};
const Action = {
  updateVPN: 'updateVPN',
  addVPN: 'addVPN'
};

const MAX_FILE_SIZE = 1000 * 1000;
export default {
  mixins: [wireguardConfig],
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      VPNType,
      FormType,
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
          text: this.$t('trans1172')
        }
      ],
      form: {
        id: '',
        name: '',
        protocol: VPNType.pptp, // L2TP or PPTP
        server: '',
        username: '',
        password: '',
        url: ''
      },
      pptp: {
        mppe: false,
        mppc: false
      },
      openvpnForm: {
        advance: false,
        configFile: null,
        uploadToken: '',
        fileAccept: 'ovpn'
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
              if (value) return true;
              // ADD keeps its existing optional-password rule. On EDIT an empty
              // field may only be sent when the GET proved there is no stored
              // credential to lose (old Gen1 deletes the stored password when
              // the update omits it). OpenVPN follows its auth mode instead of
              // the PPTP/L2TP required-password rule.
              if (!this.isEdit) return true;
              if (this.form.protocol === VPNType.openvpn) {
                return !this.passwordConfigured && !this.passwordAvailable;
              }
              return false;
            },
            message: this.$t('trans0232')
          },
          {
            rule: value => !value || isValidPassword(value, 1, 64),
            message: this.$t('trans0125').format(1, 64)
          }
        ]
      },
      formParams: null,
      isEmptyFile: false,
      passwordConfigured: false,
      // Legacy GETs return the real password; Suite-only `password_set` does
      // not. Track which one this edit received so a blank submit is blocked
      // only when a stored credential could be lost.
      passwordAvailable: false,
      privateKeyConfigured: false,
      privateKeyRules: []
    };
  },
  mounted() {
    if (this.isEdit) {
      const { vpn } = this.$store.state.modules;
      if (vpn.id) {
        this.form = {
          id: vpn.id,
          name: vpn.name,
          protocol: vpn.protocol.toLowerCase()
        };
        this.passwordConfigured = vpn.password_set === true;
        this.passwordAvailable = typeof vpn.password === 'string' && vpn.password !== '';
        if (vpn.protocol?.toLowerCase() === VPNType.openvpn) {
          // Legacy wire returns the stored password; Suite returns
          // `password_set`. Preserve the existing file when no new upload token
          // is submitted.
          this.form.username = vpn.username || '';
          this.form.password = this.passwordAvailable ? vpn.password : '';
          this.openvpnForm.advance = !!(vpn.username || this.passwordAvailable || this.passwordConfigured);
          this.openvpnForm.configFile = vpn.openvpn?.config_present === true
            ? { update: true }
            : null;
        } else if (vpn.protocol?.toLowerCase() === VPNType.wireguard) {
          // Suite `mesh.vpn.get` returns non-secret interface/peers plus
          // `private_key_set` / `preshared_key_set`; secrets stay blank and
          // are preserved when the user does not enter a replacement.
          const sourceWireguard = vpn.wireguard && typeof vpn.wireguard === 'object'
            ? vpn.wireguard
            : {};
          const originalWireguard = JSON.parse(JSON.stringify(sourceWireguard));
          const sourceInterface = originalWireguard.interface &&
            typeof originalWireguard.interface === 'object'
            ? originalWireguard.interface
            : {};
          const sourcePeers = Array.isArray(originalWireguard.peers)
            ? originalWireguard.peers
            : [];
          this.privateKeyConfigured = sourceInterface.private_key_set === true;
          this.privateKeyRules = [
            {
              rule: value => (value === '' && this.privateKeyConfigured) ||
                (!/^\s*$/g.test(value) && getStringByte(value) === 44),
              message: this.$t('trans1209')
            }
          ];
          const modifiedWireguard = {
            ...originalWireguard,
            interface: {
              ...sourceInterface,
              private_key: '',
              listen_port: sourceInterface.listen_port || '',
              mtu: sourceInterface.mtu || ''
            },
            peers: sourcePeers.map(peer => ({
              ...peer,
              preshared_key: '',
              endpoint_port: peer.endpoint_port || ''
            }))
          };
          this.form.wireguard = modifiedWireguard;
        } else {
          this.form.server = vpn.server || '';
          this.form.username = vpn.username || '';
          // Legacy PPTP/L2TP edit must submit the real stored password back;
          // omitting it makes Gen1 clear the credential.
          this.form.password = this.passwordAvailable ? vpn.password : '';
          if (vpn.protocol?.toLowerCase() === VPNType.pptp) {
            this.pptp = {
              mppe: vpn.pptp?.mppe === true,
              mppc: vpn.pptp?.mppc === true
            };
          }
        }
      }
    }
  },
  computed: {
    formType() {
      return this.isEdit ? FormType.update : FormType.add;
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
      return this.$http.uploadFile(formData, () => { }, '/vpn_upload');
    },
    updateFormParams() {
      this.form.name = this.form.name.trim();
      let params = {
        id: this.form.id,
        name: this.form.name,
        protocol: this.form.protocol
      };
      if (this.form.protocol === VPNType.openvpn) {
        if (this.openvpnForm.advance) {
          if (this.form.username) params.username = this.form.username;
          // Always send the real value on edit (GET-returned or newly typed);
          // validation rejects a blank edit that could delete the credential.
          if (this.isEdit || this.form.password) params.password = this.form.password;
        }
        // Existing config is preserved when no replacement token is provided.
        if (!this.openvpnForm.configFile || !this.openvpnForm.configFile.update) {
          params.openvpn = { upload_token: this.openvpnForm.uploadToken };
        }
      } else if (this.form.protocol === VPNType.wireguard) {
        params = JSON.parse(JSON.stringify(this.form));
        params = this.deepClean(params);
        // GET-only presence flags are not part of the write contract.
        if (params.wireguard?.interface) delete params.wireguard.interface.private_key_set;
        if (Array.isArray(params.wireguard?.peers)) {
          params.wireguard.peers.forEach(peer => { delete peer.preshared_key_set; });
        }
      } else {
        params.server = this.form.server;
        params.username = this.form.username;
        // PPTP/L2TP edit must carry the real password explicitly; ADD keeps
        // the old optional-password shape.
        if (this.isEdit || this.form.password) params.password = this.form.password;
        if (this.form.protocol === VPNType.pptp) {
          params.pptp = this.pptp;
        }
      }
      this.formParams = params;
    },
    submitForm(method) {
      this.$http[method](this.formParams)
        .then(() => {
          this.$emit('refreshList');
          this.closeForm();
          this.$toast(this.$t('trans0040'), 2000, 'success');
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
        const fetchMethod =
          this.formType === FormType.update ? Action.updateVPN : Action.addVPN;
        this.updateFormParams();
        this.$loading.open();
        if (this.formParams.protocol === VPNType.openvpn) {
          if (!this.openvpnForm.configFile || !this.openvpnForm.configFile.update) {
            this.upload()
              .then(res => {
                // Server-owned staging token; no client filesystem path.
                this.openvpnForm.uploadToken = res.data.result.token;
                this.formParams.openvpn = { upload_token: this.openvpnForm.uploadToken };
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
    },
    handleClickKeepAlive() {
      console.log(this.isKeepAlive);
      if (this.isKeepAlive) {
        this.form.wireguard.peers[0].persistent_keepalive = 25;
      } else {
        this.form.wireguard.peers[0].persistent_keepalive = 0;
      }
    },
    closeForm() {
      this.$emit('closeForm');
    }
  }
};
</script>
<style lang="scss" scoped>
.popup-page__content {
  .form-button__wrapper {
    justify-content: space-evenly;
  }
}
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
    color: var(--text_default-color);
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
.peers {
  .title {
    margin: 0;
    font-size: 16px;
    color: var(--text_default-color);
    border-top: 1px solid var(--hr-color);
    padding: 25px 0;
  }
  .persistent-keepalive {
    display: flex;
    flex-direction: column;
    .checkbox {
      margin-bottom: 10px;
    }
  }
}
</style>
