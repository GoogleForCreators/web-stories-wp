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
import MockDate from 'mockdate';

/**
 * Internal dependencies
 */
import { isToday } from '../';

describe('date/isToday', () => {
  beforeEach(() => {
    MockDate.set(moment.parseZone('2020-06-15T22:47:26'));
  });

  it('should return false that yesterday is today', () => {
    const dateString = moment.utc().subtract(1, 'days');
    const formattedDate = isToday(dateString);

    expect(formattedDate).toBe(false);
  });

  it('should return true that 6am of today is today', () => {
    const dateString = moment.utc().hours(6);
    const formattedDate = isToday(dateString);

    expect(formattedDate).toBe(true);
  });

  it('should return true that 11pm of "today" is today', () => {
    const dateString = moment.utc().hours(23);
    const formattedDate = isToday(dateString);

    expect(formattedDate).toBe(true);
  });
});
