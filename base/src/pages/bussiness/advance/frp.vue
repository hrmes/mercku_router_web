<template>
  <div class="page">
    <div v-if="$store.state.isMobile"
         class="page-header">
      {{$t('trans1253')}}
    </div>
    <div class="page-content">
      <div class="page-content__main">
        <div class="row-1">
          <div class="card"
               data-e2e="frp-form-card">
            <m-form class="form"
                    ref="frp"
                    :model="frp"
                    :rules="frpRules">
              <m-form-item>
                <m-switch :label="$t('trans0462')"
                          data-e2e="frp-switch"
                          :disabled="!ready || busy"
                          v-model="frp.enabled"
                          @change="onEnabledChange"></m-switch>
              </m-form-item>
              <p class="frp-tips">{{$t('trans1258')}}</p>
              <m-form-item prop="sk">
                <m-input :label="$t('trans1254')"
                         data-e2e="frp-sk-input"
                         v-model="frp.sk"
                         :placeholder="$t('trans0321')"
                         readonly></m-input>
                <button type="button"
                        class="btn btn-text frp-key__refresh"
                        data-e2e="frp-regenerate"
                        :disabled="!ready || busy || !frp.enabled"
                        @click="regenerateSk">{{$t('trans1255')}}</button>
              </m-form-item>
              <m-form-item prop="web_port">
                <m-input :label="$t('trans1256')"
                         data-e2e="frp-web-port-input"
                         :disabled="!ready || busy"
                         v-model="frp.web_port"
                         :placeholder="$t('trans0321')"></m-input>
              </m-form-item>
              <m-form-item prop="ssh_port"
                           class="last">
                <m-input :label="$t('trans1257')"
                         data-e2e="frp-ssh-port-input"
                         :disabled="!ready || busy"
                         v-model="frp.ssh_port"
                         :placeholder="$t('trans0321')"></m-input>
              </m-form-item>
            </m-form>
          </div>
        </div>
      </div>
      <div class="page-content__bottom">
        <div class="form-button__wrapper">
          <button class="btn btn-primary"
                  data-e2e="frp-submit"
                  :disabled="!ready || busy"
                  @click="save">{{$t('trans0081')}}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { portReg } from 'base/util/util';
import {
  FRP_DEFAULT_SSH_PORT,
  FRP_DEFAULT_WEB_PORT,
  buildFrpUpdateParams,
  generateFrpSk,
  normalizeFrpConfig,
  withEnabledState
} from 'base/util/frp';

function createDefaultConfig() {
  return normalizeFrpConfig({
    enabled: false,
    sk: '',
    web_port: FRP_DEFAULT_WEB_PORT,
    ssh_port: FRP_DEFAULT_SSH_PORT
  });
}

export default {
  data() {
    const initial = createDefaultConfig();
    const portRules = [
      {
        rule: value => value,
        message: this.$t('trans0232')
      },
      {
        rule: value => portReg.test(value),
        message: this.$t('trans0478')
      }
    ];
    return {
      ready: false,
      busy: false,
      frp: { ...initial },
      // Last configuration acknowledged by the device: restored whenever a
      // toggle/regenerate request fails, so the page never lies about state.
      saved: { ...initial },
      frpRules: {
        sk: [
          {
            rule: () => !this.frp.enabled || !!this.frp.sk,
            message: this.$t('trans0232')
          }
        ],
        web_port: portRules,
        ssh_port: portRules
      }
    };
  },
  mounted() {
    this.getFrp();
  },
  methods: {
    getFrp() {
      if (this.busy) return Promise.resolve(false);
      this.ready = false;
      this.busy = true;
      return this.$http
        .getFRP()
        .then(res => {
          const config = normalizeFrpConfig(res && res.data && res.data.result);
          this.frp = { ...config };
          this.saved = { ...config };
          this.ready = true;
          return true;
        })
        .catch(() => false)
        .finally(() => {
          this.busy = false;
        });
    },
    restoreSaved() {
      this.frp = { ...this.saved };
    },
    /**
     * Enabling always mints a new secret key; disabling clears it. The
     * resulting state is pushed to the device immediately.
     */
    onEnabledChange(enabled) {
      if (!this.ready || this.busy) {
        this.restoreSaved();
        return Promise.resolve(false);
      }
      try {
        this.frp = withEnabledState(this.frp, enabled === true);
      } catch (error) {
        this.restoreSaved();
        this.$toast(this.$t('trans0077'));
        return Promise.resolve(false);
      }
      return this.apply();
    },
    regenerateSk() {
      if (!this.ready || this.busy || !this.frp.enabled) return Promise.resolve(false);
      try {
        this.frp = { ...this.frp, sk: generateFrpSk() };
      } catch (error) {
        this.restoreSaved();
        this.$toast(this.$t('trans0077'));
        return Promise.resolve(false);
      }
      return this.apply();
    },
    save() {
      if (!this.ready || this.busy) return Promise.resolve(false);
      if (!this.validate()) return Promise.resolve(false);
      return this.apply();
    },
    validate() {
      return !!this.$refs.frp && this.$refs.frp.validate();
    },
    /**
     * Send the whole configuration to the device. Callers validate first; a
     * failed request rolls the form back to the last acknowledged state.
     */
    apply() {
      if (!this.ready || this.busy) return Promise.resolve(false);
      if (!this.validate()) {
        this.restoreSaved();
        return Promise.resolve(false);
      }
      const params = buildFrpUpdateParams(this.frp);
      this.busy = true;
      this.$loading.open();
      return this.$http
        .updateFRP(params)
        .then(() => {
          this.$loading.close();
          const applied = normalizeFrpConfig(params);
          this.frp = { ...applied };
          this.saved = { ...applied };
          this.$toast(this.$t('trans0040'), 2000, 'success');
          return true;
        })
        .catch(() => {
          this.$loading.close();
          this.restoreSaved();
          return false;
        })
        .finally(() => {
          this.busy = false;
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.page {
  .page-header {
    display: flex;
    justify-content: space-between;
  }
  .frp-tips {
    margin: 0 0 20px;
    font-size: 12px;
    line-height: 1.6;
    color: var(--text_gery-color);
  }
  .frp-key__refresh {
    display: block;
    margin: 8px 0 0 auto;
    padding: 0;
    height: auto;
    min-width: 0;
    text-align: right;
    background: none;
    border: none;
    box-shadow: none;
    color: var(--button_text_text-color);
    text-decoration: underline;
    white-space: nowrap;

    &:disabled {
      color: var(--text_gery-color);
      opacity: 0.6;
      cursor: not-allowed;
      text-decoration: none;
    }
  }
}
</style>
