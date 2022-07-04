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
 * Internal dependencies
 */
import sprintf from './sprintf';
import { __ } from './i18n';

/**
 * Join all options in a list and translate. These will be joined with
 * the conjunction `and`.
 *
 * @param {Array.<string>} options The options that will be joined with the `and` conjunction.
 * @return {string} Localized list items.
 */
function translateToInclusiveList(options) {
  switch (options.length) {
    case 0:
      return '';
    case 1:
      return options[0];
    case 2:
      return sprintf(
        /* translators: %1$s: first item of list. %2$s: second item of list. */
        __('%1$s and %2$s', 'web-stories'),
        options[0],
        options[1]
      );
    default:
      return sprintf(
        /* translators: %1$s: is a comma separated list. %2$s: last entry in list  */
        __('%1$s, and %2$s', 'web-stories'),
        options.slice(0, options.length - 1).join(
          /* translators: delimiter used in a list */
          __(', ', 'web-stories') // eslint-disable-line @wordpress/i18n-no-flanking-whitespace -- Expected behaviour.
        ),
        options[options.length - 1]
      );
  }
}

export default translateToInclusiveList;
