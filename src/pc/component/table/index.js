import MTable from './table.vue';
import MTableColumn from './table-column';

MTable.install = (Vue) => {
  Vue.component(MTable.name, MTable);
  Vue.component(MTableColumn.name, MTableColumn);
};

export {
  MTable,
  MTableColumn
};
