<template>
  <div class="page">
    <div class='page-header'>
      {{$t('trans0444')}}
    </div>
    <div class="page-content">

      <m-form ref="form"
              class="form"
              :model="form"
              :rules='rules'>
        <div class="device"
             @click.stop="()=>modalShow=!modalShow">
          <span>{{$t('trans0235')}}</span>
          <i> <img :class="{open:modalShow}"
                 src="../../../../assets/images/icon/ic_arrow_pack_up.png"
                 alt=""></i>
          <div class="modal"
               v-show="modalShow"
               @click.stop=""
               v-clickoutside="()=>modalShow=false">
            <div class="opcity"></div>
            <div class="modal-content">
              <div class="modal__header">{{$t('trans0235')}}</div>
              <div class="list">
                <div class="device-item"
                     @click="checkDevice(item)"
                     v-for="(item,index) in devices"
                     :key="index">
                  <div class="check">
                    <m-checkbox :readonly="true"
                                v-model="item.checked"></m-checkbox>
                  </div>
                  <div class="des">
                    <p>{{item.name}}</p>
                    <p>{{$t('trans0188')}}：{{formatMac(item.mac)}}</p>
                    <p>{{$t('trans0151')}}：{{item.ip}}</p>
                  </div>
                </div>
              </div>
              <div class="btn-wrap">
                <button class="btn btn-middle btn-default"
                        @click="()=>modalShow=false">{{$t('trans0025')}}</button>
                <button class="btn btn-dialog-confirm"
                        @click="chooseDevice">{{$t('trans0024')}}</button>
              </div>
            </div>
          </div>
        </div>
        <m-form-item class="item"
                     prop='name'
                     ref="name">
          <m-input :label="$t('trans0108')"
                   type="text"
                   :placeholder="$t('trans0321')"
                   v-model="form.name" />
        </m-form-item>
        <m-form-item class="item"
                     prop='mac'
                     ref="mac">
          <m-input :label="$t('trans0188')"
                   type="text"
                   @input="format"
                   :placeholder="$t('trans0321')"
                   v-model="form.mac" />
        </m-form-item>
        <m-form-item class="item"
                     prop='ip'
                     ref="ip">
          <m-input :label="$t('trans0151')"
                   type="text"
                   :placeholder="$t('trans0321')"
                   v-model="form.ip" />
        </m-form-item>
      </m-form>
      <div class="btn-info form-button">
        <button class="btn"
                @click="submit()">{{$t('trans0081')}}</button>
      </div>
    </div>
  </div>
</template>
<script>
import { ipReg, getStringByte, isMac, formatMac } from 'util/util';

export default {
  data() {
    return {
      formatMac,
      modalShow: false,
      devices: [],
      form: {
        id: '',
        name: '',
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
            rule: value => getStringByte(value) <= 16,
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
      return this.$route.params.id ? 'update' : 'add';
    }
  },
  mounted() {
    this.getDevices();
    // 更新判断
    if (this.$route.params.id) {
      const { rsvdip } = this.$store.modules;
      if (rsvdip.id) {
        this.form = {
          id: rsvdip.id,
          ip: rsvdip.ip,
          name: rsvdip.name,
          mac: this.formatMac(rsvdip.mac)
        };
      } else {
        this.$router.push('/advance/rsvdip');
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
    chooseDevice() {
      this.devices.forEach(v => {
        if (v.checked) {
          this.form = {
            ...this.form,
            name: v.name,
            mac: this.formatMac(v.mac),
            ip: v.ip
          };
        }
      });
      this.modalShow = false;
    },
    checkDevice(device) {
      this.devices.forEach(d => {
        if (d !== device) {
          d.checked = false;
        }
      });
      device.checked = !device.checked;
    },
    getDevices() {
      this.$http
        .getDeviceList({
          filters: [
            { type: 'primary', status: ['online'] },
            { type: 'guest', status: ['online'] }
          ]
        })
        .then(res => {
          this.devices = res.data.result.map(v => ({ ...v, checked: false }));
        });
    },
    submit() {
      let fetchMethod = 'meshRsvdipAdd';
      if (this.formType === 'update') {
        fetchMethod = 'meshRsvdipUpdate';
      }
      if (this.$refs.form.validate()) {
        this.$loading.open();
        this.$http[fetchMethod]({
          ...this.form,
          mac: this.form.mac.split(':').join('')
        })
          .then(() => {
            this.$loading.close();
            this.$toast(this.$t('trans0040'), 3000, 'success');
            this.$router.push({ path: '/advance/rsvdip' });
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
.form {
  .btn-info {
    margin-top: 60px;
  }
  .item {
    margin-top: 30px;
  }
  .device {
    width: 120px;
    height: 36px;
    border-radius: 4px;
    background-color: #d6001c;
    color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    position: relative;
    cursor: pointer;
    &:active {
      background: rgb(182, 0, 24);
    }
    &:hover {
      background: rgb(182, 0, 24);
    }
    i {
      img {
        width: 12px;
        transition: all 0.3s;
        &.open {
          transform: rotate(180deg);
        }
      }
    }
    .modal {
      position: absolute;
      top: 42px;
      z-index: 1;
      left: 0;
      width: 480px;
      border-radius: 4px;
      box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.04), 0 2px 4px 0 rgba(0, 0, 0, 0.12);
      border: solid 1px #f1f1f1;
      background-color: #ffffff;
      .modal-content {
        .modal__header {
          color: #333;
          text-align: left;
          font-weight: bold;
          border-bottom: 1px solid #f1f1f1;

          font-size: 14px;
          padding: 20px 0 12px 0;
          margin: 0 30px;
        }
        .list {
          overflow: auto;
          max-height: 400px;
        }
        .device-item {
          display: flex;
          align-items: flex-start;
          padding: 20px 30px 0 30px;
          &:hover {
            background: #f1f1f1;
            cursor: pointer;
          }
          .des {
            flex: 1;
            justify-content: flex-start;
            margin-left: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid #f1f1f1;
            p {
              color: #333333;
              line-height: 1;
              padding: 0;
              margin: 0;
              margin-bottom: 10px;
              text-align: left;
              &:first-child {
                font-size: 14px;
                font-weight: bold;
              }
              &:last-child {
                margin-bottom: 0;
              }
            }
          }
        }
        .btn-wrap {
          display: flex;
          justify-content: center;
          align-items: center;
          .btn-default {
            display: none;
          }
          .btn {
            margin: 0 auto;
          }
          padding-top: 50px;
          padding-bottom: 30px;
        }
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .form {
    width: 100%;
    margin: 0 auto;
    .ext-item {
      margin-bottom: 0;
    }
    .item {
      width: 100%;
      margin-top: 30px;
    }
    .device {
      .modal {
        position: fixed;
        width: auto;
        top: 50%;
        left: 20px;
        right: 20px;
        transform: translateY(-50%);
        .modal-content {
          .list {
            width: 100%;
            max-height: 250px;
            background: white;
            box-sizing: border-box;
          }
          .btn-wrap {
            .btn {
              display: inline-block;
              width: 120px;
              min-width: initial;
            }
          }
        }
      }
    }
  }
}
</style>
