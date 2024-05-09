<template>
  <div class="page">
    <div v-if="$store.state.isMobile"
         class="page-header">
      {{$t('trans0499')}}
    </div>
    <div class="page-content">
      <div class="page-content__main">
        <div class="row-1">
          <div class="card">
            <div class="title">{{$t('trans0491')}}</div>
            <m-form ref="remote"
                    class="form"
                    :model="remote"
                    :rules="remoteRules">
              <m-form-item prop="url">
                <m-input :label="`${$t('trans0498')}`"
                         v-model="remote.url"
                         :placeholder="$t('trans0321')"></m-input>
              </m-form-item>
              <m-form-item prop="username">
                <m-input :label="$t('trans0410')"
                         v-model="remote.username"
                         :placeholder="$t('trans0321')"></m-input>
              </m-form-item>
              <m-form-item prop="password">
                <m-input :label="$t('trans0003')"
                         type="password"
                         v-model="remote.password"
                         :placeholder="$t('trans0321')"></m-input>
              </m-form-item>
              <m-form-item class="last"
                           prop="interval">
                <m-input :label="$t('trans0490')"
                         v-model="remote.interval"
                         :placeholder="$t('trans0321')"></m-input>
              </m-form-item>
            </m-form>
          </div>
          <div class="card">
            <div class="title">{{$t('trans0493')}}</div>
            <m-form ref="local"
                    class="form"
                    :model="local"
                    :rules="localRules">
              <m-form-item prop="path">
                <m-input :label="$t('trans0494')"
                         v-model="local.path"
                         :placeholder="$t('trans0321')"></m-input>
              </m-form-item>
              <m-form-item prop="port">
                <m-input :label="$t('trans0495')"
                         v-model="local.port"
                         :placeholder="$t('trans0321')"></m-input>
              </m-form-item>
              <m-form-item prop="username">
                <m-input :label="`${$t('trans0410')} ${$t('trans0411')}`"
                         v-model="local.username"
                         :placeholder="$t('trans0321')"></m-input>
              </m-form-item>
              <m-form-item prop="password">
                <m-input :label="`${$t('trans0003')} ${$t('trans0411')}`"
                         type="password"
                         v-model="local.password"
                         :placeholder="$t('trans0321')"></m-input>
              </m-form-item>
              <m-form-item class="last">
                <m-checkbox :text="$t('trans0462')"
                            :bold='true'
                            :rect='false'
                            v-model="enabled"></m-checkbox>
              </m-form-item>
            </m-form>
          </div>
        </div>
      </div>
      <div class="page-content__bottom">
        <div class="form-button__wrapper">
          <button class="btn btn-primary"
                  @click="updateTr069">{{$t('trans0081')}}</button>
        </div>
      </div>

    </div>
  </div>

</template>

<script>
import { portReg, getStringByte, isValidPassword } from 'base/util/util';

