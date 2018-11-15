<template>
  <div class="page">
    <div class="page-header">
      {{$t('trans0421')}}
    </div>
    <div class="page-content">
      <div class="form">
        <div class="form-item">
          <m-switch :label="$t('trans0462')" v-model="enabled"></m-switch>
        </div>
        <div class="log-container"></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      enabled: false
    };
  }
};
</script>
<style lang="scss" scoped>
.page-content {
  flex-direction: column;
}
.form {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  .log-container {
    border-radius: 4px;
    border: solid 1px #bdbdbd;
    flex: 1;
  }
}
</style>
