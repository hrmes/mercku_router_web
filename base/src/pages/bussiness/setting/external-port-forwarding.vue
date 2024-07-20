<template>
  <div class="page">
    <div v-if="$store.state.isMobile" class="page-header">
      {{ $t('trans0103') }}
    </div>
    <div class="page-content">
      <div class="page-content__main">
        <div class="smart-connect card" style="margin-bottom: 20px">
          <m-form class="form card" ref="protoclForm" key="protoclForm" :model="form" :rules="rules">
            <m-form-item key="protocol" prop="protocol" :label="$t('trans0435')">
              <m-radio-group v-model="form.protocol" class="radio-group" direction='horizontal'
                :options="protocolTypes"></m-radio-group>
            </m-form-item>

            <m-form-item key="external_port" prop="external_port" :rules="rules.external_port">
              <m-input v-model="form.external_port" :label="$t('trans0426')" type="text"
                placeholder="1-65535"></m-input>

            </m-form-item>
            <m-form-item key="internal_port" prop="internal_port" :rules="rules.internal_port">
              <m-input v-model="form.internal_port" :label="$t('trans0428')" type="text"
                placeholder="1-65535"></m-input>
            </m-form-item>
            <m-form-item key="internal_ip" prop="internal_ip" :rules="rules.internal_ip">
              <m-input v-model="form.internal_ip" :label="$t('trans0427')" type="text"
                :placeholder="$t('trans0427')"></m-input>
            </m-form-item>
            <m-form-item key="enable" prop="enable">
              <m-switch v-model="form.enable" :label="$t('trans0462')" />
            </m-form-item>
          </m-form>
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
  isIP
} from 'base/util/util';
import { Bands, ChannelMode } from 'base/util/constant';

export default {
  data() {
    return {
      protocolTypes: [
        {
          text: 'TCP&UDP',
          value: 'tcp&udp'
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
        protocol: 'tcp&udp',
        external_port: '',
        internal_port: '',
        internal_ip: '',
        enable: false,
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
    // TODO: fill form data when initial loading
    this.getInitData();
  },
  methods: {
    submit() {
      const validateResult = this.$refs.protoclForm.validate();
      if (!validateResult) {
        return;
      }

      this.$dialog.confirm({
        okText: this.$t('trans0024'),
        cancelText: this.$t('trans0025'),
        message: this.$t('trans0229'),
        callback: {
          ok: () => {
            this.$loading.open();

            const b24g = this.mapBandData(
              this.form.b24g,
              this.form.channel.b24gChannel
            );

            const b5gBandInfo = this.form.smart_connect
              ? this.form.b24g
              : this.form.b5g;
            const b5g = this.mapBandData(
              b5gBandInfo,
              this.form.channel.b5gChannel
            );

            const wifi = {
              smart_connect: this.form.smart_connect,
              compatibility_mode: this.form.compatibility_mode,
              tx_power: this.form.wifiTxPower,
              dfs: this.form.dfs,
              bands: { [Bands.b24g]: b24g, [Bands.b5g]: b5g }
            };
            console.log(wifi);

            this.$http
              .meshWifiUpdate(wifi)
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
              protocol = 'tcp&udp',
              external_port = '',
              internal_port = '',
              internal_ip = ''
            } = response.data.result;

            this.form = {
              ...this.from,
              enabled,
              protocol,
              external_port,
              internal_port,
              internal_ip
            };
          }
        });
    },
  }
};
</script>
<style lang="scss" scoped>
.smart-connect {
  flex-direction: column;
  width: 500px;

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
