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
import moment from 'moment-timezone';

/**
 * Internal dependencies
 */
import { getDateObjectWithTimezone } from './getDateObjectWithTimezone';

/**
 * Get the time passed from or time until a date to the time now in any timezone.
 *
 * @param {Date} date Uses moment to find time passed since/until.
 * If date is not an instance of moment when passed in it will create a moment from it.
 *
 * @param {import('./').DateSettings} dateSettings - An object that has keys to set date timezone, offset, and display {@link DateSettings}
 *
 * @return {string} Displayable relative date string
 */
export function getTimeFromNow(date, dateSettings) {
  const displayDate = moment.isMoment(date) ? date : moment.parseZone(date);

<<<<<<< HEAD
  return displayDate.from(getDateObjectWithTimezone(dateSettings));
=======
export function getTimeFromNow(displayDate, dateFormatting) {
  return displayDate.from(getDateObjectWithTimezone(dateFormatting));
>>>>>>> use parseZone on moment to honor existing gmt offset of date that is getting mapped to a moment format. By doing this combined with getting the time from now with just the .from api on moment and our custom timezone specific date for now we can get consistency in when stories are published or modified. If I publish a story at 11am in chicago it should be published at 9am in LA, so it should still have the same message of published 2 minutes ago regardless of where you are at.
}
