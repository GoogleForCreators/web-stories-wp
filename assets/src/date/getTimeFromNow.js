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

/** @typedef {import('moment').Moment} Moment */

/**
 * Internal dependencies
 */
import { getDateObjectWithTimezone } from './getDateObjectWithTimezone';
import { getMoment } from './getMoment';

/**
 * Get the time passed from or time until a date to the time now in any timezone.
 *
 * @param {Date|Moment|string} date Date to parse.
 *
 * @param {import('./').DateSettings} dateSettings - An object that has keys to set date timezone, offset, and display {@link DateSettings}
 *
 * @return {string} Displayable relative date string
 */
export function getTimeFromNow(date, dateSettings) {
  const displayDate = getMoment(date);
  return displayDate.from(getDateObjectWithTimezone(dateSettings));
}
