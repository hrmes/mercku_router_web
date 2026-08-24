import {
  formatBandWidth,
  formatNetworkData,
  formatSpeed,
} from 'base/util/util';

function localizeResult(result, i18nInstance) {
  return {
    value: i18nInstance.toLocaleNumber(
      result.value,
      i18nInstance.i18n.locale
    ),
    unit: result.unit,
  };
}

export function installBasePageFormatters(VueCtor, i18nInstance) {
  VueCtor.prototype.formatNetworkData = value => (
    localizeResult(formatNetworkData(value), i18nInstance)
  );
  VueCtor.prototype.formatSpeed = value => (
    localizeResult(formatSpeed(value), i18nInstance)
  );
  VueCtor.prototype.formatBandWidth = value => (
    localizeResult(formatBandWidth(value), i18nInstance)
  );
}

export default installBasePageFormatters;
