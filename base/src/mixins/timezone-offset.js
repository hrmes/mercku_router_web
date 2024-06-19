const timezones = require('base/assets/timezones/zh-CN.json');

export default {
  data() {
    return {
      timezones,
      timezone: []
    };
  },
  mounted() {
    this.getTimezone();
  },
  methods: {
    getTimezone() {
      const reg = /([-+])?(\d+)\:(\d+)/;
      this.$http.getTimezone().then(res => {
        const { offset, position } = res.data.result;
        const { timezoneDetail } = this.timezones.find(
          item => item.offset === offset && item.position === position
        );
        const timezoneArr = timezoneDetail.match(reg).slice(1, 4);
        let timezone = parseInt(
          `${timezoneArr[0]}${timezoneArr[1] * 60 +
            parseInt(timezoneArr[2], 10)}`,
          10
        );
        if (this.isDST()) {
          timezone += 60;
        }
        this.timezone = timezone;
      });
    },
    isSameTimezoneOffset() {
      const timezoneOffset = 0 - new Date().getTimezoneOffset(); // 获取本地时间与GMT的分钟差。
      if (this.timezone !== timezoneOffset) {
        return new Promise(resolve => {
          this.$dialog.confirm({
            okText: this.$t('trans0024'),
            cancelText: this.$t('trans0926'),
            message: this.$t('trans0925'),
            callback: {
              ok: () => {
                resolve({
                  same: false,
                  redirect: true
                });
                this.$router.push({ path: '/setting/timezone' });
              },
              cancel: () => {
                resolve({
                  same: false,
                  redirect: false
                });
              }
            }
          });
        });
      }
      return Promise.resolve({
        same: true,
        redirect: false
      });
    },
    isDST() {
      const now = new Date();
      const Jan = new Date(now.getFullYear(), 0);
      const Jul = new Date(now.getFullYear(), 6);
      if (
        Jan.getTimezoneOffset() > Jul.getTimezoneOffset() &&
        now.getTimezoneOffset() !== Jan.getTimezoneOffset()
      ) {
        return true;
      }
      if (
        Jan.getTimezoneOffset() < Jul.getTimezoneOffset() &&
        now.getTimezoneOffset() !== Jul.getTimezoneOffset()
      ) {
        return true;
      }
      return false;
    }
  }
};
