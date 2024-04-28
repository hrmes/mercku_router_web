<template>
  <div class="popup-page">
    <div class="popup-page__content">
      <div class="popup-page__content--main">
        <m-form ref="form"
                class="form"
                :model="form"
                :rules="rules">
          <m-form-item class="radio-wrap">
            <label>{{$t('trans0408')}}</label>
            <m-radio-group class="radio-group"
                           v-model="form.protocol"
                           :options="protocolOptions"></m-radio-group>
          </m-form-item>
          <m-form-item prop="name"
                       ref="name">
            <m-input :label="$t('trans0108')"
                     type="text"
                     :placeholder="$t('trans0321')"
                     v-model="form.name" />
          </m-form-item>
          <m-form-item prop="remoteIp"
                       ref="remoteIp">
            <m-input :label="`${$t('trans0425')} ${$t('trans0411')}`"
                     type="text"
                     :placeholder="$t('trans0492')"
                     v-model="form.remoteIp" />
          </m-form-item>
          <div class="item">
            <label>{{$t('trans0426')}}</label>
            <div class="port-wrap">
              <m-form-item class="form-item"
                           prop="remotePortFrom"
                           ref="remotePortFrom"
                           :errorMsgIsStatic="true">
                <m-input class="ext-input"
                         type="text"
                         :placeholder="$t('trans0478')"
                         v-model="form.remotePortFrom"
                         :onBlur="onRFChange" />
              </m-form-item>
              <div class="line">
                <i></i>
              </div>
              <m-form-item class="form-item"
                           prop="remotePortTo"
                           ref="remotePortTo"
                           :errorMsgIsStatic="true">
                <m-input class="ext-input"
                         type="text"
                         :placeholder="$t('trans0478')"
                         v-model="form.remotePortTo"
                         :onBlur="onRTChange" />
              </m-form-item>
            </div>
          </div>
          <m-form-item prop="localIp"
                       ref="localIp">
            <m-input :label="$t('trans0427')"
                     type="text"
                     :placeholder="$t('trans0321')"
                     v-model="form.localIp" />
          </m-form-item>
          <div class="item">
            <label>{{$t('trans0428')}}</label>
            <div class="port-wrap">
              <m-form-item class="form-item"
                           prop="localPortFrom"
                           ref="localPortFrom"
                           :errorMsgIsStatic="true">
                <m-input class="ext-input"
                         type="text"
                         :placeholder="$t('trans0478')"
                         v-model="form.localPortFrom"
                         :onBlur="onLFChange" />
              </m-form-item>
              <div class="line">
                <i></i>
              </div>
              <m-form-item class="form-item"
                           prop="localPortTo"
                           ref="localPortTo"
                           :errorMsgIsStatic="true">
                <m-input class="ext-input"
                         type="text"
                         :placeholder="$t('trans0478')"
                         v-model="form.localPortTo" />
              </m-form-item>
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
import { ipReg, getStringByte, portReg } from 'base/util/util';

