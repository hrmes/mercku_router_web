<template>
  <div class="page">
    <div v-if="$store.state.isMobile"
         class="page-header">
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
}
.form {
  width: 340px;
  .radio {
    position: relative;
    display: flex;
    align-items: center;
    height: 18px;
    padding-left: 24px;
    cursor: pointer;
    user-select: none;
    &:before {
      content: '';
      position: absolute;
      box-sizing: border-box;
      top: 0;
      left: 0;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      border: 1.5px solid var(--checkbox-border-color);
    }
    &.selected {
      &::before {
        border: 0;
        background: var(--checkbox-checked-background-color);
      }
      &::after {
        content: '\e65c';
        position: absolute;
        top: 1px;
        left: 2.5px;
        width: 12px;
        height: 12px;
        font-size: 12px;
        font-family: 'iconfont';
        color: #fff;
      }
    }
  }
  .mac {
    padding-left: 24px;
    margin: 10px 0;
    height: 20px;
    color: var(--text-gery-color);
  }
  .input {
    margin-top: 10px;
  }
}
.form-button {
  padding-top: 25px;
  margin-top: 0;
  border-top: 1px solid var(--hr-color);
}
@media screen and (max-width: 768px) {
  .form {
    width: 100%;
  }
}
</style>
