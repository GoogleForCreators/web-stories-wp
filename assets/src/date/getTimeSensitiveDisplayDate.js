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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { format } from '@wordpress/date';

/**
 * External dependencies
 */
import moment from 'moment-timezone';

/**
 * Internal dependencies
 */
import {
  DEFAULT_DATE_FORMATTING,
  getDateFormattedFromWordPressToMoment,
  getTimeFromNow,
  isToday,
  isYesterday,
} from './';

// Returns hours since date if date passed in matches today
// Returns yesterday if date passed in is yesterday
// Returns formatted date + time by default
export function getTimeSensitiveDisplayDate(
  date,
  dateFormatting = DEFAULT_DATE_FORMATTING
) {
  if (!date) {
    return '';
  }
  // Here we need to make sure we use parseZone to honor existing timezone data
  // https://momentjs.com/guides/#/parsing/
  const displayDate = moment.isMoment(date) ? date : moment.parseZone(date);

  if (isToday(displayDate)) {
    return getTimeFromNow(displayDate, dateFormatting);
  } else if (isYesterday(displayDate)) {
    return __('yesterday', 'web-stories');
  }

  return (
    getDateFormattedFromWordPressToMoment(date, dateFormatting.dateFormat) ||
    format(dateFormatting?.dateFormat, date)
  );
}
