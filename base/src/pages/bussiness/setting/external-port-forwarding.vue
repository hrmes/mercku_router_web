<template>
  <div class="page">
    <div v-if="$store.state.isMobile" class="page-header">
      {{ $t('trans0103') }}
    </div>
    <div class="page-content">
      <div class="page-content__main">
        <div class="row-1" style="margin-bottom: 20px">
          <div class="card">
            <m-switch v-model="form.enabled" :label="$t('trans0462')" />
          </div>
        </div>
        <div class="row-1">
          <div v-if="form.enabled" class="smart-connect card">
            <m-form class="form card" ref="protcolForm" key="protcolForm" :model="form" :rules="rules">
              <!-- <m-form-item key="enabled" prop="enabled">
            </m-form-item> -->
              <m-form-item key="protocol" v-if="form.enabled" prop="protocol" :label="$t('trans0435')">
                <m-radio-group v-model="form.protocol" class="radio-group" direction='horizontal'
                  :options="protocolTypes"></m-radio-group>
              </m-form-item>

              <m-form-item v-if="form.enabled" key="external_port" prop="external_port" :rules="rules.external_port">
                <m-input v-model="form.external_port" :label="$t('trans1254')" type="text"
                  placeholder="1-65535"></m-input>

              </m-form-item>
              <m-form-item v-if="form.enabled" key="internal_port" prop="internal_port" :rules="rules.internal_port">
                <m-input v-model="form.internal_port" :label="$t('trans1253')" type="text"
                  placeholder="1-65535"></m-input>
              </m-form-item>
              <m-form-item v-if="form.enabled" key="internal_ip" prop="internal_ip" :rules="rules.internal_ip">
                <m-input v-model="form.internal_ip" :label="$t('trans1255')" type="text"
                  :placeholder="$t('trans1255')"></m-input>
              </m-form-item>

            </m-form>
          </div>
        </div>
      </div>
      <div class="page-content__bottom">
        <div class="form-button__wrapper">
          <button class="btn" v-defaultbutton @click="submit()">
            {{ $t('trans0081') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  isIP,
} from 'base/util/util';

export default {
  data() {
    return {
      protocolTypes: [
        {
          text: 'TCP&UDP',
          value: 'tcp_udp'
        },
        {
          text: 'TCP',
          value: 'tcp'
        },
        {
          text: 'UDP',
          value: 'udp'
        },

      ],
      form: {
        protocol: 'tcp_udp',
        external_port: '',
        internal_port: '',
        internal_ip: '',
        enabled: false,
      },
      rules: {
        external_port: [
          {
            rule: value => !/^\s*$/g.test(value.trim()),
            message: this.$t('trans0232')
          },
          {
            rule: value => {
              const trimedValue = value.trim();
              return /^\d*$/g.test(trimedValue) && Number(trimedValue) >= 0 && Number(trimedValue) <= 65535
            },
            message: this.$t('trans0478')
          }
        ],
        internal_port: [
          {
            rule: value => !/^\s*$/g.test(value.trim()),
            message: this.$t('trans0232')
          },
          {
            rule: value => {
              const trimedValue = value.trim();
              return /^\d*$/g.test(trimedValue) && Number(trimedValue) >= 0 && Number(trimedValue) <= 65535
            },
            message: this.$t('trans0478')
          }
        ],
        internal_ip: [
          {
            rule: value => {
              console.log('validate', value);
              return Boolean(value) && !/^\s*$/g.test(value.trim());
            },
            message: this.$t('trans0232')
          },
          {
            rule: value => !value || (value && isIP(value)),
            message: this.$t('trans0238')
          },
          // TODO: Add Lan IP restriction rule
        ],
      },
    };
  },
  mounted() {
    this.getInitData();
  },
  methods: {
    submit() {
      if (this.form.enabled) {
        const validateResult = this.$refs.protcolForm.validate();
        if (!validateResult) {
          return;
        }
      }

      this.$dialog.confirm({
        okText: this.$t('trans0024'),
        cancelText: this.$t('trans0025'),
        message: this.$t('trans0229'),
        callback: {
          ok: () => {
            this.$loading.open();
            const { enabled,
              protocol,
              external_port,
              internal_port,
              internal_ip } = this.form;

            this.$http
              .setExternalPortForwarding({
                'router.epf.update': {
                  enabled: enabled,
                  protocol: protocol,
                  external_port: Number(external_port),
                  internal_port: Number(internal_port),
                  internal_ip: internal_ip,
                }
              })
              .then(() => {
                this.$reconnect({
                  onsuccess: () => {
                    this.$router.push({ path: '/dashboard' });
                  },
                  ontimeout: () => {
                    this.$router.push({ path: '/unconnect' });
                  },
                  timeout: 60
                });
              })
              .finally(() => {
                this.$loading.close();
              });
          }
        }
      });
    },
    getInitData() {
      this.$loading.open();
      this.$http
        .getExternalPortForwarding()
        .then(response => {
          if (response.data.result) {
            const {
              enabled = false,
              protocol = 'tcp_udp',
              external_port = '',
              internal_port = '',
              internal_ip = ''
            } = response.data.result["router.epf.get"];
            this.form = {
              enabled,
              protocol,
              external_port: external_port === 0 ? '' : String(external_port),
              internal_port: internal_port === 0 ? '' : String(internal_port),
              internal_ip
            };
          }
        }).finally(() => {
          this.$loading.close();
        });
    },
  }
};
</script>
<style lang="scss" scoped>
.smart-connect {
  flex-direction: column;

  .smart-connect__inner {
    display: flex;
  }
}

.form {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

@media screen and (max-width: 768px) {
  .smart-connect {
    width: 100%;
    padding-bottom: 30px;
  }
}
</style>
