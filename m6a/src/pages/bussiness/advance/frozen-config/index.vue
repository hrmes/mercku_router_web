<template>
  <div class="page frozen">
    <div v-if="$store.state.isMobile"
         class="page-header">
      {{$t('trans1186')}}
    </div>
    <div class="page-content">
      <div class="page-content__main">
        <div class="row-1">
          <div class="card">
            <m-form-item class="last">
              <m-switch :label="$t('trans1186')"
                        class="smart-connect__switch"
                        v-model="enabled" />
              <div class="des-tips">{{$t('trans1187')}}</div>
            </m-form-item>
          </div>
        </div>
        <div class="row-2"
             v-if="enabled">
          <div class="card form"
               v-for="category in configurations"
               :key="category.name">
            <m-form-item class="category last">
              <div class="config-wrapper">
                <div class="config-item__name">
                  <m-checkbox :text='category.name'
                              :bold='true'
                              v-model="category.isCheckAll"
                              @change="val => handleCheckCategoryChange(val, category)"></m-checkbox>
                </div>
                <div class="config-item__list">
                  <div v-for="config in category.children"
                       class="config"
                       :key='config.name'
                       @change="val => handleCheckedConfigChange(val, category)">
                    <input type="checkbox"
                           :id="config.name"
                           :value="config.value"
                           v-model="category.checkedConfigList">
                    <label :for="config.name"
                           class="config__label">{{config.name}}</label>
                  </div>
                </div>
              </div>
            </m-form-item>
          </div>
        </div>
      </div>
      <div class="page-content__bottom">
        <div class="form-button__wrapper">
          <button class="btn primary"
                  v-defaultbutton
                  @click="save">{{$t('trans0081')}}</button>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
import routerConfigs from './router-configs';

export default {
  data() {
    return {
      enabled: false,
      frozenConfigList: [],
      configurations: {
        setting: {
          name: this.$t('trans0019'),
          isCheckAll: false,
          checkedConfigList: [],
          children: {
            [routerConfigs.setting.wifi]: {
              name: this.$t('trans1185'),
              value: routerConfigs.setting.wifi
            },
            [routerConfigs.setting.internet]: {
              name: this.$t('trans0142'),
              value: routerConfigs.setting.internet
            },
            [routerConfigs.setting.ipv6]: {
              name: this.$t('trans0620'),
              value: routerConfigs.setting.ipv6
            }
          }
        },
        advance: {
          name: this.$t('trans0416'),
          isCheckAll: false,
          checkedConfigList: [],
          children: {
            [routerConfigs.advance.tr069]: {
              name: this.$t('trans0499'),
              value: routerConfigs.advance.tr069
            }
          }
        }
      }
    };
  },
  watch: {
    frozenConfigList(val) {
      Object.keys(this.configurations).forEach(cateVal => {
        const cate = this.configurations[cateVal];
        const configurations = cate.children;
        const perArr = Object.keys(configurations);
        const perCount = perArr.length;
        const perList = perArr.map(item => configurations[item].value);
        cate.checkedConfigList = [];
        val.forEach(perVal => {
          if (perList.includes(perVal)) {
            cate.checkedConfigList.push(perVal);
          }
        });
        const checkedCount = cate.checkedConfigList.length;
        if (checkedCount === perCount) {
          cate.isCheckAll = true;
        }
      });
    }
  },
  computed: {
    formParams() {
      return {
        enabled: this.enabled,
        configs: this.enabled
          ? Object.values(this.configurations).flatMap(
            item => item.checkedConfigList
          )
          : []
      };
    }
  },
  methods: {
    handleCheckCategoryChange(val, category) {
      category.checkedConfigList = [];
      if (val) {
        category.checkedConfigList = this.getcheckedConfigList(
          category.children
        );
      }
      category.isCheckAll = val;
    },
    handleCheckedConfigChange(val, category) {
      const configCount = Object.keys(category.children).length;
      const checkedCount = category.checkedConfigList?.length;
      category.isCheckAll = configCount === checkedCount;
    },
    getcheckedConfigList(configs) {
      return Object.keys(configs).map(item => configs[item].value);
    },
    getRouterFrozenCofig() {
      this.$loading.open();
      this.$http
        .getRouterFrozenConfig()
        .then(res => {
          this.enabled = res.data.result.enabled;
          this.frozenConfigList = res.data.result.configs;
        })
        .finally(() => {
          this.$loading.close();
        });
    },
    save() {
      console.log(this.formParams);
      this.$loading.open();
      this.$http
        .updateRouterFrozenConfig(this.formParams)
        .then(() => {
          this.$toast(this.$t('trans0040'), 2000, 'success');
          this.getRouterFrozenCofig();
        })
        .finally(() => {
          this.$loading.close();
        });
    }
  },
  mounted() {
    this.getRouterFrozenCofig();
  }
};
</script>

<style lang="scss" scoped>
.page {
  .page-content {
    .form {
      .form-item {
        &.form__item--first {
          width: auto;
        }
      }
      .category {
        .config-wrapper {
          max-width: 340px;
          border-radius: 10px;
          // background: var(--table_row-bgc);
        }
        .config-item__name {
          padding: 15px 15px 5px;
          margin-bottom: 15px;
          border-bottom: 1.5px solid var(--dashboard_icon-bgc);
        }
        .config-item__list {
          width: 100%;
          display: flex;
          flex-direction: column;
          padding: 0 15px 5px;
          .config {
            width: 100%;
            margin-bottom: 10px;
          }
        }
        .config__label {
          margin-left: 12px;
        }
      }
      .tip__label {
        font-size: 12px;
        color: #999;
        margin-top: 10px;
        max-width: 340px;
      }
    }
    .form-button {
      margin-top: 0;
      padding-top: 25px;
      border-top: 1px solid var(--hr-color);
    }
  }
}
@media screen and (max-width: 768px) {
  .page {
    .page-content {
      width: 100vw;
      .form {
        .form-item {
          width: auto;
        }
      }
    }
  }
}
</style>
