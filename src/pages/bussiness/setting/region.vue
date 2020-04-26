<template>
  <div class="page">
    <div class="page-header">
      {{$t('trans0639')}}
    </div>
    <div class="page-content">
      <m-form class="form">
        <m-form-item class="form__switch">
          <m-select :height="300"
                    :label="$t('trans0639')"
                    v-model="form.region.id"
                    :options="regions"></m-select>
        </m-form-item>
        <div class="form__label">{{$t('trans0646')}}</div>
      </m-form>
      <div class="form-button">
        <button class="btn primary"
                v-defaultbutton
                @click="updateRegion">{{$t('trans0081')}}</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {
        region: {
          id: ''
        }
      },
      regions: []
    };
  },
  methods: {
    updateRegion() {
      this.$dialog.confirm({
        okText: this.$t('trans0024'),
        cancelText: this.$t('trans0025'),
        message: this.$t('trans0229'),
        callback: {
          ok: () => {
            this.$http
              .setRegion({
                region_id: this.form.region.id
              })
              .then(() => {
                this.$reconnect({
                  onsuccess: () => {
                    this.$toast(this.$t('trans0040'), 3000, 'success');
                  },
                  ontimeout: () => {
                    this.$router.push({ path: '/unconnect' });
                  },
                  timeout: 60
                });
              });
          }
        }
      });
    },
    getInitData() {
      this.$loading.open();

      Promise.all([this.$http.getRegion(), this.$http.getSupportRegions()])
        .then(resArr => {
          const region = resArr[0].data.result;
          this.form.region = region;

          let allRegion = require(`@/assets/regions/${this.$i18n.locale}.json`);
          allRegion = allRegion.map(r => ({
            text: r.name,
            value: parseInt(r.code, 10)
          }));
          // 从所有区域中过滤掉不支持选择的区域
          const regions = [];
          const supportRegions = resArr[1].data.result;

          supportRegions.forEach(sr => {
            // const id = `${sr.id}`; // change number to string
            const t = allRegion.filter(ar => ar.value === sr.id)[0];
            if (t) {
              regions.push(t);
            }
          });
          this.regions = regions;
          this.$loading.close();
        })
        .catch(() => {
          this.$loading.close();
        });
    }
  },
  mounted() {
    this.getInitData();
  }
};
</script>

<style lang="scss" scoped>
.page {
  .page-content {
    .form {
      .form__label {
        font-size: 12px;
        color: #999;
        max-width: 340px;
      }
      .form-item {
        margin-bottom: 10px;
      }
    }
    .form-button {
      margin-top: 30px;
    }
  }
}
</style>
