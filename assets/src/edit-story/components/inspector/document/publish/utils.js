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
import moment from 'moment';

export function getReadableDate(date, is12Hours = true) {
  const displayDate = date ? moment(date) : moment();
  if (is12Hours) {
    return `${displayDate.format('MM')}/${displayDate.format(
      'DD'
    )}/${displayDate.format('YYYY')}`;
  }
  return `${displayDate.format('DD')}/${displayDate.format(
    'MM'
  )}/${displayDate.format('YYYY')}`;
}

export function getReadableTime(date, is12Hours = true) {
  const displayTime = date ? moment(date) : moment();
  const hourFormat = is12Hours ? 'hh' : 'HH';
  const am = is12Hours ? displayTime.format('A') : '';
  return `${displayTime.format(hourFormat)}:${displayTime.format('mm')}${am}`;
}

export function is12Hour(timeFormat) {
  if (!timeFormat) {
    return true;
  }
  return /a(?!\\)/.test(
    timeFormat
      .toLowerCase() // Test only for the lower case "a".
      .replace(/\\\\/g, '') // Replace "//" with empty strings.
      .split('')
      .reverse()
      .join('') // Reverse the string and test for "a" not followed by a slash.
  );
}
