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
import type { TanninLocaleDomain } from 'tannin';

export interface LocaleData {
  locale_data: {
    [key: string]: TanninLocaleDomain;
  };
}

const TEXT_DOMAIN = 'web-stories';

const tannin = new Tannin({
  [TEXT_DOMAIN]: {
    '': {
      plural_forms(n: number) {
        return n === 1 ? 0 : 1;
      },
    },
  },
});

/**
 * Merge locale data into the Tannin instance.
 *
 * @param data Locale data.
 */
export function setLocaleData(data: LocaleData) {
  const translations =
    data.locale_data['web-stories'] || data.locale_data.messages;

  tannin.data[TEXT_DOMAIN] = {
    ...tannin.data[TEXT_DOMAIN],
    ...translations,
    '': {
      ...tannin.data[TEXT_DOMAIN][''],
    },
  };
}

/**
 * Retrieve the translation of the given text.
 *
 * @param text Text to translate.
 * @param [domain] Text domain. Unique identifier for retrieving translated strings.
 * @return Translated text.
 */
export function __(text: string, domain = TEXT_DOMAIN) {
  return tannin.dcnpgettext(domain, undefined, text);
}

/**
 * Retrieve the translation of the given text with gettext context..
 *
 * @param text Text to translate.
 * @param context Context information for the translators.
 * @param [domain] Text domain. Unique identifier for retrieving translated strings.
 * @return Translated text.
 */
export function _x(text: string, context: string, domain = TEXT_DOMAIN) {
  return tannin.dcnpgettext(domain, context, text);
}

/**
 * Retrieve the translation of the given text with gettext context..
 *
 * @param singular The text to be used if the number is singular.
 * @param plural The text to be used if the number is plural.
 * @param number The number to compare against to use either the singular or plural form.
 * @param [domain] Text domain. Unique identifier for retrieving translated strings.
 * @return Translated text.
 */
export function _n(
  singular: string,
  plural: string,
  number: number,
  domain = TEXT_DOMAIN
) {
  return tannin.dcnpgettext(domain, undefined, singular, plural, number);
}

/**
 * Retrieve the translation of the given text with gettext context..
 *
 * @param singular The text to be used if the number is singular.
 * @param plural The text to be used if the number is plural.
 * @param number The number to compare against to use either the singular or plural form.
 * @param context Context information for the translators.
 * @param [domain] Text domain. Unique identifier for retrieving translated strings.
 * @return Translated text.
 */
export function _nx(
  singular: string,
  plural: string,
  number: number,
  context: string,
  domain = TEXT_DOMAIN
) {
  return tannin.dcnpgettext(domain, context, singular, plural, number);
}
