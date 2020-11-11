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
import originalLocale from 'date-fns/locale/en-US/index';
import buildLocalizeFn from 'date-fns/locale/_lib/buildLocalizeFn';

/** @typedef {import('date-fns-tz').OptionsWithTZ} OptionsWithTZ */
/** @typedef {import('date-fns-tz').Locale} Locale */

/**
 * Internal dependencies
 */
import { getSettings } from './settings';
import formatDistance from './formatDistance';
import getTimeZoneString from './getTimeZoneString';

/**
 * Returns date-fns option.
 *
 * Takes locale settings from the host platform (e.g. WordPress)
 * and builds a special locale object for use with date-fns.
 *
 * If no locale settings are specified, some English strings
 * taken from date-fns's default en-US locale will be used.
 *
 * @return {OptionsWithTZ} Date options.
 */
function getOptions() {
  const settings = getSettings();
  const {
    locale: localeCode,
    weekStartsOn,
    months,
    monthsShort,
    weekdays,
    weekdaysShort,
    weekdaysInitials,
  } = settings;

  const monthValues = {
    narrow: monthsShort || [
      'J',
      'F',
      'M',
      'A',
      'M',
      'J',
      'J',
      'A',
      'S',
      'O',
      'N',
      'D',
    ],
    abbreviated: monthsShort || [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    wide: months || [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
  };

  const dayValues = {
    narrow: weekdaysInitials || ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    short: weekdaysShort || ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    abbreviated: weekdaysShort || [
      'Sun',
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat',
    ],
    wide: weekdays || [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ],
  };

  const localize = {
    ...originalLocale.localize,

    month: buildLocalizeFn({
      values: monthValues,
      defaultWidth: 'wide',
    }),

    day: buildLocalizeFn({
      values: dayValues,
      defaultWidth: 'wide',
    }),
  };

  /**
   * @type {Locale}
   */
  const locale = {
    ...originalLocale,
    code: localeCode || originalLocale.code,
    formatDistance: formatDistance,
    localize: localize,
    options: {
      weekStartsOn: weekStartsOn,
    },
  };

  return {
    weekStartsOn,
    timeZone: getTimeZoneString(),
    locale,
  };
}

export default getOptions;
