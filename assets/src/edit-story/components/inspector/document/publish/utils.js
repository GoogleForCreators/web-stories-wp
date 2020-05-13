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
 * Adds 0 in front of the number if it's less than 10.
 *
 * @param {number} number Number to check.
 * @return {string} Converted number.
 */
function ensureDoubleDigitNumber(number) {
  // This could also be done via 0 + value and slicing, however, comparison is faster.
  return number < 10 ? '0' + number : String(number);
}

export function getReadableDate(date, is12Hours = true) {
  const displayDate = date ? new Date(date) : new Date();
  const day = ensureDoubleDigitNumber(displayDate.getDate());
  const month = ensureDoubleDigitNumber(displayDate.getMonth() + 1);
  if (is12Hours) {
    return `${month}/${day}/${displayDate.getFullYear()}`;
  }
  return `${day}/${month}/${displayDate.getFullYear()}`;
}

export function getReadableTime(date, is12Hours = true) {
  const displayTime = date ? new Date(date) : new Date();
  const hours = is12Hours
    ? displayTime.getHours() % 12 || 12
    : displayTime.getHours();
  const minutes = ensureDoubleDigitNumber(displayTime.getMinutes());
  const am = displayTime.getHours() < 12 ? 'AM' : 'PM';
  const displayedAm = is12Hours ? am : '';
  return `${ensureDoubleDigitNumber(hours)}:${minutes}${displayedAm}`;
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
