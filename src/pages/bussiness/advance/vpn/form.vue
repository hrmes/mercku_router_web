<template>
  <div class="page">
    <div class='page-header'>
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
                    :options="protocols"></m-select>
        </m-form-item>
        <div v-if="form.protocol !== VPNType.openvpn">
          <m-form-item class="item"
                       prop='server'>
            <m-input :label="$t('trans0409')"
                     type="text"
                     :placeholder="$t('trans0321')"
                     v-model="form.server" />
          </m-form-item>
          <m-form-item class="item"
                       prop='username'>
            <m-input :label="$t('trans0410')"
                     type="text"
                     :placeholder="$t('trans0321')"
                     v-model="form.username" />
          </m-form-item>
          <m-form-item class="item"
                       prop='password'>
            <m-input :label="`${$t('trans0003')}${$t('trans0411')}`"
                     type='password'
                     :placeholder="`${$t('trans0321')}`"
                     v-model="form.password"></m-input>
          </m-form-item>
          <div class="opz-info"
               v-if="form.protocol===VPNType.pptp">
            <div class="opz">
              <label style="font-weight:bold;">{{$t('trans0412')}}</label>
              <m-switch v-model="pptp.mppe"></m-switch>
            </div>
            <div class="opz">
              <label style="font-weight:bold;">{{$t('trans0413')}}</label>
              <m-switch v-model="pptp.mppc"></m-switch>
            </div>
          </div>
        </div>
        <div v-if="form.protocol === VPNType.openvpn">
          <div class="config-uploader">
            <div class="config-uploader__inner">
              <div class="config-uploader__label">{{$t('trans0673')}}</div>
              <button @click="triggerFileInput"
                      class="config-uploader__button">
                <span>{{ openvpnConfigFile ? $t('trans0675') : $t('trans0006') }}</span>
                <input type="file"
                       @change="onFileChange"
                       ref="uploadInput"
                       :accept="`.${openvpnFileAccept}`"
                       hidden="hidden" />
              </button>
              <div v-if="openvpnConfigFile"
                   class="config-uploader__status"
                   :class="{'config-uploader__status--error':isErrorFileExt}">
                <span class="config-uploader__icon"></span>
                <span>{{isErrorFileExt ? $t('trans0689'): $t('trans0691')}}</span>
              </div>
            </div>
            <div class="config-uploader__tip"
                 :class="{'config-uploader__tip--error':isErrorFileExt}">
              {{$t('trans0678')}}
            </div>
          </div>
        </div>
      </m-form>
      <div class="btn-info form-button">
        <button class="btn"
                @click="submit()">{{$t('trans0081')}}</button>
      </div>
    </div>

  </div>
</template>
<script>
import { getStringByte } from 'util/util';
import { VPNType } from 'util/constant';

export default {
  data() {
    return {
      VPNType,
      protocols: [
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
        }
      ],
      pptp: {
        mppe: false,
        mppc: false
      },
      form: {
        id: '',
        name: '',
        protocol: VPNType.pptp, // L2TP or PPTP
        server: '',
        username: '',
        password: ''
      },
      rules: {
        name: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0237')
          },
          {
            rule: value => getStringByte(value) <= 20,
            message: this.$t('trans0261')
          }
        ],
        server: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
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
        ]
      },
      openvpnConfigFile: null,
      openvpnConfigUrl: '',
      openvpnFileAccept: 'ovpn'
    };
  },
  mounted() {
    if (this.$route.params.id) {
      const { vpn } = this.$store.modules;
      // no records in store, redirect to list
      if (vpn.id) {
        this.form = {
          id: vpn.id,
          name: vpn.name,
          protocol: vpn.protocol.toLowerCase()
        };
        if (vpn.protocol !== VPNType.openvpn) {
          this.form.server = vpn.server;
          this.form.username = vpn.username;
          this.form.password = vpn.password;
          if (vpn.protocol === VPNType.pptp) {
            this.pptp = {
              mppe: vpn.pptp.mppe,
              mppc: vpn.pptp.mppc
            };
          }
        } else {
          this.openvpnConfigFile = {
            update: true
          };
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
      const params = {
        id: this.form.id,
        name: this.form.name,
        protocol: this.form.protocol
      };
      if (this.form.protocol !== VPNType.openvpn) {
        params.server = this.form.server;
        params.username = this.form.username;
        params.password = this.form.password;
        if (this.form.protocol === VPNType.pptp) {
          params.pptp = this.pptp;
        }
      } else if (!this.openvpnConfigFile.update) {
        params.openvpn = {
          url: this.openvpnConfigUrl
        };
      }

      return params;
    },
    isErrorFileExt() {
      if (this.openvpnConfigFile && !this.openvpnConfigFile.update) {
        const ext = this.openvpnConfigFile.name.split('.').slice(-1)[0];
        if (ext === this.openvpnFileAccept) {
          return false;
        }
        return true;
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
      const postFiles = Array.prototype.slice.call(files);
      [this.openvpnConfigFile] = postFiles;
    },
    upload() {
      const formData = new FormData();
      formData.append('type', 'openvpn');
      formData.append('file', this.openvpnConfigFile);
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
      if (this.$refs.form.validate() && !this.isErrorFileExt) {
        const fetchMethod = this.formType === 'update' ? 'updateVPN' : 'addVPN';
        this.$loading.open();
        if (
          this.formParams.protocol === VPNType.openvpn &&
          !this.openvpnConfigFile.update
        ) {
          this.upload()
            .then(res => {
              this.openvpnConfigUrl = res.data.result.url;
              this.submitForm(fetchMethod);
            })
            .catch(() => {
              this.$loading.close();
            });
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
.config-uploader {
  width: 340px;
  margin-bottom: 30px;
  .config-uploader__inner {
    display: flex;
    align-items: center;
  }
  .config-uploader__label {
    color: #333;
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
      color: #d6001c;
      .config-uploader__icon {
        background: #d6001c;
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
      color: #d6001c;
    }
  }
}
</style>
