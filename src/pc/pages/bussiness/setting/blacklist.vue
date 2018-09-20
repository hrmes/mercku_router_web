<template>
  <layout>
    <div class="blacklist-container">
      <div class="content">
        <div class='w-header'>
          {{$t('trans0288')}}
        </div>
      </div>
    </div>
  </layout>
</template>
<script>
import layout from '../../../layout.vue';

export default {
  components: {
    layout
  },
  data() {
    return {
      blacklist: []
    };
  },
  mounted() {
    this.getBlacklist();
  },
  methods: {
    getBlacklist() {
      this.$loading.open();
      this.$http
        .getBlacklist()
        .then(res => {
          this.$loading.close();
          this.blacklist = res.data.result;
        })
        .catch(err => {
          if (err.upgrading) {
            return;
          }
          this.$loading.close();
          if (err && err.error) {
            this.$toast(this.$t(err.error.code));
          } else {
            this.$router.push({ path: '/unconnect' });
          }
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.blacklist-container {
  position: relative;
  flex: auto;
  padding: 0 2%;
  display: flex;
  .content {
    border-radius: 8px;
    padding: 0 20px;
    background: white;
    position: relative;
    flex: 1;
    .w-header {
      height: 60px;
      border-bottom: 1px solid #f1f1f1;
      font-size: 16px;
      color: #333333;
      line-height: 60px;
      font-weight: 400;
    }
  }
}
@media screen and (max-width: 768px) {
  .blacklist-container {
    padding: 20px 16px;
    .content {
      .w-header {
        font-size: 14px;
        height: 44px;
        line-height: 44px;
      }
      min-height: 450px;
    }
  }
}
</style>

