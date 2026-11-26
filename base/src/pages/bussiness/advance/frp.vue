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
              <m-form-item class="frp-enable">
                <m-switch :label="$t('trans0462')"
                          data-e2e="frp-switch"
                          :disabled="!ready || busy"
                          v-model="frp.enabled"></m-switch>
              </m-form-item>
              <p v-if="frp.enabled !== saved.enabled" class="frp-tips">{{$t('trans1290')}}</p>
              <p class="frp-tips">{{$t('trans1258')}}</p>
              <div class="frp-connection-grid">
                <section class="frp-server">
                  <h2 class="frp-section">{{$t('trans1259')}}</h2>
                  <div class="frp-server-endpoint">
                    <m-form-item :key="`server-addr-${frp.enabled}`" prop="server_addr">
                      <m-input :label="$t('trans1260')"
                               data-e2e="frp-server-addr-input"
                               :disabled="!ready || busy"
                               v-model="frp.server_addr"
                               placeholder="frps.example.com"></m-input>
                    </m-form-item>
                    <m-form-item prop="server_port">
                      <m-input :label="$t('trans1261')"
                               data-e2e="frp-server-port-input"
                               :disabled="!ready || busy"
                               v-model="frp.server_port"
                               placeholder="7000"></m-input>
                    </m-form-item>
                  </div>
                  <m-form-item>
                    <m-input :label="$t('trans1262')"
                             data-e2e="frp-token-input"
                             type="password"
                             :disabled="!ready || busy"
                             v-model="frp.token"
                             :placeholder="$t('trans1267')"></m-input>
                  </m-form-item>
                </section>
                <section class="frp-access">
                  <h2 class="frp-section">{{$t('trans1263')}}</h2>
                  <m-form-item :key="`sk-${frp.enabled}`" prop="sk" :error-msg-is-static="true">
                    <m-input :label="$t('trans1254')"
                             data-e2e="frp-sk-input"
                             type="password"
                             :disabled="!ready || busy"
                             v-model="frp.sk"
                             :placeholder="$t('trans0321')"
                             :aria-describedby="skHint ? 'frp-sk-hint' : null"></m-input>
                  </m-form-item>
                  <p v-if="skHint" id="frp-sk-hint" class="frp-tips">{{$t(skHint)}}</p>
                  <p class="frp-tips">{{$t('trans1271')}}</p>
                </section>
              </div>
              <p v-if="proxyNamesChanged"
                 class="frp-tips frp-name-warning"
                 data-e2e="frp-name-warning">{{$t('trans1272')}}</p>
              <div class="frp-proxies-header">
                <h2 class="frp-section">{{$t('trans1278')}}</h2>
                <button type="button"
                        class="frp-action frp-add"
                        data-e2e="frp-proxy-add"
                        :disabled="!ready || busy"
                        :aria-label="$t('trans1279')"
                        @click="addProxy">
                  <span class="frp-add__icon" aria-hidden="true">＋</span>
                  {{$t('trans1279')}}
                </button>
              </div>
              <m-form-item :key="`proxies-${frp.enabled}`" prop="proxies" class="frp-list-state">
                <p v-if="!frp.proxies.length" class="frp-tips">{{$t('trans1284')}}</p>
              </m-form-item>
              <div v-for="(proxy, index) in frp.proxies"
                   :key="proxy._key"
                   class="frp-proxy"
                   data-e2e="frp-proxy-row">
                <div class="frp-proxy__header">
                  <h3>{{$t('trans1278')}} {{index + 1}}</h3>
                  <button type="button"
                          class="frp-action"
                          data-e2e="frp-proxy-remove"
                          :disabled="!ready || busy"
                          @click="removeProxy(index)">{{$t('trans1280')}}</button>
                </div>
                <m-form-item :prop="`proxies[${index}].name`"
                             class="frp-proxy-name"
                             :error-msg-is-static="true"
                             :rules="proxyNameRules(index)">
                  <div class="frp-name">
                    <m-input :label="$t('trans1281')"
                             data-e2e="frp-proxy-name-input"
                             :ref="`proxy-name-${proxy._key}`"
                             :disabled="!ready || busy"
                             maxlength="128"
                             v-model="proxy.name"
                             :placeholder="$t('trans0321')"></m-input>
                    <button type="button"
                            class="btn btn-text frp-name__copy"
                            data-e2e="frp-proxy-name-copy"
                            :disabled="!ready || busy || !validProxyName(proxy.name)"
                            @click="copyProxyName(index)">{{$t('trans1275')}}</button>
                  </div>
                </m-form-item>
                <div class="frp-target">
                  <m-form-item :prop="`proxies[${index}].local_ip`"
                               :error-msg-is-static="true"
                               :rules="ipRules" class="frp-proxy-ip last">
                    <m-input :label="$t('trans1282')"
                             data-e2e="frp-proxy-ip-input"
                             :disabled="!ready || busy"
                             v-model="proxy.local_ip"
                             placeholder="127.0.0.1"></m-input>
                  </m-form-item>
                  <m-form-item :prop="`proxies[${index}].local_port`"
                               :error-msg-is-static="true"
                               :rules="portRules" class="frp-proxy-port last">
                    <m-input :label="$t('trans1283')"
                             data-e2e="frp-proxy-port-input"
                             :disabled="!ready || busy"
                             v-model="proxy.local_port"
                             :placeholder="$t('trans0321')"></m-input>
                  </m-form-item>
                </div>
              </div>
              <p class="frp-tips frp-target-tips">{{$t('trans1266')}}</p>
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
import { ipReg, portReg } from 'base/util/util';
import copyText from 'base/util/clipboard';
import {
  FRP_DEFAULT_LOCAL_IP,
  buildFrpUpdateParams,
  cloneFrpConfig,
  createFrpProxyNames,
  isValidFrpServer,
  isValidFrpProxyName,
  normalizeFrpConfig
} from 'base/util/frp';

