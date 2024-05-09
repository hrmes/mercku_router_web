// import mHeader from './component/header/header.vue';
// import mFooter from './component/footer/index.vue';
// import mInput from './component/input/input.vue';
// import mStep from './component/step/index.vue';
// import mCheckbox from './component/checkbox/index.vue';
// import mForm from './component/form/index.vue';
// import mFormItem from './component/formItem/index.vue';
// import mUpload from './component/upload/index.vue';
// import mProgress from './component/progress/index.vue';
// import mSelect from './component/select/index.vue';
// import mScanUpperSelect from './component/scanUpperSelect/index.vue';
// import mRadioGroup from './component/radioGroup/index.vue';
// import mRadioCardGroup from './component/radioCardGroup/index.vue';
// import mSwitch from './component/switch/index.vue';
// import mPopover from './component/popover/index.vue';
// import mEditableSelect from './component/editableSelect/index.vue';
// import mTimePicker from './component/timePicker/index.vue';
// import mSpinner from './component/spinner/index.vue';
// import mTabs from './component/tabs/tabs.vue';
// import mTab from './component/tabs/tab.vue';
// import mModal from './component/modal/index.vue';
// import mModalHeader from './component/modal/header.vue';
// import mModalBody from './component/modal/body.vue';
// import mModalFooter from './component/modal/footer.vue';
import mLoading from './component/loading/loading-canvas.vue';
import mLottieLoading from './component/loading/loading-lottie.vue';
// import mTag from './component/tag/index.vue';
// import mCountTo from './component/countTo/index.vue';
// import mIpInput from './component/ipInput/index.vue';
import clickoutside from './component/clickoutside/index.vue';
import defaultbutton from './component/default-button/index.vue';

const registerComponents = _Vue => {
  _Vue.directive('clickoutside', clickoutside);
  _Vue.directive('defaultbutton', defaultbutton);
  _Vue.component('m-header', () => import('./component/header/header.vue'));
  _Vue.component('m-footer', () => import('./component/footer/index.vue'));
  _Vue.component('m-input', () => import('./component/input/input.vue'));
  _Vue.component('m-step', () => import('./component/step/index.vue'));
  _Vue.component('m-checkbox', () => import('./component/checkbox/index.vue'));
  _Vue.component('m-form', () => import('./component/form/index.vue'));
  _Vue.component('m-form-item', () => import('./component/formItem/index.vue'));
  _Vue.component('m-upload', () => import('./component/upload/index.vue'));
  _Vue.component('m-progress', () => import('./component/progress/index.vue'));
  _Vue.component('m-select', () => import('./component/select/index.vue'));
  _Vue.component('m-scan-upper-select', () =>
    import('./component/scanUpperSelect/index.vue')
  );
  _Vue.component('m-radio-group', () =>
    import('./component/radioGroup/index.vue')
  );
  _Vue.component('m-radio-card-group', () =>
    import('./component/radioCardGroup/index.vue')
  );
  _Vue.component('m-switch', () => import('./component/switch/index.vue'));
  _Vue.component('m-popover', () => import('./component/popover/index.vue'));
  _Vue.component('m-editable-select', () =>
    import('./component/editableSelect/index.vue')
  );
  _Vue.component('m-time-picker', () =>
    import('./component/timePicker/index.vue')
  );
  _Vue.component('m-spinner', () => import('./component/spinner/index.vue'));
  _Vue.component('m-tabs', () => import('./component/tabs/tabs.vue'));
  _Vue.component('m-tab', () => import('./component/tabs/tab.vue'));
  _Vue.component('m-modal', () => import('./component/modal/index.vue'));
  _Vue.component('m-modal-header', () =>
    import('./component/modal/header.vue')
  );
  _Vue.component('m-modal-body', () => import('./component/modal/body.vue'));
  _Vue.component('m-modal-footer', () =>
    import('./component/modal/footer.vue')
  );
  _Vue.component('m-loading', mLoading);
  _Vue.component('m-lottie-loading', mLottieLoading);
  _Vue.component('m-tag', () => import('./component/tag/index.vue'));
  _Vue.component('m-count-to', () => import('./component/countTo/index.vue'));
  _Vue.component('m-ip-input', () => import('./component/ipInput/index.vue'));
};

export default registerComponents;
