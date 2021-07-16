const addZeroFront = val => (val < 10 ? `0${val}` : val);
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
      const timezoneOffset = new Date().getTimezoneOffset(); // 获取本地时间与GMT的分钟差。
      const timezoneOffsetAbs = Math.abs(timezoneOffset);
      const symbol = timezoneOffset < 0 ? '-' : '';
      const hour = addZeroFront(timezoneOffsetAbs / 60);
      const minute = addZeroFront(timezoneOffsetAbs % 60);
      const timezoneDetailNow = `GMT${symbol}${hour}:${minute}`;
      this.$http.getTimezone().then(res => {
        const { offset, position } = res.data.result;
        const { timezoneDetail } = this.timezones.find(
          item => item.offset === offset && item.position === position
        );
        if (timezoneDetailNow !== timezoneDetail) {
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
