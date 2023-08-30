import { getStringByte } from 'base/util/util';

export default {
  data() {
    return {
      showModal: false,
      form: { name: '' },
      rules: {
        name: [
          {
            rule: value => !/^\s*$/.test(value),
            message: this.$t('trans0237')
          },
          {
            rule: value => {
              const length = getStringByte(value);
              if (length < 1 || length > 20) {
                return false;
              }
              return true;
            },
            message: this.$t('trans0261')
          }
        ]
      },
      options: [
        this.$t('trans0349'),
        this.$t('trans0350'),
        this.$t('trans0351'),
        this.$t('trans0352'),
        this.$t('trans0353'),
        this.$t('trans0354'),
        this.$t('trans0355'),
        this.$t('trans0356'),
        this.$t('trans0357'),
        this.$t('trans0358'),
        this.$t('trans0359'),
        this.$t('trans0360'),
        this.$t('trans0361'),
        this.$t('trans0362'),
        this.$t('trans0363')
      ]
    };
  },

  methods: {
    editMesh(gateway) {
      this.form.name = gateway.name;
      this.showModal = true;
    },
    closeUpdateModal() {
      this.form.newName = '';
      this.showModal = false;
    },
    updateMehsNode(router, name) {
      if (this.$refs.form.validate()) {
        this.$loading.open();
        this.$http
          .updateMeshNode({
            node_id: router.sn,
            data: { name }
          })
          .then(() => {
            router.name = name;
            this.$loading.close();
            this.showModal = false;
            this?.createIntervalTask?.();
            this.$toast(this.$t('trans0040'), 2000, 'success');
          })
          .catch(() => {
            this.$loading.close();
            this?.createIntervalTask?.();
          });
      }
    }
  }
};
