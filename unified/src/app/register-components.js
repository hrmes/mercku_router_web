/**
 * Components currently used by the unified application.
 *
 * Do not import base/register-components here. That legacy registry eagerly
 * imports header/footer and their build-time CUSTOMER_CONFIG dependencies,
 * even though the unified pages do not render those components. Keeping this
 * list explicit makes reuse incremental: a legacy component is only added
 * after its MODEL_CONFIG/CUSTOMER_CONFIG assumptions have been removed.
 */
import mInput from 'base/component/input/input.vue';
import mStep from 'base/component/step/index.vue';
import mForm from 'base/component/form/index.vue';
import mFormItem from 'base/component/formItem/index.vue';
import mCheckbox from 'base/component/checkbox/index.vue';
import mUpload from 'base/component/upload/index.vue';
import mSelect from 'base/component/select/index.vue';
import mSwitch from 'base/component/switch/index.vue';
import mRadioGroup from 'base/component/radioGroup/index.vue';
import mRadioCardGroup from 'base/component/radioCardGroup/index.vue';
import mPopover from 'base/component/popover/index.vue';
import mEditableSelect from 'base/component/editableSelect/index.vue';
import mTimePicker from 'base/component/timePicker/index.vue';
import mSpinner from 'base/component/spinner/index.vue';
import mTabs from 'base/component/tabs/tabs.vue';
import mTab from 'base/component/tabs/tab.vue';
import mModal from 'base/component/modal/index.vue';
import mModalHeader from 'base/component/modal/header.vue';
import mModalBody from 'base/component/modal/body.vue';
import mModalFooter from 'base/component/modal/footer.vue';
import mLoading from 'base/component/loading/loading-canvas.vue';
import mLottieLoading from 'base/component/loading/loading-lottie.vue';
import mTag from 'base/component/tag/index.vue';
import mCountTo from 'base/component/countTo/index.vue';
import mIpInput from 'base/component/ipInput/index.vue';
import clickoutside from 'base/component/clickoutside/index.vue';
import defaultbutton from 'base/component/default-button/index.vue';
import mHeader from 'base/component/header/header.vue';
import mFooter from 'base/component/footer/index.vue';

export default function registerComponents(Vue) {
  Vue.directive('clickoutside', clickoutside);
  Vue.directive('defaultbutton', defaultbutton);
  Vue.component('m-input', mInput);
  Vue.component('m-step', mStep);
  Vue.component('m-form', mForm);
  Vue.component('m-form-item', mFormItem);
  Vue.component('m-checkbox', mCheckbox);
  Vue.component('m-upload', mUpload);
  Vue.component('m-select', mSelect);
  Vue.component('m-switch', mSwitch);
  Vue.component('m-radio-group', mRadioGroup);
  Vue.component('m-radio-card-group', mRadioCardGroup);
  Vue.component('m-popover', mPopover);
  Vue.component('m-editable-select', mEditableSelect);
  Vue.component('m-time-picker', mTimePicker);
  Vue.component('m-spinner', mSpinner);
  Vue.component('m-tabs', mTabs);
  Vue.component('m-tab', mTab);
  Vue.component('m-modal', mModal);
  Vue.component('m-modal-header', mModalHeader);
  Vue.component('m-modal-body', mModalBody);
  Vue.component('m-modal-footer', mModalFooter);
  Vue.component('m-loading', mLoading);
  Vue.component('m-lottie-loading', mLottieLoading);
  Vue.component('m-tag', mTag);
  Vue.component('m-count-to', mCountTo);
  Vue.component('m-ip-input', mIpInput);
  Vue.component('m-header', mHeader);
  Vue.component('m-footer', mFooter);
}
