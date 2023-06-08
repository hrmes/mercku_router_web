<template>
  <div class="page firewall">
    <div v-if="$store.state.isMobile"
         class='page-header'>
      {{$t('trans0424')}}
    </div>
    <div class="page-content">
      <div class="content">
        <div class="content__item content__switch">
          <m-switch v-model="wan.dos"
                    @change="updateWanDos"></m-switch>
          <label for="">{{$t('trans0424')}}</label>
        </div>
        <div class="content__line"></div>
        <div class="content__item content__switch">
          <m-switch v-model="ping.enabled"
                    @change="updateWanPing"></m-switch>
          <label for="">{{$t('trans0434')}}</label>
        </div>
        <template v-if="ping.enabled">
          <m-form ref="ipListForm"
                  :model="ping"
                  class="content__item form">
            <m-form-item style="margin-bottom:20px">
              <m-checkbox class="form__checkbox"
                          v-model="isIpPointed"
                          :text="$t('trans0575')"
                          :rect="false"
                          @change="changeIpPointed"></m-checkbox>
            </m-form-item>
            <template v-if="isIpPointed">
              <div class="flex-container">
                <m-form-item v-for="(value, index) in ping.ip_limit.ip_list"
                             :key="index"
                             :prop="`ping.ip_limit.ip_list[${index}]`"
                             :rules='ipValidator'>
                  <div class="form__item">
                    <m-input class="form__input"
                             type="text"
                             :placeholder="$t('trans0321')"
                             v-model="ping.ip_limit.ip_list[index]" />
                    <div @click="reduceIp(index)"
                         class="form__reduce-btn">
                      <span></span>
                    </div>
                  </div>
                </m-form-item>
              </div>
              <m-form-item v-if="!isMaxIpNum">
                <button class="form__add-btn"
                        @click="addIp">
                  <span></span>
                </button>
              </m-form-item>
            </template>
            <m-form-item class="submit-btn__wrapper">
              <button class="btn"
                      v-defaultbutton
                      @click="submit">{{$t('trans0081')}}</button>
            </m-form-item>
          </m-form>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import { isIP } from 'base/util/util';

const cloneDeep = require('lodash/cloneDeep');

