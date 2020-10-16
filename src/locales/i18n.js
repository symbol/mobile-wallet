/**
 * @format
 * @flow
 */

import i18n from 'i18n-js';
import * as RNLocalize from 'react-native-localize';
import memoize from 'lodash.memoize';
import { I18nManager } from 'react-native';

// fallback if no available language fits
export const fallbackLanguage = { languageTag: 'en', isRTL: false };

const translationGetters = {
  en: () => require('./translations/en.json'),
  // Require new languages here
  es: () => require('./translations/es.json'),
  it: () => require('./translations/it.json'),
  ja: () => require('./translations/ja.json'),
  //pl: () => require('../locales/pl.json'),
  ru: () => require('./translations/ru.json'),
  uk: () => require('./translations/uk.json'),
  zh: () => require('./translations/zh.json'),
};

const languageNames = {
	en: 'English',
	es: 'Español',
	it: 'Italiano',
	ja: '日本語',
	//pl: 'Polszczyzna',
	ru: 'Русский',
	uk: 'Українська',
	zh: '汉语'
}

const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key)
);

const setI18nConfig = (languageCode?: string) => {
  const { languageTag, isRTL } = getLocaleLanguage(languageCode);
  setActiveLocalelanguage(languageTag, isRTL);
};

const setActiveLocalelanguage = (languageTag, isRTL) => {
  // clear translation cache
  translate.cache.clear();
  // update layout direction
  I18nManager.forceRTL(isRTL);

  // set i18n-js config
  i18n.translations = { [languageTag]: translationGetters[languageTag]() };
  i18n.locale = languageTag;
};

const getLocaleLanguage = (languageCode: ?string): { languageTag: string, isRTL: boolean } => {
  if (languageCode === undefined || languageCode === null) {
    return fallbackLanguage;
  }

  const languageTranslation = Object.keys(translationGetters).filter(item => languageCode === item);
  return languageTranslation.length > 0
    ? { languageTag: languageCode, isRTL: false }
    : fallbackLanguage;
};

const getLocales = (): Array<string> => {
  return Object.keys(translationGetters);
};

export { getLocales, setI18nConfig, getLocaleLanguage, languageNames };
export default translate;
