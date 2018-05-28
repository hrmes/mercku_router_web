<template>
    <input class="switch switch-animation" type="checkbox" :checked='checked' :disabled='disabled' @click='this.change'>
</template>
<script>
export default {
  data() {
    return {
      checked: false
    };
  },
  props: ['onChange', 'disabled'],
  methods: {
    change() {
      this.checked = !this.checked;
      if (this.onChange) {
        this.onChange(this.checked);
      }
    }
  }
};
</script>
</script>
<style lang="scss" type="text/scss" scoped>
.switch {
  cursor: pointer;
  width: 46px;
  height: 22px;
  position: relative;
  border: 1px solid #858585;
  background-color: #858585;
  box-shadow: #a1a0a0 0 0 0 0 inset;
  border-radius: 22px;
  background-clip: content-box;
  display: inline-block;
  -webkit-appearance: none;
  user-select: none;
  outline: none;
}
.switch:before {
  content: '';
  width: 16px;
  height: 16px;
  position: absolute;
  top: 2px;
  left: 2px;
  border-radius: 16px;
  background-color: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
}

.switch:checked {
  border-color: #00d061;
  box-shadow: #00d061 0 0 0 16px inset;
  background-color: #00d061;
}

.switch:checked:before {
  left: 26px;
}
.switch.switch-animation {
  transition: border cubic-bezier(0, 0, 0, 1) 0.4s,
    box-shadow cubic-bezier(0, 0, 0, 1) 0.4s;
}
.switch.switch-animation:before {
  transition: left 0.3s;
}

.switch.switch-animation:checked {
  box-shadow: #00d061 0 0 0 16px inset;
  background-color: #00d061;
  transition: border ease 0.4s, box-shadow ease 0.4s, background-color ease 1.2s;
}
.switch.switch-animation:checked:before {
  transition: left 0.3s;
}
</style>
