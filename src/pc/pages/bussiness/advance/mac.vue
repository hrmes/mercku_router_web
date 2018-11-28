<template>
  <div class="page">
    <div class="page-header">
      {{$t('trans0458')}}
    </div>
    <div class="page-content">
      <div class="form">
        <div class="form-item">
          <div @click="setSelected(true)" class="radio" :class="{'selected':isDefault}">
            {{$t('trans0459')}}
          </div>
          <p class="mac">{{mac.default}}</p>
        </div>
        <div class="form-item">
          <div @click="setSelected(false)" class="radio" :class="{'selected':!isDefault}">
            {{$t('trans0460')}}
          </div>
          <m-form ref="form" :model="mac" :rules="rules" v-show="!isDefault">
            <m-form-item prop="current" ref="current">
              <m-input class="input" @input="format" v-model="mac.current" :placeholder="$t('trans0321')"></m-input>
            </m-form-item>
          </m-form>
        </div>
      </div>
      <div class="form-button">
        <button class="btn primary" @click="updateMac">{{$t('trans0081')}}</button>
      </div>
    </div>
  </div>
</template>
<script>
import { formatMac, isMac } from 'util/util';

export default {
  data() {
    return {
      mac: {
        default: '',
        current: ''
      },
      isDefault: true,
      rules: {
        current: [
          {
            rule: value => isMac(value),
            message: this.$t('trans0231')
          }
        ]
      }
    };
  },
  mounted() {
    this.getMac();
  },
  methods: {
    removeColonOfMac(mac) {
      return mac.replace(/:/g, '');
    },
    format() {
      const mac = this.removeColonOfMac(this.mac.current);
      if (mac.length >= 2) {
        this.mac.current = mac.match(/.{1,2}/g).join(':');
      }
    },
    setSelected(val) {
      this.isDefault = val;
    },
    getMac() {
      this.$loading.open();
      this.$http
        .getWanMac()
        .then(res => {
          this.mac = {
            default: formatMac(res.data.result.default),
            current: formatMac(res.data.result.current)
          };
          this.isDefault = !this.mac.current;
          this.$loading.close();
        })
        .catch(() => {
          this.$loading.close();
        });
    },
    updateMac() {
      if (!this.isDefault && !this.$refs.form.validate()) {
        return;
      }
      this.$dialog.confirm({
        okText: this.$t('trans0024'),
        cancelText: this.$t('trans0025'),
        message: this.$t('trans0473'),
        callback: {
          ok: () => {
            this.$loading.open();
            let mac;
            if (this.isDefault) {
              mac = this.removeColonOfMac(this.mac.default);
            } else {
              mac = this.removeColonOfMac(this.mac.current);
            }
            this.$http
              .updateWanMac({ mac })
              .then(() => {
                this.$toast(this.$t('trans0040'), 3000, 'success');
                this.$loading.close();
                this.$reconnect({
                  timeout: 20,
                  onsuccess: () => {
                    this.$router.push({ path: '/advance/mac' });
                  },
                  ontimeout: () => {
                    this.$router.push({ path: '/unconnect' });
                  }
                });
              })
              .catch(() => {
                this.$loading.close();
              });
          }
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.page-content {
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.form {
  width: 350px;
  .radio {
    display: flex;
    align-items: center;
    padding-left: 24px;
    position: relative;
    cursor: pointer;
    &:before {
      content: '';
      position: absolute;
      left: 0;
      width: 14px;
      height: 14px;
      border-radius: 9px;
      border: 1px solid #b6b6b6;
    }
    &.selected {
      &:before {
        border-color: #d6001c;
      }
      &::after {
        content: '';
        display: block;
        position: absolute;
        left: 5px;
        top:50%;
        transform: translateY(-50%);
        width: 6px;
        height: 6px;
        background: #d6001c;
        border-radius: 50%;
      }
    }
  }
  .mac {
    padding-left: 24px;
    margin: 10px 0;
    height: 20px;
  }
  .input {
    margin-top: 10px;
  }
}
@media screen and (max-width: 768px) {
  .form {
    width: 100%;
  }
}
</style>
