<template>
  <div class="popup-page">
    <div class="popup-page__content">
      <div class="popup-page__content--main">
        <m-form ref="form"
                class="form"
                :model="form"
                :rules='rules'>
          <m-form-item class="item device-choose-wrap"
                       prop='name'
                       ref="name">
            <m-inputtable-select :label="$t('trans0108')"
                                 :placeholder="$t('trans1213')"
                                 :options="devicesFiltered"
                                 :identifier="'mac'"
                                 v-model="form.name"
                                 @autofill="autofill">
            </m-inputtable-select>
          </m-form-item>
          <m-form-item prop='mac'
                       ref="mac">
            <m-input :label="$t('trans0188')"
                     type="text"
                     @input="format"
                     :placeholder="$t('trans0321')"
                     v-model="form.mac" />
          </m-form-item>
          <m-form-item prop='ip'
                       ref="ip">
            <m-input :label="$t('trans0151')"
                     type="text"
                     :placeholder="$t('trans0321')"
                     v-model="form.ip" />
          </m-form-item>
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
import { ipReg, getStringByte, isMac, formatMac } from 'base/util/util';

export default {
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formatMac,
      modalShow: false,
      devices: [],
      form: {
        id: '',
        name: null,
        mac: '',
        ip: ''
      },
      rules: {
        name: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          },
          {
            rule: value => getStringByte(value) <= 20,
            message: this.$t('trans0261')
          }
        ],
        ip: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          },
          {
            rule: value => ipReg.test(value),
            message: this.$t('trans0231')
          }
        ],
        mac: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          },
          {
            rule: value => isMac(value),
            message: this.$t('trans0231')
          }
        ]
      }
    };
  },
  computed: {
    formType() {
      return this.isEdit ? 'update' : 'add';
    },
    devicesFiltered() {
      return this.devices.filter(
        item => this.formatMac(item.mac) !== this.form.mac
      );
    }
  },
  mounted() {
    this.getDevices();
    // 更新判断
    if (this.isEdit) {
      const { rsvdip } = this.$store.state.modules;
      if (rsvdip.id) {
        this.form = {
          id: rsvdip.id,
          ip: rsvdip.ip,
          name: rsvdip.name,
          mac: this.formatMac(rsvdip.mac)
        };
      }
    }
  },
  methods: {
    format() {
      const mac = this.form.mac.replace(/:/g, '');
      if (mac.length >= 2) {
        this.form.mac = mac.match(/.{1,2}/g).join(':');
      }
    },
    getDevices() {
      Promise.all([
        this.$http.meshRsvdipGet(),
        this.$http.getDeviceList({
          filters: [
            { type: 'primary', status: ['online'] },
            { type: 'guest', status: ['online'] }
          ]
        })
      ]).then(([res1, res2]) => {
        const deviceMacBindedArr = res1.data.result.map(item => item.mac);
        this.devices = res2.data.result.filter(
          v => !deviceMacBindedArr.includes(v.mac)
        );
      });
    },
    submit() {
      const fetchMethod =
        this.formType === 'update' ? 'meshRsvdipUpdate' : 'meshRsvdipAdd';

      if (this.$refs.form.validate()) {
        this.$loading.open();

        const macWithoutColons = this.form.mac.split(':').join('');
        const requestData = { ...this.form, mac: macWithoutColons };

        this.$http[fetchMethod](requestData)
          .then(() => {
            this.$toast(this.$t('trans0040'), 2000, 'success');
            this.$emit('refreshList');
            this.closeForm();
          })
          .finally(() => {
            this.$loading.close();
          });
      }
    },
    closeForm() {
      this.$emit('closeForm');
    },
    autofill(val) {
      this.form.mac = formatMac(val.mac);
      this.form.ip = val.ip;
    }
  }
};
</script>
<style lang="scss" scoped>
.page-content {
  .popup-page__content {
    .popup-page__content--main {
      overflow: initial;
    }
    .form-button__wrapper {
      justify-content: space-evenly;
    }
  }
}

@media screen and (max-width: 768px) {
  .page-content {
    .popup-page {
      flex: 1;
    }
    .popup-page__content {
      height: 100%;
    }
    .form {
      width: 100%;
      margin: 0 auto;
    }
  }
}
</style>
