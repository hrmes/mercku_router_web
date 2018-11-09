import MMenu from 'components/menu/index.vue';
import MHeader from 'components/header/header.vue';
import mPolicy from 'components/policy/index.vue';
import mInput from 'components/input/input.vue';
import mStep from 'components/step/index.vue';
import mCheckbox from 'components/checkbox/index.vue';
import mForm from 'components/form/index.vue';
import mFormItem from 'components/formItem/index.vue';
import mUpload from 'components/upload/index.vue';
import mProgress from 'components/progress/index.vue';
import mSelect from 'components/select/index.vue';
import mRadioGroup from 'components/radioGroup/index.vue';

const registerComponents = _Vue => {
  _Vue.component('m-menu', MMenu);
  _Vue.component('m-header', MHeader);
  _Vue.component('m-policy', mPolicy);
  _Vue.component('m-input', mInput);
  _Vue.component('m-step', mStep);
  _Vue.component('m-checkbox', mCheckbox);
  _Vue.component('m-form', mForm);
  _Vue.component('m-form-item', mFormItem);
  _Vue.component('m-upload', mUpload);
  _Vue.component('m-progress', mProgress);
  _Vue.component('m-select', mSelect);
  _Vue.component('m-radio-group', mRadioGroup);
};

export default registerComponents;
