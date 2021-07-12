export default {
  methods: {
    isSameTimezoneOffset() {
      const timezoneOffset = new Date().getTimezoneOffset() / 60;
      this.$http.getTimezone().then(res => {
        const { offset } = res.data.result;
        if (timezoneOffset !== offset) {
          this.$dialog.confirm({
            okText: this.$t('trans0024'),
            cancelText: this.$t('trans0925'),
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
