export default {
  data() {
    return {
      timezones: []
    };
  },
  created() {
    this.timezones = require(`../timezones/${this.$i18n.locale}.json`);
  },
  methods: {
    isSameTimezoneOffset() {
      const timezoneOffset = 0 - new Date().getTimezoneOffset(); // 获取本地时间与GMT的分钟差。
      const reg = /(\-|\+)|(\d+)/g;
      this.$http.getTimezone().then(res => {
        const { offset, position } = res.data.result;
        const { timezoneDetail } = this.timezones.find(
          item => item.offset === offset && item.position === position
        );
        const timezoneArr = timezoneDetail.match(reg);
        const timezone = parseInt(
          `${timezoneArr[0]}${timezoneArr[1] * 60 +
            parseInt(timezoneArr[2], 10)}`,
          10
        );
        if (timezone !== timezoneOffset) {
          this.$dialog.confirm({
            okText: this.$t('trans0024'),
            cancelText: this.$t('trans0926'),
            message: this.$t('trans0925'),
            callback: {
              ok: () => {
                this.$router.push({ path: '/setting/timezone' });
              }
            }
          });
        }
      });
    }
  }
};
