<template>
  <div class="timezone-container">
    <nav-bar :option="option" />
    <div class="list-container" ref="wrapper">
      <div class="list">
        <div @click="set(timezone)" class="timezone" :key="index" v-for="(timezone,index) in timezones">
          <div class="value">{{timezone.timename}}</div>
          <div class="label">{{timezone.name}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import BScroll from 'better-scroll';

export default {
  mounted() {
    this.$nextTick(() => {
      this.scroll = new BScroll(this.$refs.wrapper, {
        scrollY: true
      });
    });
  },
  data() {
    return {
      option: {
        left: {
          icon: true,
          text: 'arrow-left',
          click: () => {
            this.$router.replace({ path: '/wlan' });
          }
        },
        center: {
          text: this.$t('trans0273')
        }
      },
      timezones: require(`../../timezones/${this.$i18n.locale}.json`)
    };
  },
  methods: {
    set(timezone) {
      this.routerConfig.setTimezone(
        timezone.timename,
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
  .list-container {
    height: 100%;
    .list {
      .timezone {
        padding: 0.1rem 0.15rem;
        font-size: 0.12rem;
      }
    }
  }
}
</style>
