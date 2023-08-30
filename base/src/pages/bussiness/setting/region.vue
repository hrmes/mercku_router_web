<template>
  <div class="page">
    <div v-if="$store.state.isMobile"
         class="page-header">
      {{$t('trans0639')}}
    </div>
    <div class="page-content">
      <div class="page-content__main">
        <div class="row-1">
          <div class="card">
            <m-form-item class="last">
              <m-select v-model="form.region.id"
                        :label="$t('trans0639')"
                        :isDrawerStyle="true"
                        :options="regions"></m-select>
              <p class="des-tips">{{$t('trans0646')}}</p>
            </m-form-item>
          </div>
        </div>
      </div>
      <div class="page-content__bottom">
        <div class="form-button__wrapper">
          <button class="btn"
                  v-defaultbutton
                  @click="updateRegion">{{$t('trans0081')}}</button>
        </div>
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
                    this.$toast(this.$t('trans0040'), 2000, 'success');
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

          let allRegion = require(`../../../assets/regions/${this.$i18n.locale}.json`);

          allRegion = allRegion.map(r => ({
            text: r.name,
            value: parseInt(r.code, 10)
          }));
          // 从所有区域中过滤掉不支持选择的区域
          const regions = [];
          const supportRegions = resArr[1].data.result;

          // 显示需要排序，原本的文件中是有序的，支持列表时无序的，所以以原本的文件为基准
          allRegion.forEach(ar => {
            // const id = `${sr.id}`; // change number to string
            const t = supportRegions.filter(sr => sr.id === ar.value)[0];
            if (t) {
              regions.push(ar);
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
