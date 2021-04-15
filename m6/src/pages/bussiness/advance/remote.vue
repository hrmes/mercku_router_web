<template>
  <div class="page">
    <div class="page-header"
         @click="showDropdown">
      <div class="page-header__text">{{$t('trans0286')}}</div>
      <div class="page-header-trigger"
           :class="{'show':dropdownVisible}"></div>
      <div class="tabs-container"
           :class="{'show':dropdownVisible}">
        <m-tabs class="tabs">
          <!-- <m-tab :class="{'selected':isTFTP}"
                 @click.native="forward2page('/advance/remote/tftp')">{{$t('trans0503')}}
          </m-tab> -->
        </m-tabs>
      </div>
    </div>

    <div class="page-content">
      <div v-if="isTFTP">
        <m-form class="form"
                :model="tftp"
                :rules="tftpRules"
                ref="tftp">
          <m-form-item prop="server">
            <m-input :label="$t('trans0409')"
                     v-model="tftp.server"
                     :placeholder="$t('trans0321')"></m-input>
          </m-form-item>
          <m-form-item prop="filename">
            <m-input :label="$t('trans0502')"
                     v-model="tftp.filename"
                     :placeholder="$t('trans0321')"></m-input>
          </m-form-item>
        </m-form>
        <div class="form-button">
          <button class="btn btn-primary"
                  @click="updateTFTP">{{$t('trans0081')}}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { portReg } from 'base/util/util';

const Tabs = {
  isTFTP: 'tftp'
};

export default {
  data() {
    return {
      dropdownVisible: false,
      tftp: {
        server: '',
        filename: ''
      },
      tftpRules: {
        server: [
          {
            rule: value => value,
            message: this.$t('trans0232')
          }
        ],
        filename: [
          {
            rule: value => value,
            message: this.$t('trans0232')
          }
        ]
      },
      enabled: true
    };
  },
  computed: {
    ...(() => {
      const result = {};
      Object.keys(Tabs).forEach(key => {
        result[key] = function temp() {
          return this.$route.params.category === Tabs[key];
        };
      });
      return result;
    })(),
    category() {
      return this.$route.params.category;
    }
  },
  watch: {
    category(nv, ov) {
      if (nv !== ov) {
        this.getPageInit();
      }
    }
  },
  mounted() {
    this.getPageInit();
  },
  methods: {
    getPageInit() {
      switch (this.category) {
        case Tabs.isTFTP:
          this.getTFTP();
          break;
        case Tabs.isTelnet:
          break;
        default:
          break;
      }
    },

    getTFTP() {
      this.$http.getTFTP().then(res => {
        this.tftp = res.data.result;
      });
    },
    showDropdown() {
      this.dropdownVisible = !this.dropdownVisible;
    },
    forward2page(url) {
      this.$router.push({ path: url });
    },

    updateTFTP() {
      if (this.$refs.tftp.validate()) {
        this.$loading.open();
        this.$http
          .updateTFTP(this.tftp)
          .then(() => {
            this.$loading.close();
            this.$toast(this.$t('trans0040'), 3000, 'success');
          })
          .catch(() => {
            this.$loading.close();
          });
      }
    }
  }
};
</script>
