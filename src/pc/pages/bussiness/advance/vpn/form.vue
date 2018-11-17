<template>
  <div class="page">
    <div class='page-header'>
      {{formType==='update'?$t('trans0034'):$t('trans0035')}}{{$t('trans0402')}}
    </div>
    <div class="page-content">
      <div class="form">
        <m-form ref="form" :model="form" :rules='rules'>
          <m-form-item class="item" prop='name'>
            <m-input :label="$t('trans0108')" type="text" :placeholder="$t('trans0321')" v-model="form.name" />
          </m-form-item>
          <m-form-item class="item" prop='protocol'>
            <m-select :label="$t('trans0408')" v-model="form.protocol" :options="protocols"></m-select>
          </m-form-item>
          <m-form-item class="item" prop='server'>
            <m-input :label="$t('trans0409')" type="text" :placeholder="$t('trans0321')" v-model="form.server" />
          </m-form-item>
          <m-form-item class="item" prop='username'>
            <m-input :label="$t('trans0410')" type="text" :placeholder="$t('trans0321')" v-model="form.username" />
          </m-form-item>
          <m-form-item class="item" prop='password'>
            <m-input :label="`${$t('trans0003')}${$t('trans0411')}`" type='password' :placeholder="`${$t('trans0321')}`" v-model="form.password"></m-input>
          </m-form-item>
          <div class="opz-info" v-if="form.protocol==='PPTP'">
            <div class="opz">
              <label for="">{{$t('trans0412')}}</label>
              <m-switch v-model="pptp.mppe"></m-switch>
            </div>
            <div class="opz">
              <label for="">{{$t('trans0413')}}</label>
              <m-switch v-model="pptp.mppc"></m-switch>
            </div>
          </div>
        </m-form>
        <div class="btn-info">
          <button class="btn" @click="submit()">{{$t('trans0081')}}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getStringByte } from '../../../../../util/util';

export default {
  data() {
    return {
      protocols: [
        {
          value: 'PPTP',
          text: this.$t('trans0414')
        },
        {
          value: 'L2TP',
          text: this.$t('trans0415')
        }
      ],
      pptp: {
        mppe: true,
        mppc: true
      },
      form: {
        id: '',
        name: '',
        protocol: 'PPTP', // L2TP or PPTP
        server: '',
        username: '',
        password: ''
      },
      rules: {
        name: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          },
          {
            rule: value => getStringByte(value) <= 20,
            message: this.$t('trans0261')
          }
        ],
        server: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          }
        ],
        username: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          },
          {
            rule: value => getStringByte(value) <= 20,
            message: this.$t('trans0261')
          }
        ]
      }
    };
  },
  mounted() {
    if (this.$route.params.id) {
      const { vpn } = this.$store.state;
      console.log(vpn);
      if (vpn.id) {
        this.form = {
          id: vpn.id,
          name: vpn.name,
          protocol: vpn.protocol,
          server: vpn.server,
          username: vpn.username,
          password: vpn.password
        };
        if (vpn.protocol === 'PPTP') {
          this.pptp = {
            mppe: vpn.pptp.mppe,
            mppc: vpn.pptp.mppc
          };
        }
      } else {
        this.$router.push('/advance/vpn');
      }
    }
  },
  computed: {
    formType() {
      return this.$route.params.id ? 'update' : 'add';
    },
    formParams() {
      let params = {
        ...this.form
      };
      if (this.form.protocol === 'PPTP') {
        params = {
          ...params,
          ...this.pptp
        };
      }
      return params;
    }
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        const fetchMethod = this.formType === 'update' ? 'updateVPN' : 'addVPN';
        this.$loading.open();
        this.$http[fetchMethod](this.formParams)
          .then(() => {
            this.$loading.close();
            this.$toast(this.$t('trans0040'), 3000, 'success');
            this.$router.push('/advance/vpn');
          })
          .catch(() => {
            this.$loading.close();
          });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.opz-info {
  .opz {
    display: flex;
    font-size: 14px;
    margin-bottom: 30px;
    label {
      margin-right: 10px;
    }
  }
}
</style>

