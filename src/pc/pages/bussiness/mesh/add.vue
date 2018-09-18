<template>
  <layout>
    <div class="mesh-container">
      <div class="content">
        <div class='w-header'>
          {{$t('trans0194')}}
        </div>
        <div class="type-container" v-show="current===0">
          <div>{{$t('trans0364')}}</div>
          <e-select label="修改设备名称" :options="options" v-model="select"></e-select>
        </div>
      </div>

    </div>
  </layout>
</template>
<script>
import Form from '../../../component/form/index.vue';
import FormItem from '../../../component/formItem/index.vue';
import Input from '../../../component/input/input.vue';
import EditableSelect from '../../../component/editableSelect/index.vue';
import Progress from '../../../component/progress/index.vue';
import layout from '../../../layout.vue';
import { passwordRule } from '../../../../util/util';

export default {
  components: {
    layout,
    eSelect: EditableSelect
  },
  data() {
    return {
      current: 0,
      options: ['客厅', '厨房', '卫生间'],
      select: '卫生间'
    };
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
.mesh-container {
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
      font-weight: 400;
    }
  }
}
@media screen and (max-width: 768px) {
  .mesh-container {
    padding: 20px 16px;
    .content {
      .w-header {
        font-size: 14px;
        height: 44px;
        line-height: 44px;
      }
      min-height: 450px;
    }
  }
}
</style>

