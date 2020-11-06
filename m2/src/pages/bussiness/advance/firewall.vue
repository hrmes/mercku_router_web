<template>
  <div class="page firewall">
    <div class='page-header'>
      {{$t('trans0424')}}
    </div>
    <div class="page-content">
      <div class="content">
        <div class="content__item content__switch">
          <label for="">{{$t('trans0424')}}</label>
          <m-switch v-model="wan.dos"></m-switch>
        </div>
        <div class="content__line"></div>
        <div class="content__item content__switch">
          <label for="">{{$t('trans0434')}}</label>
          <m-switch v-model="wan.ping.enabled"></m-switch>
        </div>
        <m-form ref="ipListForm"
                :model="wan"
                class="content__item form">
          <m-checkbox class="form__checkbox"
                      v-model="isIpPointed"
                      :text="$t('trans0575')"></m-checkbox>
          <template v-if="isIpPointed">
            <m-form-item v-for="(value, index) in wan.ping.allowedIps"
                         :key="index"
                         :prop="`ping.allowedIps[${index}]`"
                         :rules='ipValidator'>
              <div class="form__item">
                <m-input class="form__input"
                         type="text"
                         :placeholder="$t('trans0492')"
                         v-model="wan.ping.allowedIps[index]" />
                <div @click="reduceIp(index)"
                     class="form__reduce-btn">
                  <span></span>
                </div>
              </div>
            </m-form-item>
            <m-form-item>
              <button v-if="!isMaxIpNum"
                      class="form__add-btn"
                      @click="addIp"
                      v-defaultbutton>
                <span></span>
              </button>
            </m-form-item>
          </template>
          <m-form-item>
            <button class="btn"
                    v-defaultbutton
                    @click="updateFirewall">{{$t('trans0081')}}</button>
          </m-form-item>
        </m-form>
      </div>
    </div>
  </div>
</template>
<script>
import { isIP } from '@/util/util';

const maxIpNum = 10;
export default {
  data() {
    return {
      wan: {
        dos: false,
        ping: {
          enabled: false,
          allowedIps: []
        }
      },
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
      return this.wan.ping.allowedIps.length;
    },
    isMaxIpNum() {
      return this.allowedIpsLen === maxIpNum;
    }
  },
  mounted() {
    this.getFirewall();
  },
  methods: {
    addIp() {
      if (this.isMaxIpNum) {
        this.$toast(this.$t('trans0060'), 3000, 'error');
        return;
      }
      this.wan.ping.allowedIps.push('');
    },
    reduceIp(index) {
      this.wan.ping.allowedIps.splice(index, 1);
    },
    getFirewall() {
      this.$http.getFirewall().then(res => {
        const data = res.data.result;
        const [dos, ping] = data.wan;
        this.wan.dos = dos;
        this.wan.ping.enabled = ping.enabled;
        this.wan.ping.allowedIps = ping.allowed_ips;
        this.isIpPointed = !!this.wan.ping.allowedIps.length;
      });
    },
    updateFirewall() {
      if (!this.$refs.ipListForm.validate()) {
        return;
      }
      const wanData = {
        dos: this.wan.dos,
        ping: {
          enabled: this.wan.ping.enabled,
          allowed_ips: this.wan.ping.allowedIps
        }
      };
      this.$loading.open();
      this.$http
        .updateFirewall({
          wan: wanData
        })
        .then(() => {
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
<style lang="scss" scoped>
.content {
  width: 100%;
  .content__item {
    margin: 0 auto;
    width: 360px;
  }
  .content__switch {
    display: flex;
    align-items: center;
    height: 80px;
    label {
      width: 75px;
      font-weight: bold;
      margin-right: 10px;
    }
  }
  .content__line {
    width: 100%;
    border-top: solid 1px #f1f1f1;
  }
  .form {
    .form__checkbox {
      margin-bottom: 10px;
    }
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
      border: 1px solid $primaryColor;
      cursor: pointer;
      white-space: nowrap;
      border-radius: 4px;
      width: 340px;
      height: 48px;
      user-select: none;
      color: $primaryColor;
      background-color: #fff;
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
          background-color: $primaryColor;
        }
        &::after {
          content: '';
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 20px;
          height: 2px;
          background-color: $primaryColor;
        }
      }
    }
  }
  @media screen and(max-width: 768px) {
    padding: 0 20px;
    .content__item {
      width: 100%;
    }
    .content__switch {
      height: 60px;
    }
    .form {
      .form__checkbox {
        margin-bottom: 20px;
      }
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
    }
  }
}
</style>