const maxIpNum = 10;
const Mode = {
  free: 'free',
  blacklist: 'blacklist',
  whitelist: 'whitelist'
};
export default {
  data() {
    return {
      wan: {
        dos: false,
        ping: {
          enabled: false,
          ip_limit: {
            mode: Mode.free,
            ip_list: []
          }
        }
      },
      ping: {
        enabled: false,
        ip_limit: {
          mode: Mode.free,
          ip_list: []
        }
      },
      ip_limit: {
        mode: Mode.free,
        ip_list: []
      },
      pingEnabledInitialized: false,
      isIpPointed: false,
      ipValidator: [
        {
          rule: value => !/^\s*$/g.test(value),
          message: this.$t('trans0232')
        },
        {
          rule: value => isIP(value),
          message: this.$t('trans0231')
        }
      ]
    };
  },
  computed: {
    allowedIpsLen() {
      return this.ping.ip_limit.ip_list.length;
    },
    isMaxIpNum() {
      return this.allowedIpsLen === maxIpNum;
    }
  },
  mounted() {
    this.getFirewall();
  },
  methods: {
    changeIpPointed() {
      if (this.isIpPointed) {
        if (!this.allowedIpsLen) {
          this.ping.ip_limit.ip_list = [''];
        }
      } else {
        this.ping.ip_limit.ip_list = this.ping.ip_limit.ip_list.filter(ip => !!ip);
      }
    },
    addIp() {
      if (this.isMaxIpNum) {
        this.$toast(this.$t('trans0060'), 3000, 'error');
        return;
      }
      this.ping.ip_limit.ip_list.push('');
    },
    reduceIp(index) {
      this.ping.ip_limit.ip_list.splice(index, 1);
    },
    getFirewall() {
      this.$loading.open();
      this.$http.getFirewall().then(res => {
        this.$loading.close();
        const data = res.data.result;
        const { wan } = data;
        this.wan = wan;
        this.ping = cloneDeep(wan.ping);
        this.ip_limit = cloneDeep(this.wan.ping.ip_limit);
        this.pingEnabledInitialized = this.ping.enabled;
        this.isIpPointed = this.ping.ip_limit.mode === Mode.whitelist;
      });
    },
    updateWanDos() {
      this.updateFirewall();
    },
    updateWanPing(enabled) {
      if (!enabled) {
        if (this.pingEnabledInitialized !== this.ping.enabled) {
          this.wan.ping.ip_limit = this.ip_limit;
          this.wan.ping.enabled = false;
          this.updateFirewall();
        }
      }
    },
    submit() {
      if (!this.$refs.ipListForm.validate()) {
        return;
      }
      this.ping.ip_limit.mode = this.isIpPointed ? Mode.whitelist : Mode.free;
      this.wan.ping = this.ping;
      this.ip_limit = cloneDeep(this.wan.ping.ip_limit);
      this.updateFirewall();
    },
    updateFirewall() {
      this.$loading.open();
      this.$http
        .updateFirewall({
          wan: this.wan
        })
        .then(() => {
          this.pingEnabledInitialized = this.wan.ping.enabled;
          this.$loading.close();
          this.$toast(this.$t('trans0040'), 3000, 'success');
        })
        .catch(() => {
          this.$loading.close();
        });
    }
  }
};
</script>
<style lang="scss">
.firewall {
  .page-content {
    padding: 0 !important;
  }
}
</style>
<style lang="scss" scoped>
.content {
  width: 100%;
  .content__item {
    width: 100%;
    padding: 0 20px;
  }
  .content__switch {
    display: flex;
    align-items: center;
    height: 80px;
    border-radius: 10px;
    overflow: hidden;
    label {
      font-weight: bold;
      margin-right: 10px;
    }
  }
  .content__line {
    width: 100%;
    height: 10px;
    background: var(--flex-warp-has-menu-bgc);
  }
  .form {
    .form__item {
      display: flex;
      align-items: center;
      height: 48px;
    }
    .form__reduce-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 12px;
      width: 24px;
      height: 24px;
      background-color: #f1f1f1;
      border-radius: 100%;
      cursor: pointer;
      span {
        display: inline-block;
        height: 2px;
        width: 12px;
        border-radius: 1px;
        background-color: #333333;
      }
    }
    .form__add-btn {
      outline: none;
      border: 1.5px solid var(--primaryColor);
      cursor: pointer;
      white-space: nowrap;
      border-radius: 4px;
      width: 340px;
      height: 48px;
      user-select: none;
      color: var(--primaryColor);
      background-color: transparent;
      span {
        display: inline-block;
        width: 24px;
        height: 24px;
        position: relative;
        &::before {
          content: '';
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          height: 20px;
          width: 2px;
          background-color: var(--primaryColor);
        }
        &::after {
          content: '';
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 20px;
          height: 2px;
          background-color: var(--primaryColor);
        }
      }
    }
    .submit-btn__wrapper {
      // margin-top: 25px;
      padding-top: 25px;
      border-top: 1px solid var(--hr-color);
    }
    .flex-container {
      display: flex;
      flex-wrap: wrap;
      > .form-item {
        width: fit-content;
        margin-right: 30px;
        &:first-child {
          .form__reduce-btn {
            visibility: hidden;
          }
        }
      }
    }
  }
  @media screen and(max-width: 768px) {
    // padding: 0 20px;
    .content__item {
      width: 100%;
    }
    .content__switch {
      height: 60px;
    }
    .form {
      .form__item {
        position: relative;
      }
      .form__reduce-btn {
        position: absolute;
        margin-left: 0px;
        top: -12px;
        right: -12px;
      }
      .form__add-btn {
        width: 100%;
      }
      .flex-container {
        > .form-item {
          width: 100%;
          margin-right: 0;
        }
      }
    }
  }
}
</style>
