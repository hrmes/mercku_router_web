<template>
  <div class="page">
    <div class='page-header'>
      {{$t('trans0424')}}
    </div>
    <div class="page-content">
      <div class="switch-container">
        <div class="item">
          <label for="">{{$t('trans0424')}}</label>
          <m-switch v-model="wan.dos"
                    :onChange="updateFirewall"></m-switch>
        </div>
        <div class="item">
          <label for="">{{$t('trans0434')}}</label>
          <m-switch v-model="wan.ping"
                    :onChange="updateFirewall"></m-switch>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      wan: {
        dos: false,
        ping: true
      }
    };
  },
  mounted() {
    this.getFirewall();
  },
  methods: {
    getFirewall() {
      this.$http.getFirewall().then(res => {
        this.wan = res.data.result.wan;
      });
    },
    updateFirewall() {
      this.$loading.open();
      this.$http
        .updateFirewall({
          wan: this.wan
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
.switch-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  .item {
    display: flex;
    align-items: center;
    &:last-child {
      margin-top: 30px;
    }
    label {
      width: 200px;
      font-weight: bold;
    }
  }
}
</style>
