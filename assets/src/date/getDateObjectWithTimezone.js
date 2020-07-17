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
import moment from 'moment-timezone';

/**
 * @description Get a date object of the time right now in any timezone
 * Regardless of timezone or offset we want to have the same starting point of time.
 * We need to specify moment to be created in UTC rather than browser timezone.
 * Any moment created with moment.utc() will be in UTC mode, and any moment created with moment() will not.
 * @param {Object} dateFormatting Object responsible for relevant timezone manipulation based off an UTC date in Moment.
 * Here we are looking for 1) dateFormatting.timezone, if no timezone 2) check for gmtOffset, if no gmtOffset use UTC
 * @return {Date} Date object formatted to timezone specified in param, UTC by default
 */
export function getDateObjectWithTimezone(dateFormatting = {}) {
  const { timezone, gmtOffset } = dateFormatting;
  const date = moment.utc();

  if (timezone) {
    return date.tz(timezone).format();
  }

  if (gmtOffset) {
    return date.utcOffset(gmtOffset).format();
  }

  return date.format();
}
