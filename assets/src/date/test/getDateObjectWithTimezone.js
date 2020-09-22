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
import { getDateObjectWithTimezone } from '../';

// https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
const daylightSavingsTimezones = [
  ['Africa/Algiers', 1, '2020-07-12T12:30:00+01:00'],
  ['America/Anchorage', -8, '2020-07-12T03:30:00-08:00'],
  ['America/Los_Angeles', -7, '2020-07-12T04:30:00-07:00'],
  ['America/New_York', -4, '2020-07-12T07:30:00-04:00'],
  ['America/Tijuana', -7, '2020-07-12T04:30:00-07:00'],
  ['America/Sao_Paulo', -3, '2020-07-12T08:30:00-03:00'],
  ['Asia/Dubai', 4, '2020-07-12T15:30:00+04:00'],
  ['Asia/Hong_Kong', 8, '2020-07-12T19:30:00+08:00'],
  ['Australia/Brisbane', 10, '2020-07-12T21:30:00+10:00'],
  ['Europe/Amsterdam', 2, '2020-07-12T13:30:00+02:00'],
  ['Europe/London', 1, '2020-07-12T12:30:00+01:00'],
  ['Europe/Moscow', 3, '2020-07-12T14:30:00+03:00'],
];

const standardTimezones = [
  ['Africa/Algiers', 1, '2020-11-12T12:30:00+01:00'],
  ['America/Anchorage', -9, '2020-11-12T02:30:00-09:00'],
  ['America/Los_Angeles', -8, '2020-11-12T03:30:00-08:00'],
  ['America/New_York', -5, '2020-11-12T06:30:00-05:00'],
  ['America/Tijuana', -8, '2020-11-12T03:30:00-08:00'],
  ['America/Sao_Paulo', -3, '2020-11-12T08:30:00-03:00'],
  ['Asia/Dubai', 4, '2020-11-12T15:30:00+04:00'],
  ['Asia/Hong_Kong', 8, '2020-11-12T19:30:00+08:00'],
  ['Australia/Brisbane', 10, '2020-11-12T21:30:00+10:00'],
  ['Europe/Amsterdam', 1, '2020-11-12T12:30:00+01:00'],
  ['Europe/London', 0, '2020-11-12T11:30:00Z'],
  ['Europe/Moscow', 3, '2020-11-12T14:30:00+03:00'],
];

describe('date/getDateObjectWithTimezone - daylight savings', () => {
  const MOCK_UTC_DATE = moment.utc('2020-07-12 11:30');

  beforeEach(() => {
    MockDate.set(MOCK_UTC_DATE);
  });

  it('should return UTC by default which is default moment', () => {
    expect(getDateObjectWithTimezone()).toBe('2020-07-12T11:30:00Z');
  });

  it.each(daylightSavingsTimezones)(
    'when timezone is %s or offset is %d it should return %s',
    (timezone, offset, expected) => {
      const dateWithTimezone = getDateObjectWithTimezone({
        timezone,
      });
      expect(dateWithTimezone).toBe(expected);

      const dateWithOffset = getDateObjectWithTimezone({
        gmtOffset: offset,
      });
      expect(dateWithOffset).toBe(expected);
    }
  );
});

describe('date/getDateObjectWithTimezone - standard', () => {
  const MOCK_UTC_DATE = moment.utc('2020-11-12 11:30');

  beforeEach(() => {
    MockDate.set(MOCK_UTC_DATE);
  });

  it('should return UTC by default which is 2020-11-12T11:30:00Z', () => {
    const date = getDateObjectWithTimezone({});
    expect(date).toBe('2020-11-12T11:30:00Z');
  });

  it.each(standardTimezones)(
    'when timezone is %s or offset is %d it should return %s',
    (timezone, offset, expected) => {
      const dateWithTimezone = getDateObjectWithTimezone({
        timezone,
      });
      expect(dateWithTimezone).toBe(expected);

      const dateWithOffset = getDateObjectWithTimezone({
        gmtOffset: offset,
      });
      expect(dateWithOffset).toBe(expected);
    }
  );
});
