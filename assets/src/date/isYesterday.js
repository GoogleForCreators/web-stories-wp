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
 * Internal dependencies
 */
import { getMoment } from './getMoment';

/**
 * Checks if date is yesterday
 *
 * @param {Date} date Uses moment to find if date passed in is the same as "yesterday".
 * If date is not an instance of moment when passed in it will create a moment from it.
 *
 * @return {boolean} If date matches yesterday it will be true
 */
export function isYesterday(date) {
  const displayDate = getMoment(date);
  const yesterday = moment.utc().subtract(1, 'days').startOf('day');

  return displayDate.isSame(yesterday, 'd');
}
