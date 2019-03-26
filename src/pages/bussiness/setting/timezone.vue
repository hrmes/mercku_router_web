<template>
  <div class="page">
    <div class='page-header'>
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
                    :options="timezones"></m-select>
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
    if (this.$i18n.locale === 'zh-CN') {
      array = require('../../../timezones/zh-CN.json');
    } else {
      array = require('../../../timezones/en-US.json');
    }
    this.timezones = array.map(t => ({
      text: `(${t.timename})${t.name}`,
      value: `${t.timezone}:${t.position}`
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
      this.$http.getTimezone().then(res => {
        const timezone = res.data.result;
        this.form.timezone = `${timezone.offset}:${timezone.position}`;
        this.getTimezoneText();
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
  align-items: center;
  .form {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    align-items: center;
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
