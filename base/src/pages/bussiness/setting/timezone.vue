<template>
  <div class="page">
    <div v-if="$store.state.isMobile"
         class='page-header'>
      {{$t('trans0272')}}
    </div>
    <div class="page-content">
      <m-form ref="form"
              class='form'
              :model="form">
        <m-form-item class="item"
                     prop='password'>
          <m-select :label="$t('trans0273')"
                    v-model="form.timezone"
                    :options="timezones"
                    :needProcessing="true"></m-select>
        </m-form-item>
      </m-form>
      <div class="form-button">
        <button class="btn"
                v-defaultbutton
                @click="submit()">{{$t('trans0081')}}</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      timezones: [],
      timezoneText: '',
      form: {
        timezone: ''
      }
    };
  },
  created() {
    this.getTimezone();
    let array = [];
    array = require(`../../../timezones/${this.$i18n.locale}.json`);
    this.timezones = array.map(t => ({
      text: `(${t.timezoneDetail}) ${t.coutryName}`,
      mainTitle: t.timezoneDetail,
      subTitle: t.coutryName,
      value: `${t.offset}:${t.position}`
    }));
  },
  methods: {
    getTimezoneText() {
      this.timezones.forEach(t => {
        if (t.value === this.form.timezone) {
          this.timezoneText = t.text;
        }
      });
    },
    getTimezone() {
      this.$loading.open();
      this.$http.getTimezone().then(res => {
        const timezone = res.data.result;
        this.form.timezone = `${timezone.offset}:${timezone.position}`;
        this.getTimezoneText();
        this.$loading.close();
      });
    },
    submit() {
      this.$loading.open();
      const timezone = this.form.timezone.split(':');
      const data = {
        offset: parseInt(timezone[0], 10),
        position: parseInt(timezone[1], 10)
      };
      this.$http
        .setTimezone(data)
        .then(() => {
          this.$loading.close();
          this.$toast(this.$t('trans0040'), 3000, 'success');
          this.getTimezoneText();
        })
        .catch(() => {
          this.$loading.close();
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.page-content {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  .form {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    align-items: center;
  }
  .form-button {
    margin-top: 0;
    padding-top: 25px;
    border-top: 1px solid var(--hr-color);
  }
}

@media screen and (max-width: 768px) {
  .page-content {
    .current-timezone {
      width: 100%;
    }
  }
}
</style>
