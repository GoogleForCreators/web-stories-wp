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
import { formatDistanceToNow, isToday, isYesterday } from 'date-fns';

import { toDate } from 'date-fns-tz';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import getOptions from './getOptions';
import { formatDate } from '.';

/**
 * Formats a date to display relative to time passed since date.
 *
 * If date to display is < 1 day ago it will display rounded time since date using timezone.
 * If date to display matches yesterday's date it will display "yesterday".
 * Otherwise date will come back formatted by dateSettings.dateFormat (no time).
 *
 * @param {Date|string} date Date to format according to how much time or how many days have passed since date.
 *
 * @return {string} Displayable relative date string
 */
function getRelativeDisplayDate(date) {
  if (!date) {
    return '';
  }

  const displayDate = toDate(date);

  if (isToday(displayDate)) {
    const { locale } = getOptions();
    return formatDistanceToNow(displayDate, {
      includeSeconds: false,
      addSuffix: true,
      locale,
    });
  } else if (isYesterday(displayDate)) {
    return __('yesterday', 'web-stories');
  }

  return formatDate(date);
}

export default getRelativeDisplayDate;
