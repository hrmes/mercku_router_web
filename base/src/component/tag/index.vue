<template>
  <div class="mk-tag">
    <slot></slot>
  </div>
</template>
<style lang="scss">
.mk-tag {
  width: auto;
  padding: 0 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--tag-background-color);
  border-radius: 10px;
  font-size: 12px;
  color: var(--tag-text-color);
  font-weight: normal;
  + .mk-tag {
    margin-left: 5px;
  }
}
</style>
