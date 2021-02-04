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
 * Internal dependencies
 */
import { getSettings } from './settings';

/**
 * Transforms a given integer into a valid UTC Offset in hours.
 *
 * @param {number} offset A UTC offset as an integer
 * @return {string} UTC offset in hours.
 */
function integerToUTCOffset(offset) {
  const offsetInHours = offset > 23 ? offset / 60 : offset;
  const sign = offset < 0 ? '-' : '+';
  const absoluteOffset = Math.abs(offsetInHours);

  return offsetInHours < 10
    ? `${sign}0${absoluteOffset}`
    : `${sign}${absoluteOffset}`;
}

/**
 * Returns a properly formatted timezone from a timezone string or offset.
 *
 * @return {string} Timezone string.
 */
function getTimeZoneString() {
  const settings = getSettings();
  const { timezone, gmtOffset } = settings;

  if (timezone) {
    return timezone;
  }

  if (!Number.isNaN(Number(gmtOffset))) {
    return integerToUTCOffset(gmtOffset);
  }

  return '+00:00';
}

export default getTimeZoneString;
