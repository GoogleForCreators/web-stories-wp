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
import { getDaysInMonth, isLeapYear, format } from 'date-fns';
import { format as formatWithTZ, zonedTimeToUtc, toDate } from 'date-fns-tz';
/**
 * Internal dependencies
 */
import getOptions from './getOptions';

const MINUTE_IN_SECONDS = 60;
const HOUR_IN_MINUTES = 60;
const HOUR_IN_SECONDS = HOUR_IN_MINUTES * MINUTE_IN_SECONDS;

const FORMAT_TOKEN_SEPARATOR = '\u2006';
export const FORMAT_TOKEN_SEPARATOR_REGEX = new RegExp(
  FORMAT_TOKEN_SEPARATOR,
  'gi'
);

/**
 * Map of PHP formats to date-fns formats.
 *
 * @see https://www.php.net/manual/en/datetime.format.php
 * @see https://date-fns.org/v2.16.1/docs/format
 *
 * @type {Object}
 */
const formatMap = {
  // Day of the month, 2 digits with leading zeros. 01 to 31.
  d: 'dd',

  // A textual representation of a day, three letters. Mon through Sun.
  D: 'EEE',

  // Day of the month without leading zeros.	1 to 31.
  j: 'd',

  // A full textual representation of the day of the week.	Sunday through Saturday
  l: 'EEEE',

  // ISO-8601 numeric representation of the day of the week. 1 (for Monday) through 7 (for Sunday)
  N: 'i',

  // English ordinal suffix for the day of the month, 2 characters. st, nd, rd or th.
  S(date) {
    // Removes the "1" from "1st" to get only "st".
    return format(date, 'do').replace(format(date, 'd'), '');
  },

  // Numeric representation of the day of the week. 0 (for Sunday) through 6 (for Saturday)
  w(date) {
    return Number(format(date, 'i')) - 1;
  },

  // The day of the year (starting from 0). 0 through 365.
  z(date) {
    return Number(format(date, 'DDD')) - 1;
  },

  // ISO-8601 week number of year, weeks starting on Monday. Example: 42 (the 42nd week in the year).
  W: 'I',

  // A full textual representation of a month, such as January or March.
  F: 'MMMM',

  // Numeric representation of a month, with leading zeros. 01 through 12.
  m: 'MM',

  // A short textual representation of a month, three letters. Jan through Dec.
  M: 'MMM',

  // Numeric representation of a month, without leading zeros. 1 through 12.
  n: 'M',

  // Number of days in the given month. 28 through 31
  t(date) {
    return getDaysInMonth(date);
  },

  // Whether it's a leap year. 1 if it is a leap year, 0 otherwise.
  L(date) {
    return Number(isLeapYear(date));
  },

  // ISO-8601 week-numbering year.
  // This has the same value as Y, except that if the ISO week number (W) belongs to the previous or next year, that year is used instead.
  // Examples: 1999 or 2003
  o: 'RRRR',

  // A full numeric representation of a year, 4 digits. Examples: 1999 or 2003
  Y: 'yyyy',

  //  A two digit representation of a year. Examples: 99 or 03
  y: 'yy',

  // Lowercase Ante meridiem and Post meridiem. am or pm.
  a: 'aaaa',

  // Uppercase Ante meridiem and Post meridiem. AM or PM
  A: 'aaa',

  //  Swatch Internet time. 000 through 999.
  B(date) {
    // Biel Mean Time (BMT) is UTC+1.
    const timezoned = zonedTimeToUtc(date, '+0100');
    const seconds = format(timezoned, 's');
    const minutes = format(timezoned, 'm');
    const hours = format(timezoned, 'H');

    // Round results like PHP also does.
    return Math.round(
      (seconds + minutes * MINUTE_IN_SECONDS + hours * HOUR_IN_SECONDS) / 86.4
    );
  },

  // 12-hour format of an hour without leading zeros. 1 through 12.
  g: 'h',

  // 24-hour format of an hour without leading zeros. 0 through 23
  G: 'H',

  // 12-hour format of an hour with leading zeros. 01 through 12.
  h: 'hh',

  // 24-hour format of an hour with leading zeros. 00 through 23.
  H: 'HH',

  // Minutes with leading zeros. 00 to 59.
  i: 'mm',

  // Seconds with leading zeros. 00 through 59.
  s: 'ss',

  // Microseconds. Example: 654321.
  u: 'SSSSSS',

  // Milliseconds. Example: 654.
  v: 'SSS',

  // Timezone identifier. Examples: UTC, GMT, Atlantic/Azores.
  e: 'zzzz',

  // Whether or not the date is in daylight saving time.	1 if Daylight Saving Time, 0 otherwise.
  //eslint-disable-next-line no-unused-vars
  I(date) {
    // TODO: Not implemented yet.
    return 0;
  },

  // Difference to Greenwich time (GMT) without colon between hours and minutes. Example: +0200
  O: 'xx',

  // Difference to Greenwich time (GMT) with colon between hours and minutes. Example: +02:00
  P: 'xxx',

  // Timezone abbreviation. Examples: EST, MDT.
  T: 'zzz',

  // Timezone offset in seconds. -43200 through 50400.
  Z(date) {
    const offset = formatWithTZ(
      toDate(date, getOptions()),
      'XXX',
      getOptions()
    );

    if ('Z' === offset) {
      return 0;
    }

    const sign = offset[0] === '-' ? -1 : 1;
    const parts = offset.substring(1).split(':').map(Number);
    return sign * (parts[0] * HOUR_IN_MINUTES + parts[1]) * MINUTE_IN_SECONDS;
  },

  // ISO 8601 date. Example: 2004-02-12T15:19:21+00:00
  c(date) {
    return formatWithTZ(
      toDate(date, getOptions()),
      "yyyy-MM-dd'T'HH:mm:ssxxx",
      getOptions()
    );
  },

  // RFC 2822 formatted date.
  r(date) {
    return formatWithTZ(
      toDate(date, getOptions()),
      'EEE, dd MMM yyyy HH:mm:ss xx',
      getOptions()
    );
  },

  // Seconds since the Unix Epoch (January 1 1970 00:00:00 GMT).
  U: 't',
};

/**
 * Formats a date. Does not alter the date's timezone.
 *
 * @see https://www.php.net/manual/en/datetime.format.php
 *
 * @param {string} dateFormat PHP-style formatting string.
 * @param {Date} date Date object.
 *
 * @return {string} Formatted date.
 */
function convertFormatString(dateFormat, date) {
  let i;
  let char;
  const newFormat = [];

  for (i = 0; i < dateFormat.length; i++) {
    char = dateFormat[i];

    // Is this an escape?
    if ('\\' === char) {
      // Add next character, then move on.
      i++;
      newFormat.push(`'${dateFormat[i]}'`);
      continue;
    }

    if (char in formatMap) {
      if (typeof formatMap[char] !== 'string') {
        // If the format is a function, call it.
        newFormat.push(`'${formatMap[char](date)}'`);
      } else {
        // Otherwise, add as a formatting string.
        newFormat.push(formatMap[char]);
      }
    } else {
      newFormat.push(char);
    }
  }

  // Join with an arbitrary unicode character in order to create space between format tokens,
  // as PHP doesn't use repeating tokens to indicate a different format, and instead the results
  // of each call of the token should be concatenated with the previous.
  return newFormat.join(FORMAT_TOKEN_SEPARATOR);
}

export default convertFormatString;
