<template>
  <div class="timezone-container">
    <div class="content">
      <div class='w-header'>
        {{$t('trans0273')}}
      </div>
      <div class="current-timezone">
        <p>{{$t('trans0373')}}</p>
        <p>{{timezoneText}}</p>
      </div>
      <m-form ref="form" class='form' :model="form">
        <m-form-item class="item" prop='password'>
          <m-select :label="$t('trans0273')" v-model="form.timezone" :options="timezones"></m-select>
        </m-form-item>
        <div class="btn-info">
          <button class="btn" @click="submit()">{{$t('trans0081')}}</button>
        </div>
      </m-form>
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
      array = require('../../../../timezones/zh-CN.json');
    } else {
      array = require('../../../../timezones/en-US.json');
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
        .catch(err => {
          if (err.upgrading) {
            return;
          }
          this.$loading.close();
          if (err && err.error) {
            this.$toast(this.$t(err.error.code));
          } else {
            this.$router.push({ path: '/unconnect' });
          }
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.timezone-container {
  position: relative;
  flex: auto;
  padding: 0 2%;
  display: flex;
  .content {
    border-radius: 8px;
    padding: 0 20px;
    background: white;
    position: relative;
    flex: 1;
    .w-header {
      height: 60px;
      border-bottom: 1px solid #f1f1f1;
      font-size: 16px;
      color: #333333;
      line-height: 60px;
      font-weight: bold;
    }
    .current-timezone {
      width: 350px;
      margin: 0 auto;
      margin-top: 30px;
      word-break: break-all;
      word-wrap: break-word;
      p {
        margin-bottom: 10px;
      }
    }
    .form {
      display: flex;
      justify-content: center;
      padding: 30px 0;
      flex-direction: column;
      align-items: center;
      align-items: center;
      .btn-info {
        display: block;
        text-align: center !important;
      }
      .check-info {
        display: flex;
        align-items: center;
        margin-top: 30px;
        label {
          margin-right: 10px;
          font-size: 16px;
          color: #333333;
        }
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .timezone-container {
    padding: 20px 16px;
    .content {
      .w-header {
        font-size: 14px;
        height: 44px;
        line-height: 44px;
      }
      min-height: 450px;
      .current-timezone {
        width: 100%;
      }
      .form {
        width: 100%;
        // padding: 0 20px;
        .form-item {
          width: 100%;
        }
        .input-info {
          width: 100%;
        }
        .title {
          margin-top: 20px;
          margin-bottom: 10px;
        }
        .check-info {
          display: flex;
          align-items: center;
          margin-top: 20px;
          label {
            margin-right: 10px;
            font-size: 16px;
            color: #333333;
          }
        }
        .btn-info {
          width: 100%;
        }
      }
    }
  }
}
</style>

