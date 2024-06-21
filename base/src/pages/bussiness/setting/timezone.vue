<template>
  <div class="page">
    <div v-if="$store.state.isMobile"
         class='page-header'>
      {{$t('trans0272')}}
    </div>
    <div class="page-content">
      <div class="page-content__main">
        <div class="row-1">
          <div class="card">
            <m-form-item class="last">
              <m-select v-model="form.timezone"
                        :label="$t('trans0273')"
                        :options="timezones"
                        needProcessing
                        isDrawerStyle
                        filterable></m-select>
            </m-form-item>
          </div>
        </div>
      </div>
      <div class="page-content__bottom">
        <div class="form-button__wrapper">
          <button class="btn"
                  v-defaultbutton
                  @click="submit()">{{$t('trans0081')}}</button>
        </div>
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
    let array = [];
    array = require(`base/assets/timezones/${this.$i18n.locale}.json`);
    this.timezones = array.map(t => ({
      text: `(${t.timezoneDetail}) ${t.coutryName}`,
      mainTitle: t.timezoneDetail,
      subTitle: t.coutryName,
      value: `${t.offset}:${t.position}`
    }));
    this.getTimezone();
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
          this.$toast(this.$t('trans0040'), 2000, 'success');
          this.getTimezoneText();
        })
        .catch(() => {
          this.$loading.close();
        });
    }
  }
};
</script>
