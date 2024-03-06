<template>
  <div class="page upgrade">
    <m-tabs>
      <m-tab v-for="tab in tabs"
             :key="tab.id"
             :class="{'selected':isCurrentTab(tab)}"
             @click.native="tabChange(tab.id)">
        <span> {{tab.text}}</span>
      </m-tab>
    </m-tabs>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabs: [
        {
          id: 'offline',
          text: this.$t('trans0204'),
        },
        {
          id: 'online',
          text: this.$t('trans0202'),
        },
        {
          id: 'auto',
          text: this.$t('trans0743'),
        }
      ]
    };
  },
  computed: {
    id() {
      return this.$route.name;
    },
  },
  methods: {
    isCurrentTab(tab) {
      return tab.id === this.id;
    },
    tabChange(id) {
      if (id !== this.id) {
        this.$router.push(`/system/upgrade/${id}`);
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.tabs {
  padding: 10px 20px;
  .tab {
    color: var(--text_default-color);
    background: var(--logout_btn-bgc);
    padding: 12px 20px;
    border-radius: 5px;
    box-shadow: unset;
    &.selected {
      box-shadow: unset;
      background: var(--text_default-color);
      color: var(--primary-bgc);
    }
  }
}
@media screen and(max-width:768px) {
  .tabs {
    margin-bottom: 0;
    .tab {
      padding: 10px;
      height: 100%;
    }
  }
}
</style>
