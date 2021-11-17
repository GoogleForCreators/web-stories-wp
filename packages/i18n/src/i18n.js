/*
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * External dependencies
 */
import Tannin from 'tannin';

const TEXT_DOMAIN = 'web-stories';

const tannin = new Tannin({
  [TEXT_DOMAIN]: {
    '': {
      plural_forms(n) {
        return n === 1 ? 0 : 1;
      },
    },
  },
});

/**
 * Merge locale data into the Tannin instance.
 *
 * @param {Object} data Locale data.
 */
export function setLocaleData(data) {
  const translations =
    data.locale_data['web-stories'] || data.locale_data.messages;
  tannin.data[TEXT_DOMAIN] = {
    ...tannin.data[TEXT_DOMAIN],
    ...translations,
  };

  tannin.data[TEXT_DOMAIN][''] = {
    ...tannin.data[TEXT_DOMAIN][''],
  };
}

/**
 * Retrieve the translation of the given text.
 *
 * @param {string} text Text to translate.
 * @param {string} [domain] Text domain. Unique identifier for retrieving translated strings.
 * @return {string} Translated text.
 */
export function __(text, domain = TEXT_DOMAIN) {
  return tannin.dcnpgettext(domain, undefined, text);
}

/**
 * Retrieve the translation of the given text with gettext context..
 *
 * @param {string} text Text to translate.
 * @param {string} context Context information for the translators.
 * @param {string} [domain] Text domain. Unique identifier for retrieving translated strings.
 * @return {string} Translated text.
 */
export function _x(text, context, domain = TEXT_DOMAIN) {
  return tannin.dcnpgettext(domain, context, text);
}

/**
 * Retrieve the translation of the given text with gettext context..
 *
 * @param {string} singular The text to be used if the number is singular.
 * @param {string} plural The text to be used if the number is plural.
 * @param {number} number The number to compare against to use either the singular or plural form.
 * @param {string} [domain] Text domain. Unique identifier for retrieving translated strings.
 * @return {string} Translated text.
 */
export function _n(singular, plural, number, domain = TEXT_DOMAIN) {
  return tannin.dcnpgettext(domain, undefined, singular, plural, number);
}

/**
 * Retrieve the translation of the given text with gettext context..
 *
 * @param {string} singular The text to be used if the number is singular.
 * @param {string} plural The text to be used if the number is plural.
 * @param {number} number The number to compare against to use either the singular or plural form.
 * @param {string} context Context information for the translators.
 * @param {string} [domain] Text domain. Unique identifier for retrieving translated strings.
 * @return {string} Translated text.
 */
export function _nx(singular, plural, number, context, domain = TEXT_DOMAIN) {
  return tannin.dcnpgettext(domain, context, singular, plural, number);
}
