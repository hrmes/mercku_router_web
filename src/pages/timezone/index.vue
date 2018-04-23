<template>
  <div class="timezone-container">
    <nav-bar :option="option" :onLeftClick="onLeftClick" />
    <div class="list">
      <div @click="set(timezone)" class="timezone" :key="index" v-for="(timezone,index) in timezones">
        <div class="value">{{timezone.timename}}</div>
        <div class="label">{{timezone.name}}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      option: {
        left: {
          icon: true,
          text: 'arrow-left'
        },
        center: {
          text: this.$t('trans0273')
        }
      },
      timezones: require(`../../timezones/${this.$i18n.locale}.json`)
    };
  },
  methods: {
    onLeftClick() {
      this.$router.replace({ path: '/wlan' });
    },
    set(timezone) {
      this.routerConfig.setTimezone(
        timezone.name,
        timezone.timezone,
        timezone.position
      );
      this.$router.replace({ path: '/wlan' });
    }
  }
};
</script>
<style lang="scss" scoped>
.timezone-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  .list {
    flex: 1;
    overflow: auto;
    .timezone {
      padding: 0.1rem 0.15rem;
      font-size: 0.12rem;
      .label {
      }
      .value {
      }
    }
  }
}
</style>
