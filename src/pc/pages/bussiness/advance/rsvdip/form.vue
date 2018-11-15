<template>
  <div class="page">
    <div v-if="reboot">
      <m-progress :label="$t('trans0315')"></m-progress>
    </div>
    <div class='page-header'>
      {{formType==='update'?$t('trans0034'):$t('trans0035')}}{{$t('trans0444')}}
    </div>
    <div class="page-content">

      <div class="form">
        <m-form ref="form" :model="form" :rules='rules'>
          <div class="device" @click.stop="()=>modalShow=!modalShow">
            <span>{{$t('trans0235')}}</span>
            <i> <img :class="{open:modalShow}" src="../../../../assets/images/ic_arrow_pack_up.png" alt=""></i>
            <div class="modal" v-if="modalShow" @click.stop="">
              <div class="opcity"></div>
              <div class="modal-content">
                <div class="list">
                  <div class="device-item" v-for="(item,index) in devices" :key="index">
                    <div class="check">
                      <m-checkbox v-model="item.checked" :onChange="(v)=>change(v,item)"></m-checkbox>
                    </div>
                    <div class="des">
                      <p>{{item.name}}</p>
                      <p>MAC：{{formatMac(item.mac)}}</p>
                      <p>IP：{{item.ip}}</p>
                    </div>
                  </div>
                </div>
                <div class="btn-wrap">
                  <button class="btn btn-default" @click="()=>modalShow=false">{{$t('trans0025')}}</button>
                  <button class="btn" @click="chooseDevice">{{$t('trans0024')}}</button>
                </div>
              </div>
            </div>
          </div>
          <m-form-item class="item" prop='name' ref="name">
            <m-input :label="$t('trans0108')" type="text" :placeholder="$t('trans0321')" v-model="form.name" />
          </m-form-item>
          <m-form-item class="item" prop='mac' ref="mac">
            <m-input :label="$t('trans0188')" type="text" @input="format" :placeholder="$t('trans0321')" v-model="form.mac" />
          </m-form-item>
          <m-form-item class="item" prop='ip' ref="ip">
            <m-input :label="$t('trans0151')" type="text" :placeholder="$t('trans0321')" v-model="form.ip" />
          </m-form-item>
        </m-form>
        <div class="btn-info">
          <button class="btn" @click="submit()">{{$t('trans0081')}}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  ipReg,
  getStringByte,
  isMac,
  formatMac
} from '../../../../../util/util';

export default {
  data() {
    return {
      reboot: false,
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
      return this.$route.params.id ? 'update' : 'add';
    }
  },
  mounted() {
    this.getDevices();
    // 更新判断
    if (this.$route.params.id) {
      const { rsvdip } = this.$store.state;
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
    change(v, item) {
      if (v) {
        this.devices.forEach(n => {
          if (n.mac !== item.mac) {
            n.checked = false;
          }
        });
      }
    },
    getDevices() {
      this.$http.meshDeviceGet().then(res => {
        this.devices = res.data.result.map(v => ({ ...v, checked: false }));
      });
    },
    submit() {
      const fetchMethod =
        this.formType === 'update' ? 'meshRsvdipUpdate' : 'meshRsvdipAdd';
      if (this.$refs.form.validate()) {
        this.$dialog.confirm({
          okText: this.$t('trans0024'),
          cancelText: this.$t('trans0025'),
          message: this.$t('trans0473'),
          callback: {
            ok: () => {
              this.$loading.open();
              this.$http[fetchMethod]({
                ...this.form,
                mac: this.form.mac.split(':').join('')
              })
                .then(() => {
                  this.$loading.close();
                  this.$toast(this.$t('trans0040'), 3000, 'success');
                  this.reboot = true;
                  this.$reconnect({
                    onsuccess: () => {
                      this.$router.push({ path: '/advance/rsvdip' });
                    },
                    ontimeout: () => {
                      this.$router.push({ path: '/unconnect' });
                    }
                  });

                  // this.$router.push('/advance/rsvdip');
                })
                .catch(() => {
                  this.$loading.close();
                });
            }
          }
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.form {
  padding-bottom: 50px;
  .btn-info {
    margin-top: 30px;
  }
  width: 400px;
  margin: 0 auto;
  margin-top: 30px;
  .item {
    width: 350px;
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
      top: 37px;
      z-index: 1;
      left: 0;
      width: 300px;
      height: 458px;
      border-radius: 2px;
      box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.04), 0 2px 4px 0 rgba(0, 0, 0, 0.12);
      border: solid 1px #e7e7e7;
      background-color: #ffffff;
      .list {
        width: 300px;
        height: 358px;
        overflow-y: auto;
      }
      .device-item {
        display: flex;
        padding: 30px;
        min-height: 55px;
        .check {
          width: 46px;
        }
        .des {
          flex: 1;
          border-bottom: 1px solid #f1f1f1;
          padding-bottom: 10px;
          p {
            color: #333333;
            line-height: 1;
            padding: 0;
            margin: 0;
            margin-bottom: 10px;
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
          width: 120px;
          height: 42px;
        }
        height: 100px;
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .form {
    padding-bottom: 50px;
    .btn-info {
      margin-top: 30px;
    }
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
        width: 100%;
        height: 100%;
        top: 0;
        background: transparent;
        display: flex;
        justify-content: center;
        align-items: center;
        .opcity {
          position: fixed;
          width: 100%;
          height: 100%;
          top: 0;
          z-index: -1;
          background: rgba(0, 0, 0, 0.6);
        }
        .modal-content {
          background: white;
          width: 85%;
          .list {
            width: 100%;
            background: white;
            box-sizing: border-box;
          }
          .btn-wrap {
            .btn-default {
              display: inline-block;
            }
          }
        }
      }
      i {
        display: none;
      }
    }
  }
}
</style>

