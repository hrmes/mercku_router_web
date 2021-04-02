<template>
  <svg @click="click"
       class="svg-icon"
       aria-hidden="true">
    <use :xlink:href="iconName"></use>
  </svg>
</template>
<script>
import './iconfont';

export default {
  name: 'mIcon',
  props: {
    name: {
      type: String,
      default: ''
    }
  },
  methods: {
    click() {
      this.$emit('click');
    }
  },
  computed: {
    iconName() {
      return `#iconic_${this.name}`;
    }
  }
};
</script>

<style lang="scss">
.svg-icon {
  fill: currentColor;
  overflow: hidden;
}
</style>
