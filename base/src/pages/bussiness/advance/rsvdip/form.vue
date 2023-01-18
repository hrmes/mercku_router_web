<template>
  <div class="page">
    <div v-if="$store.state.isMobile"
         class='page-header'>
      {{$t('trans0444')}}
    </div>
    <div class="page-content">
      <m-form ref="form"
              class="form"
              :model="form"
              :rules='rules'>
        <m-form-item class="item device-choose-wrap"
                     prop='name'
                     ref="name">
          <m-input :label="$t('trans0108')"
                   type="text"
                   :placeholder="$t('trans0321')"
                   v-model="form.name" />
          <div class="device btn"
               @click.stop="()=>modalShow=!modalShow">
            <span>{{$t('trans0235')}}</span>
            <i>
              <img :class="{open:modalShow}"
                   src="../../../../assets/images/icon/ic_arrow_pack_up.png"
                   alt="">
            </i>
            <div class="modal"
                 v-show="modalShow"
                 @click.stop=""
                 v-clickoutside="()=>modalShow=false">
              <div class="opcity"
                   @click="modalShow=false"></div>
              <div class="modal-content">
                <!-- <div class="modal__header">{{$t('trans0235')}}</div> -->
                <div class="list">
                  <div class="device-item"
                       @click="checkDevice(item)"
                       v-for="(item,index) in devicesFiltered"
                       :key="index">
                    <div class="check">
                      <m-checkbox :readonly="true"
                                  :rect="false"
                                  v-model="item.checked"></m-checkbox>
                    </div>
                    <div class="des">
                      <p>{{item.name}}</p>
                      <p>
                        <label
                               class="with-colon">{{$t('trans0188')}}:</label>{{formatMac(item.mac)}}
                      </p>
                      <p><label class="with-colon">{{$t('trans0151')}}:</label>{{item.ip}}</p>
                    </div>
                  </div>
                </div>
                <div class="empty-device"
                     v-if="!devicesFiltered.length||!devices.length">
                  <p>{{$t('trans0278')}}</p>
                </div>
                <!-- <div class="empty"
                   v-if="!devices.length">
                <p style="color:#000;margin-top:50px;">{{$t('trans0278')}}</p>
              </div> -->
                <div class="btn-wrap">
                  <button class="btn btn-middle btn-default"
                          @click="()=>modalShow=false">{{$t('trans0025')}}</button>
                  <button class="btn btn-dialog-confirm"
                          @click="chooseDevice">{{$t('trans0024')}}</button>
                </div>
              </div>
            </div>
          </div>
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
        <button class="btn btn-middle btn-default"
                @click="$router.go(-1)">{{$t('trans0025')}}</button>
        <button class="btn btn-middle"
                @click="submit()">{{$t('trans0081')}}</button>
      </div>
    </div>
  </div>
</template>
<script>
import { ipReg, getStringByte, isMac, formatMac } from '../../../../util/util';

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
    },
    devicesFiltered() {
      return this.devices.filter(item => {
        item.checked = false;
        return this.formatMac(item.mac) !== this.form.mac;
      });
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
      console.log('12312', this.devices);
      console.log(this.devicesFiltered);
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
      console.log(device);
      console.log('$$$$', this.devices);
      console.log(this.devicesFiltered);
      this.devices.forEach(d => {
        if (d !== device) {
          d.checked = false;
        }
      });
      device.checked = !device.checked;
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
        this.devices = res2.data.result
          .filter(v => !deviceMacBindedArr.includes(v.mac))
          .map(v => ({ ...v, checked: false }));
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
.page-content {
  .form {
    .empty-device {
      p {
        padding: 50px 0;
        color: var(--text-default-color);
        margin: 0;
        text-align: center;
      }
    }
    .device-choose-wrap {
      display: flex;
      width: 340px;
      .device {
        width: 100px;
        height: 48px;
        display: flex;
        align-items: center;
        align-self: flex-end;
        justify-content: space-between;
        padding: 0 10px;
        margin-left: 10px;
        position: relative;
        cursor: pointer;
        &.btn {
          min-width: 100px;
        }
        i {
          display: flex;
          align-items: center;
          img {
            width: 10px;
            transform: rotate(-90deg);
            transition: all 0.3s;
            &.open {
              transform: rotate(0);
            }
          }
        }
        .modal {
          position: absolute;
          top: 50px;
          z-index: 1;
          left: -240px;
          width: 340px;
          border-radius: 4px;
          overflow: hidden;
          box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.04),
            0 2px 4px 0 rgba(0, 0, 0, 0.12);
          background-color: var(--select-popup-background-color);
          .modal-content {
            .modal__header {
              color: var(--text-default-color);
              text-align: left;
              font-weight: bold;
              border-bottom: 1px solid var(--table-body-hr-color);
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
                background: var(--select-item-active-background-color);
                cursor: pointer;
              }
              .des {
                flex: 1;
                justify-content: flex-start;
                margin-left: 20px;
                padding-bottom: 20px;
                p {
                  color: var(--text-default-color);
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
                width: 90%;
              }
              padding-top: 15px;
              // margin-top: 15px;
              padding-bottom: 15px;
              border-top: 1px solid var(--hr-color);
            }
          }
        }
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
}

@media screen and (max-width: 768px) {
  .page-content {
    .form {
      width: 100%;
      margin: 0 auto;
      .empty-device {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -60%);
      }
      .ext-item {
        margin-bottom: 0;
      }
      .item {
        width: 100%;
      }
      .device-choose-wrap {
        .device {
          .modal {
            position: fixed;
            width: 100vw;
            top: 0;
            bottom: 0;
            left: 0;
            z-index: 1000;
            padding-top: 65px;
            background: transparent;
            .opcity {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: rgba(0, 0, 0, 0.6);
            }
            .modal-content {
              display: flex;
              flex-direction: column;
              width: 100%;
              height: 100%;
              position: relative;
              background-color: var(--select-popup-background-color);
              border-top-left-radius: 10px;
              border-top-right-radius: 10px;
              overflow: hidden;
              .list {
                flex: 1;
                max-height: calc(100% - 70px);
                background: transparent;
                box-sizing: border-box;
              }
              .btn-wrap {
                width: 100%;
                height: 70px;
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
  }
}
</style>
