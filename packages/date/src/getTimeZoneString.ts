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
 * Transforms a given number into a valid UTC Offset in hours and possibly minutes.
 *
 * @param offset A UTC offset as a number in either hours or minutes
 * @return UTC offset as a string.
 */
function numberToUTCOffset(offset: number) {
  const sign = offset < 0 ? '-' : '+';
  const absoluteOffset = Math.abs(offset);
  const isHours = absoluteOffset <= 12;
  const offsetInMinutes = isHours
    ? Math.round((absoluteOffset % 1) * 60)
    : Math.round(absoluteOffset % 60);
  const offsetInHours = isHours
    ? Math.floor(absoluteOffset)
    : Math.floor(absoluteOffset / 60);

  const hoursAsString = String(offsetInHours).padStart(2, '0');
  const minutesAsString = String(offsetInMinutes).padStart(2, '0');

  return `${sign}${hoursAsString}:${minutesAsString}`;
}

/**
 * Returns a properly formatted timezone from a timezone string or offset.
 *
 * @return Timezone string.
 */
function getTimeZoneString() {
  const settings = getSettings();
  const { timezone, gmtOffset } = settings;

  if (timezone) {
    return timezone;
  }

  if (!Number.isNaN(Number(gmtOffset))) {
    return numberToUTCOffset(gmtOffset);
  }

  return '+00:00';
}

export default getTimeZoneString;
