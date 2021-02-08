<template>
  <div class="page">
    <div class="page-header">
      {{$t('trans0474')}}
    </div>
    <div class="page-content">
      <div class="form">
        <div class="form-item">
          <div @click="setSelected(true)"
               class="radio"
               :class="{'selected':isBoolDefault}">
            {{$t('trans0459')}}
          </div>
          <p class="mac">{{mac.default}}</p>
        </div>
        <div class="form-item">
          <div @click="setSelected(false)"
               class="radio"
               :class="{'selected':!isBoolDefault}">
            {{$t('trans0460')}}
          </div>
          <m-form ref="form"
                  :model="mac"
                  :rules="rules"
                  v-show="!isBoolDefault">
            <m-form-item prop="current"
                         ref="current">
              <m-input class="input"
                       ref="macInput"
                       @input="format"
                       v-model="mac.current"
                       :placeholder="$t('trans0321')"></m-input>
            </m-form-item>
          </m-form>
        </div>
      </div>
      <div class="form-button">
        <button class="btn primary"
                v-defaultbutton
                @click="updateMac">{{$t('trans0081')}}</button>
      </div>
    </div>
  </div>
</template>
<script>
import { formatMac, isMac } from 'base/util/util';

export default {
  computed: {
    isBoolDefault() {
      return this.isDefault === true;
    }
  },
  data() {
    return {
      mac: {
        default: '',
        current: ''
      },
      isDefault: null,
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
      const cursorPosition = this.$refs.macInput.getCursorPosition();
      const beforeLength = this.mac.current.length;
      const mac = this.removeColonOfMac(this.mac.current);
      if (mac.length >= 2) {
        const result = mac.match(/.{1,2}/g).join(':');
        const afterLength = result.length;
        let diff = afterLength - beforeLength;
        this.$nextTick(() => {
          this.mac.current = result;
          this.$nextTick(() => {
            if (diff < 0 && afterLength % 2 !== 0) {
              diff += 1;
            }
            const position = cursorPosition + diff;
            this.$refs.macInput.setCursorPosition(position);
          });
        });
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
        message: this.$t('trans0229'),
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
                this.$loading.close();
                this.$reconnect({
                  timeout: 60,
                  onsuccess: () => {
                    this.$toast(this.$t('trans0040'), 3000, 'success');
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
  width: 340px;
  .radio {
    display: flex;
    align-items: center;
    padding-left: 24px;
    position: relative;
    cursor: pointer;
    line-height: 1;
    height: 14px;
    &:before {
      content: '';
      position: absolute;
      left: 0;
      width: 12px;
      height: 12px;
      border-radius: 9px;
      border: 1px solid #b6b6b6;
    }
    &.selected {
      &:before {
        border-color: #333;
      }
      &::after {
        content: '';
        display: block;
        position: absolute;
        left: 4px;
        top: 50%;
        transform: translateY(-50%);
        width: 6px;
        height: 6px;
        background: #333;
        border-radius: 50%;
      }
    }
  }
  .mac {
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