export default {
  data() {
    const initial = normalizeFrpConfig();
    initial.proxies.forEach((proxy, index) => { proxy._key = index; });
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
    const ipRules = [
      { rule: value => !!value, message: this.$t('trans0232') },
      { rule: value => ipReg.test(value.trim()), message: this.$t('trans0231') }
    ];
    return {
      ready: false,
      busy: false,
      savedHasSk: false,
      nextProxyKey: initial.proxies.length,
      portRules,
      ipRules,
      frp: cloneFrpConfig(initial),
      // Last configuration acknowledged by the device, excluding the SK.
      saved: cloneFrpConfig(initial),
      frpRules: {
        server_addr: [
          { rule: value => !this.frp.enabled || !!value.trim(), message: this.$t('trans0232') },
          { rule: value => !value || isValidFrpServer(value), message: this.$t('trans1268') }
        ],
        server_port: portRules,
        sk: [
          {
            rule: value => !this.frp.enabled || this.savedHasSk || !!value.trim(),
            message: this.$t('trans1286')
          }
        ],
        proxies: [
          { rule: value => !this.frp.enabled || value.length > 0, message: this.$t('trans1285') }
        ]
      }
    };
  },
  mounted() {
    this.getFrp();
  },
  computed: {
    skHint() {
      if (!this.ready) return null;
      if (this.savedHasSk) return this.frp.sk.trim() ? 'trans1288' : 'trans1287';
      return !this.frp.enabled && !this.frp.sk.trim() ? 'trans1289' : null;
    },
    proxyNamesChanged() {
      return JSON.stringify(this.frp.proxies.map(proxy => proxy.name.trim())) !==
        JSON.stringify(this.saved.proxies.map(proxy => proxy.name.trim()));
    }
  },
  methods: {
    validProxyName: isValidFrpProxyName,
    proxyNameRules(index) {
      return [
        { rule: value => !!value.trim(), message: this.$t('trans0232') },
        { rule: isValidFrpProxyName, message: this.$t('trans1273') },
        {
          rule: value => !this.frp.proxies.some((proxy, other) =>
            other !== index && proxy.name.trim() === value.trim()),
          message: this.$t('trans1274')
        }
      ];
    },
    withProxyKeys(config) {
      const next = cloneFrpConfig(config);
      next.proxies.forEach(proxy => {
        proxy._key = this.nextProxyKey;
        this.nextProxyKey += 1;
      });
      return next;
    },
    addProxy() {
      if (!this.ready || this.busy) return;
      const proxy = {
        _key: this.nextProxyKey, name: '', local_ip: FRP_DEFAULT_LOCAL_IP, local_port: ''
      };
      this.nextProxyKey += 1;
      this.frp.proxies.push(proxy);
      this.$nextTick(() => {
        const ref = this.$refs[`proxy-name-${proxy._key}`];
        const input = Array.isArray(ref) ? ref[0] : ref;
        if (input && input.$refs.input) input.$refs.input.focus();
      });
    },
    removeProxy(index) {
      if (!this.ready || this.busy || !Number.isInteger(index) ||
          index < 0 || index >= this.frp.proxies.length) return;
      this.frp.proxies.splice(index, 1);
    },
    copyProxyName(index) {
      const proxy = this.frp.proxies[index];
      if (!this.ready || this.busy || !proxy ||
          !isValidFrpProxyName(proxy.name)) return Promise.resolve(false);
      return copyText(proxy.name.trim()).then(copied => {
        this.$toast(this.$t(copied ? 'trans1276' : 'trans1277'));
        return copied;
      });
    },
    suggestProxyNames(config, legacy) {
      if (config.proxies.every(proxy => proxy.name) || typeof this.$http.getRouter !== 'function') {
        return Promise.resolve(config);
      }
      return this.$http.getRouter().then(res => {
        const names = createFrpProxyNames(res && res.data && res.data.result && res.data.result.sn);
        return {
          ...config,
          proxies: config.proxies.map((proxy, index) => ({
            ...proxy,
            name: proxy.name || (legacy
              ? [names.web_name, names.ssh_name][index]
              : names.web_name.replace(/_web$/, `_proxy_${index + 1}`))
          }))
        };
      }).catch(() => config);
    },
    getFrp() {
      if (this.busy) return Promise.resolve(false);
      this.ready = false;
      this.busy = true;
      return this.$http
        .getFRP()
        .then(res => {
          const raw = res && res.data && res.data.result;
          const config = this.withProxyKeys(normalizeFrpConfig(raw));
          this.savedHasSk = raw && typeof raw.hasSk === 'boolean' ? raw.hasSk : !!config.sk.trim();
          config.sk = '';
          this.saved = cloneFrpConfig(config);
          return this.suggestProxyNames(config, !raw || !Array.isArray(raw.proxies)).then(form => {
            this.frp = cloneFrpConfig(form);
            this.ready = true;
            return true;
          });
        })
        .catch(() => false)
        .finally(() => {
          this.busy = false;
        });
    },
    validate() {
      return !!this.$refs.frp && this.$refs.frp.validate();
    },
    save() {
      if (!this.ready || this.busy || !this.validate()) return Promise.resolve(false);
      const params = buildFrpUpdateParams(this.frp);
      this.busy = true;
      this.$loading.open();
      return this.$http
        .updateFRP(params)
        .then(() => {
          const applied = this.withProxyKeys(normalizeFrpConfig({ ...params, sk: '' }));
          if (params.sk) this.savedHasSk = true;
          this.frp = cloneFrpConfig(applied);
          this.saved = cloneFrpConfig(applied);
          this.$toast(this.$t('trans0040'), 2000, 'success');
          return true;
        })
        .catch(() => {
          this.frp = cloneFrpConfig(this.saved);
          return false;
        })
        .finally(() => {
          this.$loading.close();
          this.busy = false;
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.page {
  // The shared desktop shell has a 1280px minimum. Keep this form within
  // the viewport on smaller desktops, allowing for its sidebar and gutters.
  @media (min-width: 769px) and (max-width: 1279px) {
    max-width: calc(85vw - 70px);
  }
  .page-content .page-content__main .row-1 {
    grid-template-columns: minmax(0, 1120px);
  }
  .card {
    min-width: 0;
    padding: 24px;
  }
  .frp-enable {
    margin-bottom: 12px;
  }
  .frp-connection-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 32px;
    margin: 24px 0 16px;
    padding-bottom: 24px;
    border-bottom: 1px solid var(--input_border-color);

    section {
      min-width: 0;
    }
    .frp-section {
      margin: 0 0 16px;
    }
    .form-item {
      margin-bottom: 16px;
    }
    section > .form-item:last-of-type,
    .frp-tips {
      margin-bottom: 0;
    }
  }
  .frp-server-endpoint {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 110px;
    gap: 16px;
  }
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
  .frp-section {
    margin: 24px 0 20px;
    font-size: 16px;
    font-weight: 500;
  }
  .frp-proxies-header,
  .frp-proxy__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .frp-proxies-header .frp-section {
    margin: 0;
  }
  .frp-action {
    flex-shrink: 0;
    padding: 8px;
    min-height: 44px;
    border: 0;
    background: none;
    color: var(--button_text_text-color);
    font: inherit;
    cursor: pointer;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
  .frp-add {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
  .frp-add__icon {
    font-size: 24px;
    line-height: 1;
  }
  .frp-proxy {
    display: grid;
    grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr) 110px 88px;
    gap: 16px;
    margin: 12px 0;
    padding: 16px;
    border: 1px solid var(--input_border-color);
    border-radius: 10px;

    .form-item {
      margin-bottom: 0;
      min-width: 0;
    }
  }
  .frp-proxy-name {
    grid-column: 1;
    grid-row: 1;
  }
  .frp-proxy-ip {
    grid-column: 2;
    grid-row: 1;
  }
  .frp-proxy-port {
    grid-column: 3;
    grid-row: 1;
  }
  .frp-proxy__header {
    grid-column: 4;
    grid-row: 1;
    align-self: start;
    margin: 0;
    padding-top: 26px;

    h3 {
      display: none;
      margin: 0;
      font-size: 14px;
      font-weight: 500;
    }
  }
  .frp-list-state {
    margin-bottom: 0;
  }
  .input-container {
    max-width: 100%;
  }
  .frp-name {
    display: flex;
    align-items: flex-end;
    gap: 12px;

    .input-container {
      flex: 1;
      min-width: 0;
    }
  }
  .frp-name__copy {
    flex-shrink: 0;
    width: auto;
    min-width: 44px;
    padding: 0 8px;
    height: 48px;
    background: none;
    box-shadow: none;
  }
  .frp-name-warning {
    color: var(--input_error_text-color);
  }
  .frp-target {
    display: contents;
  }
  .frp-target-tips {
    margin-top: 20px;
    margin-bottom: 0;
  }
  @media (max-width: 1100px) {
    .frp-connection-grid {
      grid-template-columns: minmax(0, 1fr);
      gap: 24px;
    }
    .frp-proxy {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .frp-proxy__header,
    .frp-proxy-name,
    .frp-target {
      grid-column: 1 / -1;
      grid-row: auto;
    }
    .frp-proxy__header {
      padding-top: 0;

      h3 {
        display: block;
      }
    }
    .frp-target {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 16px;
    }
    .frp-proxy-ip,
    .frp-proxy-port {
      grid-column: auto;
      grid-row: auto;
    }
  }
  @media (max-width: 767px) {
    .card {
      padding: 20px 0;
    }
    .frp-server-endpoint {
      grid-template-columns: minmax(0, 1fr);
      gap: 0;
    }
    .frp-target {
      display: block;

      > .form-item:first-child {
        margin-bottom: 20px;
      }
    }
  }
}
</style>
