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

/**
 * External dependencies
 */
import moment from 'moment-timezone';
import DateFormatter from 'php-date-formatter';

/**
 * Internal dependencies
 */
import {
  DEFAULT_DATE_FORMATTING,
  getTimeFromNow,
  isToday,
  isYesterday,
} from '.';

/**
 * Formats a date to display relative to time passed since date using moment's parseZone function to keep fixed timezone.
 *
 * If date to display is < 1 day ago it will display rounded time since date using timezone.
 * If date to display matches yesterday's date it will display "yesterday".
 * Otherwise date will come back formatted by dateFormatting.dateFormat (no time).
 *
 * @see {@link https://momentjs.com/guides/#/parsing/}
 *
 * @param {Date} date Date to format according to how much time or how many days have passed since date
 * If date is not an instance of moment when passed in it will create a moment from it.
 * @param {Object} dateFormatting Object responsible for relevant date formatting.
 * Should contain dateFormat, timezone, gmtOffset, and timeFormat - all strings.
 * @return {string} Displayable relative date string
 */
export function getRelativeDisplayDate(
  date,
  dateFormatting = DEFAULT_DATE_FORMATTING
) {
  if (!date) {
    return '';
  }

  const displayDate = moment.isMoment(date) ? date : moment.parseZone(date);

  if (isToday(displayDate)) {
    return getTimeFromNow(displayDate, dateFormatting);
  } else if (isYesterday(displayDate)) {
    return __('yesterday', 'web-stories');
  }

  const fmt = new DateFormatter();

  return fmt.formatDate(date.toDate(), dateFormatting.dateFormat);
}
