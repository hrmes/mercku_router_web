<template>
  <div class="device-container">
    <div class="device-wrapper">
      <div class="title">{{$t('trans0235')}}</div>
      <div class="table">
        <m-table :data="data" stripe border :row-class="rowCalss">
          <m-table-column index label="编号" min-width="40px"></m-table-column>
          <m-table-column prop="name" label="名字" align="center" width="250"></m-table-column>
          <m-table-column prop="age" label="年龄" align="center"></m-table-column>
          <m-table-column prop="login" label="username"></m-table-column>
          <m-table-column label="操作" class-name="td-test" label-class-name="th-test">
            <template slot-scope="scope">
              <a href="#">{{scope.row.login}}</a>
            </template>
          </m-table-column>
        </m-table>
      </div>
    </div>
  </div>
</template>
<script>
import layout from '../../../layout.vue';
import TimePicker from '../../../component/timePicker/index.vue';
import DatePicker from '../../../component/datePicker/index.vue';

export default {
  components: {
    layout,
    'm-time-picker': TimePicker,
    'm-date-picker': DatePicker
  },
  data() {
    return {
      data: [
        { name: '张三', age: 19, login: 'zhangsan' },
        { name: '李四', age: 18, login: 'lisi' },
        { name: '王五', age: 20, login: 'wangwu' },
        { name: '测试员', age: 21, login: 'ceshi' }
      ]
    };
  },
  methods: {
    rowHover(row) {
      console.log(row);
    },
    rowCalss(row) {
      return ['test'];
    }
  }
};
</script>
<style lang="scss" scoped>
.device-container {
  flex: auto;
  background: white;
  padding: 0 20px;
  .device-wrapper {
    flex: 1;
    .title {
      font-size: 16px;
      color: #333333;
      font-weight: 600;
      padding: 15px 0;
      border-bottom: 1px solid #f1f1f1;
    }
  }
}
</style>
