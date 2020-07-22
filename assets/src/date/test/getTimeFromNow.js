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
import { DEFAULT_DATE_SETTINGS, getTimeFromNow } from '../';

describe('date/getTimeFromNow', () => {
  const MOCK_UTC_DATE = moment.utc('2020-07-12 11:30');

  beforeEach(() => {
    MockDate.set(MOCK_UTC_DATE);
  });

  it('should return 2 minutes ago using moment', () => {
    const dateString = moment().subtract(2, 'minutes');
    const formattedDate = getTimeFromNow(dateString, DEFAULT_DATE_SETTINGS);

    expect(formattedDate).toBe('2 minutes ago');
  });

  it('should return an hour ago using moment', () => {
    const dateString = moment().subtract(1, 'hours');
    const formattedDate = getTimeFromNow(dateString, DEFAULT_DATE_SETTINGS);

    expect(formattedDate).toBe('an hour ago');
  });

  it('should return 2 hours ago using moment', () => {
    const dateString = moment().subtract(2, 'hours');
    const formattedDate = getTimeFromNow(dateString, DEFAULT_DATE_SETTINGS);

    expect(formattedDate).toBe('2 hours ago');
  });

  it('should still return 2 hours ago using moment when timezone is set', () => {
    const dateString = moment().subtract(2, 'hours');
    const formattedDate = getTimeFromNow(dateString, {
      timezone: 'America/New_York',
    });

    expect(formattedDate).toBe('2 hours ago');
  });

  it('should return in 19 years', () => {
    const dateString = moment('2039-07-12 11:30');
    const formattedDate = getTimeFromNow(dateString, DEFAULT_DATE_SETTINGS);

    expect(formattedDate).toBe('in 19 years');
  });
});
