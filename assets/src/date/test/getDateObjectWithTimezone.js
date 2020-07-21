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
const daylightSavingsTimezones = {
  'Africa/Algiers': 1,
  'America/Anchorage': -8,
  'America/Los_Angeles': -7,
  'America/New_York': -4,
  'America/Tijuana': -7,
  'America/Sao_Paulo': -3,
  'Asia/Dubai': 4,
  'Asia/Hong_Kong': 8,
  'Australia/Brisbane': 10,
  'Europe/Amsterdam': 2,
  'Europe/London': 1,
  'Europe/Moscow': 3,
};

const standardTimezones = {
  'Africa/Algiers': 1,
  'America/Anchorage': -9,
  'America/Los_Angeles': -8,
  'America/New_York': -5,
  'America/Tijuana': -8,
  'America/Sao_Paulo': -3,
  'Asia/Dubai': 4,
  'Asia/Hong_Kong': 8,
  'Australia/Brisbane': 10,
  'Europe/Amsterdam': 1,
  'Europe/London': 0,
  'Europe/Moscow': 3,
};

describe('date/getDateObjectWithTimezone - daylight savings', () => {
  const MOCK_UTC_DATE = moment.utc('2020-07-12 11:30');

  beforeEach(() => {
    MockDate.set(MOCK_UTC_DATE);
  });
  const getUtcOffset = (offset) => {
    return MOCK_UTC_DATE.utcOffset(offset).format();
  };

  it('should return UTC by default which is default moment', () => {
    expect(getDateObjectWithTimezone()).toBe('2020-07-12T11:30:00Z');
  });

  Object.keys(daylightSavingsTimezones).forEach((timezone) => {
    const resultingUtcOffset = getUtcOffset(daylightSavingsTimezones[timezone]);

    it(`should return ${resultingUtcOffset} when timezone is set to ${timezone}`, () => {
      const date = getDateObjectWithTimezone({
        timezone,
      });

      expect(date).toBe(resultingUtcOffset);
    });

    it(`should return ${resultingUtcOffset} when timezone is not available and gmtOffset of ${daylightSavingsTimezones[timezone]} is used instead`, () => {
      const date = getDateObjectWithTimezone({
        gmtOffset: daylightSavingsTimezones[timezone],
      });

      expect(date).toBe(resultingUtcOffset);
    });
  });
});

describe('date/getDateObjectWithTimezone - standard', () => {
  const MOCK_UTC_DATE = moment.utc('2020-11-12 11:30');

  beforeEach(() => {
    MockDate.set(MOCK_UTC_DATE);
  });

  const getUtcOffset = (offset) => {
    return MOCK_UTC_DATE.utcOffset(offset).format();
  };

  it('should return UTC by default which is 2020-11-12T11:30:00Z', () => {
    const date = getDateObjectWithTimezone({});
    expect(date).toBe('2020-11-12T11:30:00Z');
  });

  Object.keys(standardTimezones).forEach((timezone) => {
    const resultingUtcOffset = getUtcOffset(standardTimezones[timezone]);

    it(`should return ${resultingUtcOffset} when timezone is set to ${timezone}`, () => {
      const date = getDateObjectWithTimezone({
        gmtOffset: null,
        timezone,
      });

      expect(date).toBe(resultingUtcOffset);
    });

    it(`should return ${resultingUtcOffset} when timezone is null and gmtOffset of ${standardTimezones[timezone]} is used instead`, () => {
      const date = getDateObjectWithTimezone({
        gmtOffset: standardTimezones[timezone],
      });

      expect(date).toBe(resultingUtcOffset);
    });
  });
});
