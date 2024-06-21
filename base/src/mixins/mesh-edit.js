import { getStringByte } from 'base/util/util';
import {
  RouterColor,
  SnABJMapName,
  ModelIdJMapName,
  ModelIds,
  RouterHasModelDistinctionMap
} from 'base/util/constant';
import store from '@/store/index';

const DeviceColorList = [
  {
    name: 'black',
    value: 'linear-gradient(298deg, #515151 30%, #151515 70%)'
  },
  {
    name: 'white',
    value: 'linear-gradient(298deg, #fff 30%, #ebebeb 70%)'
  },
  {
    name: 'grey',
    value: ' linear-gradient(298deg, #c4d4db 30%, #6a848a 70%)'
  },
  {
    name: 'red',
    value: 'linear-gradient(298deg, #f74949 30%, #c41b1b 70%)'
  }
];
export default {
  data() {
    return {
      RouterColor,
      showMeshEditModal: false,
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
      ],
      selectedColorName: store.state.deviceColor
    };
  },
  computed: {
    gwAvailableDeviceColors() {
      const MODEL_ID = process.env.MODEL_CONFIG.id;
      const ModelIdJMapNameList = ModelIdJMapName[MODEL_ID];
      let productInfo;

      if (Object.keys(ModelIdJMapNameList).length > 1) {
        productInfo =
          process.env.CUSTOMER_CONFIG.routers[
            ModelIdJMapNameList[this.$store.state.modelVersion]
          ];
      } else {
        productInfo = process.env.CUSTOMER_CONFIG.routers[ModelIds[MODEL_ID]];
      }
      return DeviceColorList.filter(color =>
        productInfo.deviceColors.includes(color.name)
      );
    },
    lowerCaseModelId() {
      return process.env.MODEL_CONFIG.id.toLowerCase();
    }
  },
  methods: {
    nodeAvailableDeviceColors(sn) {
      const modelID = sn?.slice(0, 2);
      const modelVersion = sn?.charAt(9);
      const productInfo =
        process.env.CUSTOMER_CONFIG.routers[
          SnABJMapName?.[modelID]?.[modelVersion]
        ] || {};
      console.log(productInfo);
      return DeviceColorList.filter(color =>
        productInfo?.deviceColors?.includes(color.name)
      );
    },
    closeMeshEditModal() {
      this.showMeshEditModal = false;
      this.selectedColorName = this.$store.state.deviceColor;
      this.form.name = '';
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
            this.$store.state.deviceColor = this.selectedColorName;
            localStorage.setItem(
              `${this.lowerCaseModelId}_deviceColor`,
              this.selectedColorName
            );
            this?.createIntervalTask?.();
            this.$toast(this.$t('trans0040'), 2000, 'success');
            this.showMeshEditModal = false;
          })
          .catch(() => {
            this?.createIntervalTask?.();
          })
          .finally(() => {
            this.$loading.close();
          });
      }
    },
    changeDeviceColor(val) {
      this.selectedColorName = val.name;
    }
  }
};
