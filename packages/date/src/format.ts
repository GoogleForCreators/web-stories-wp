/*
 * Copyright 2020 Google LLC
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
import { format as _format, toDate } from 'date-fns-tz';

/**
 * Internal dependencies
 */
import convertFormatString, {
  FORMAT_TOKEN_SEPARATOR_REGEX,
} from './convertFormatString';
import getOptions from './getOptions';

/**
 * Formats a date by a given format.
 *
 * @param date Date to format.
 * @param formatString PHP-style date format.
 * @return Formatted date.
 */
function format(date: Date | string, formatString: string) {
  if (!date) {
    return '';
  }

  const parsedDate = toDate(date);
  const options = getOptions();
  const convertedFormat = convertFormatString(formatString, parsedDate);

  return _format(parsedDate, convertedFormat, options).replace(
    FORMAT_TOKEN_SEPARATOR_REGEX,
    ''
  );
}

export default format;