export default {
  data() {
    return {
      enabled: true,
      remote: {
        username: '',
        password: '',
        interval: '',
        url: ''
      },
      local: {
        port: '',
        path: '',
        username: '',
        password: ''
      },
      remoteRules: {
        url: [
          {
            rule: value => value,
            message: this.$t('trans0232')
          },
          {
            rule: value => getStringByte(value) <= 64,
            message: this.$t('trans0905')
          }
        ],
        username: [
          {
            rule: value => value,
            message: this.$t('trans0232')
          },
          {
            rule: value => getStringByte(value) <= 32,
            message: this.$t('trans0261')
          }
        ],
        password: [
          {
            rule: value => value,
            message: this.$t('trans0232')
          },
          {
            rule: value => isValidPassword(value, 1, 32),
            message: this.$t('trans0125').format(1, 32)
          }
        ],
        interval: [
          {
            rule: value => value,
            message: this.$t('trans0232')
          },
          {
            rule: value => /^\d*$/g.test(value),
            message: this.$t('trans0500')
          },
          {
            rule: value => {
              const v = parseInt(value, 10);
              if (Number.isNaN(v)) {
                return false;
              }
              if (v <= 0 || v > 999999999) {
                return false;
              }
              return true;
            },
            message: this.$t('trans0500')
          }
        ]
      },
      localRules: {
        port: [
          {
            rule: value => value,
            message: this.$t('trans0232')
          },
          {
            rule: value => portReg.test(value),
            message: this.$t('trans0478')
          }
        ],
        path: [
          {
            rule: value => value,
            message: this.$t('trans0232')
          },
          {
            rule: value => getStringByte(value) <= 32,
            message: this.$t('trans0906')
          }
        ],
        username: [
          {
            rule: value => getStringByte(value) <= 32,
            message: this.$t('trans0261')
          }
        ],
        password: [
          {
            rule: value => {
              if (!value) {
                return true;
              }
              return isValidPassword(value, 1, 32);
            },
            message: this.$t('trans0125').format(1, 32)
          }
        ]
      }
    };
  },
  mounted() {
    this.getTR069();
  },
  methods: {
    getTR069() {
      this.$http.getTr069().then(res => {
        this.remote = res.data.result.remote;
        this.local = res.data.result.local;
        this.enabled = res.data.result.enabled;
      });
    },
    updateTr069() {
      if (this.$refs.remote.validate() && this.$refs.local.validate()) {
        this.$loading.open();
        const remote = {
          username: this.remote.username,
          interval: Number(this.remote.interval),
          url: this.remote.url
        };
        const local = {
          username: this.local.username,
          port: Number(this.local.port),
          path: this.local.path
        };
        if (this.remote.password) {
          remote.password = this.remote.password;
        }
        if (this.local.password) {
          local.password = this.local.password;
        }
        this.$http
          .updateTr069({
            remote,
            local,
            enabled: this.enabled
          })
          .then(() => {
            this.$toast(this.$t('trans0040'), 2000, 'success');
          });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.page {
  .page-header {
    display: flex;
    justify-content: space-between;
    .page-header-trigger {
      display: none;
    }
    .tabs-container {
      .tabs {
        border: 0;
        padding: 0;
        .tab {
          padding: 15px 0;
          display: flex;
          align-items: center;
          font-size: 14px;
          font-weight: normal;
        }
      }
    }
  }

  .page-content {
    display: flex;
    flex-direction: column;
    // align-items: center;
    .title {
      width: 100%;
      font-size: 16px;
      color: var(--text_default-color);
      margin-bottom: 20px;
      font-weight: bold;
    }
    .hr-line {
      width: 100%;
      height: 0;
      border-top: 1px solid var(--hr-color);
      margin: 5px 0 30px;
    }
    .form-button {
      margin-top: 0;
      padding-top: 25px;
      border-top: 1px solid var(--hr-color);
    }
  }
}

@media screen and (max-width: 768px) {
  .page {
    .page-header {
      position: relative;
      background: var(--header-bgc);
      align-items: center;
      .page-header-trigger {
        display: block;
        &::before {
          content: '';
          display: block;
          width: 8px;
          height: 8px;
          border-bottom: 1px solid #fff;
          border-right: 1px solid #fff;
          transform: rotate(45deg);
          position: relative;
          top: -2px;
          transition: all 0.3s linear;
        }
        &.show {
          &::before {
            transform: rotate(225deg);
          }
        }
      }
      .tabs-container {
        display: none;
        &.show {
          display: block;
        }
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        z-index: 999;
        .tabs {
          display: flex;
          flex-direction: column;
          padding: 0 30px;
          background: var(--header-bgc);
          .tab {
            padding: 18px 0;
            color: #fff;
            font-size: 14px;
            margin: 0;
            border-bottom: 1px solid var(--header_navitem_border-color);
            &.selected {
              border-bottom: 1px solid var(--header_navitem_border-color);
              color: var(--primary-color);
              &::before {
                display: none;
              }
            }
          }
        }
      }
    }
    .page-content {
      > div {
        width: 100%;
      }
    }
  }
}
</style>