export default {
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      protocolOptions: [
        {
          value: 'TCP&UDP',
          text: 'TCP&UDP'
        },
        {
          value: 'TCP',
          text: 'TCP'
        },
        {
          value: 'UDP',
          text: 'UDP'
        }
      ],
      form: {
        id: '',
        name: '',
        enabled: true,
        localIp: '',
        localPortFrom: '',
        localPortTo: '',
        remoteIp: '',
        remotePortFrom: '',
        remotePortTo: '',
        protocol: 'TCP&UDP' // TCPUDP, TCP, UDP
      },
      rules: {
        name: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          },
          {
            rule: value => getStringByte(value) <= 16,
            message: this.$t('trans0261')
          }
        ],
        remoteIp: [
          {
            rule: value => (value ? ipReg.test(value) : value !== 0),
            message: this.$t('trans0231')
          }
        ],
        remotePortFrom: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          },
          {
            rule: value => portReg.test(value),
            message: this.$t('trans0478')
          }
        ],
        remotePortTo: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          },
          {
            rule: value => portReg.test(value),
            message: this.$t('trans0478')
          },
          {
            rule: value => {
              if (this.form.remotePortFrom) {
                return Number(this.form.remotePortFrom) <= Number(value);
              }
              return true;
            },
            message: this.$t('trans0471')
          }
        ],
        localIp: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          },
          {
            rule: value => ipReg.test(value),
            message: this.$t('trans0231')
          }
        ],
        localPortFrom: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          },
          {
            rule: value => portReg.test(value),
            message: this.$t('trans0478')
          }
        ],
        localPortTo: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          },
          {
            rule: value => portReg.test(value),
            message: this.$t('trans0478')
          },
          {
            rule: value => {
              if (this.form.localPortFrom) {
                return Number(this.form.localPortFrom) <= Number(value);
              }
              return true;
            },
            message: this.$t('trans0471')
          },
          {
            rule: value => {
              const rf = this.form.remotePortFrom;
              const rt = this.form.remotePortTo;
              const lf = this.form.localPortFrom;
              if (rf && rt && lf) {
                const range = Number(rt) - Number(rf);
                const range1 = Number(value) - Number(lf);
                return range === range1;
              }
              return true;
            },
            message: this.$t('trans0429')
          }
        ]
      }
    };
  },
  computed: {
    formType() {
      return this.isEdit ? 'update' : 'add';
    },
    formParams() {
      return {
        id: this.form.id,
        name: this.form.name,
        enabled: this.form.enabled,
        protocol: this.form.protocol,
        local: {
          ip: this.form.localIp,
          port: {
            from: this.form.localPortFrom
              ? Number(this.form.localPortFrom)
              : '',
            to: this.form.localPortTo ? Number(this.form.localPortTo) : ''
          }
        },
        remote: {
          ip: this.form.remoteIp,
          port: {
            from: this.form.remotePortFrom
              ? Number(this.form.remotePortFrom)
              : '',
            to: this.form.remotePortTo ? Number(this.form.remotePortTo) : ''
          }
        }
      };
    }
  },
  mounted() {
    if (this.isEdit) {
      const { portfw } = this.$store.state.modules;
      if (portfw.id) {
        this.form = {
          id: portfw.id,
          name: portfw.name,
          enabled: portfw.enabled,
          localIp: portfw.local.ip,
          localPortFrom: portfw.local.port.from,
          localPortTo: portfw.local.port.to,
          remoteIp: portfw.remote.ip,
          remotePortFrom: portfw.remote.port.from,
          remotePortTo: portfw.remote.port.to,
          protocol: portfw.protocol
        };
      }
    }
  },
  methods: {
    validateLT() {
      this.$refs.localPortTo.extraValidate(() => {
        const lf = this.form.localPortFrom;
        const lt = this.form.localPortTo;
        if (lf && lt) {
          return Number(lt) >= Number(lf);
        }
        return true;
      }, this.$t('trans0471'));
      this.$refs.localPortTo.extraValidate(() => {
        const rf = this.form.remotePortFrom;
        const rt = this.form.remotePortTo;
        const lf = this.form.localPortFrom;
        const lt = this.form.localPortTo;
        if (rf && rt && lf && lt) {
          const range = Number(rt) - Number(rf);
          const range1 = Number(lt) - Number(lf);
          return range === range1;
        }
        return true;
      }, this.$t('trans0429'));
    },
    onRFChange() {
      this.$refs.remotePortTo.extraValidate(() => {
        const rf = this.form.remotePortFrom;
        const rt = this.form.remotePortTo;
        if (rf && rt) {
          return Number(rt) >= Number(rf);
        }
        return true;
      }, this.$t('trans0471'));
      this.validateLT();
    },
    onRTChange() {
      this.validateLT();
    },
    onLFChange() {
      this.validateLT();
    },
    async submit() {
      const fetchMethod =
        this.formType === 'update' ? 'meshPortfwUpdate' : 'meshPortfwAdd';

      if (this.$refs.form.validate()) {
        try {
          this.$loading.open();
          await this.$http[fetchMethod](this.formParams);
          this.$toast(this.$t('trans0040'), 2000, 'success');
          this.$emit('refreshList');
          this.closeForm();
        } catch (error) {
          console.error(error);
        } finally {
          this.$loading.close();
        }
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
  .form {
    width: 100%;
    .item {
      margin-bottom: 0;
      label {
        font-weight: 700;
        color: var(--input_label-color);
      }
      .port-wrap {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-top: 5px;
        .form-item {
          flex: 1;
        }
        .ext-input {
          width: 100%;
        }
        .line {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 40px;
          height: 48px;
        }
        i {
          width: 80%;
          height: 1px;
          background: #999999;
        }
      }
    }
    .radio-wrap {
      display: flex;
      flex-direction: column;
      label {
        color: var(--input_label-color);
        font-weight: 700;
        margin-bottom: 20px;
      }
    }
    .radio-group {
      width: fit-content;
    }
  }
  .form-button__wrapper {
    justify-content: space-evenly;
  }
}
@media screen and (max-width: 768px) {
  .form-button {
    display: flex;
  }
  .form {
    // padding-bottom: 50px;/
    width: 100%;
    margin: 0 auto;
    .ext-item {
      margin-bottom: 0;
    }
    .item {
      width: 100%;
      margin-top: 30px;
      .port-wrap {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .ext-input {
          width: auto !important;
        }
        i {
          width: 30px;
          height: 1px;
          background: #999999;
          margin: 0 10px;
        }
      }
    }
    .radio-wrap {
      width: 100%;
      display: flex;
      flex-direction: column;
      span {
        margin-bottom: 10px;
      }
    }
    .radio-group {
      width: 100%;
      min-width: 100%;
      flex-direction: column;
    }
  }
}
</style>
