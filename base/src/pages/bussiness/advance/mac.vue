<template>
  <div class="page">
    <div v-if="$store.state.isMobile"
         class="page-header">
      {{$t('trans0474')}}
    </div>
    <div class="page-content">
      <div class="page-content__main">
        <div class="row-1">
          <div class="card">
            <div class="form-item">
              <div @click="setSelected(true)"
                   class="wrapper"
                   :class="{'selected':isBoolDefault}">
                <div class="radio"></div>
                <span>{{$t('trans0459')}}</span>
              </div>
              <p class="mac">{{mac.default}}</p>
            </div>
            <div class="form-item">
              <div @click="setSelected(false)"
                   class="wrapper"
                   :class="{'selected':!isBoolDefault}">
                <div class="radio"></div>
                <span> {{$t('trans0460')}}</span>
              </div>
              <m-form ref="form"
                      :model="mac"
                      :rules="rules"
                      v-show="!isBoolDefault">
                <m-form-item class="last"
                             prop="current"
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
        </div>

      </div>
      <div class="page-content__bottom">
        <div class="form-button__wrapper">
          <button class="btn"
                  v-defaultbutton
                  @click="updateMac">{{$t('trans0081')}}</button>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
import { formatMac, isMac } from 'base/util/util';

export default {
  computed: {
    isBoolDefault() {
      return this.isDefault;
    }
  },
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
                    this.$toast(this.$t('trans0040'), 2000, 'success');
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
.form-item {
  margin-bottom: 20px;
  &:last-child {
    margin: 0;
  }
}
.wrapper {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  cursor: pointer;
  .radio {
    position: relative;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 1.5px solid var(--checkbox-border-color);
    margin-right: 10px;
  }
  > span {
    font-weight: 500;
  }
  &.selected {
    .radio {
      &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 86%;
        height: 86%;
        background-color: var(--primaryColor);
        border-radius: 50%;
      }
    }
  }
}
.mac {
  font-size: 12px;
  color: var(--common-grey-color);
  margin: 0;
  padding: 0 28px;
}
.mk-form {
  padding-left: 28px;
}
</style>
