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
import MockDate from 'mockdate';

/**
 * Internal dependencies
 */
import format from '../format';
import { resetSettings, updateSettings } from '../settings';

describe('date/format', () => {
  beforeEach(() => {
    MockDate.set('2020-07-15T22:47:26+00:00');
  });

  afterEach(() => {
    MockDate.reset();
    resetSettings();
  });

  it('should support "S" to obtain ordinal suffix of day of the month', () => {
    const formattedDate = format('2019-06-18T11:00:00.000', 'S');

    // th for 18th
    expect(formattedDate).toBe('th');
  });

  it('should support "z" to obtain zero-indexed day of the year', () => {
    const formattedDate = format('2019-01-01', 'z');

    expect(formattedDate).toBe('0');
  });

  it('should support "t" to obtain the days in a given month', () => {
    const formattedDate = format('2019-02', 't');

    expect(formattedDate).toBe('28');
  });

  it('should support "L" to obtain whether or not the year is a leap year', () => {
    const formattedDate = format('2020', 'L');

    expect(formattedDate).toBe('1');
  });

  // TODO: Fix implementation/tests.
  //eslint-disable-next-line jest/no-disabled-tests
  it.skip('should support "B" to obtain the time in Swatch Internet Time (.beats)', () => {
    const formattedDate = format('2020-10-09T11:00:00.000', 'B');

    expect(formattedDate).toBe('500');
  });

  it('should support "T" to obtain the timezone abbreviation for the given date', () => {
    updateSettings({
      gmtOffset: -4,
      timezone: 'America/New_York',
    });

    const formattedDate = format('2020-01-01T11:00:00.000', 'T');

    expect(formattedDate).toBe('EST');
  });

  it('should support "e" to obtain timezone identifier', () => {
    updateSettings({
      gmtOffset: -4,
      timezone: 'America/New_York',
    });

    const formattedDate = format('2020-10-09T11:00:00.000', 'e');

    expect(formattedDate).toBe('Eastern Daylight Time');
  });

  it('should support "w" to obtain day of the week starting from 0', () => {
    const formattedDate = format('2020-01-01T12:00:00.000', 'w'); // Wednesday Jan 1st, 2020

    expect(formattedDate).toBe('2');
  });

  // TODO: Fix implementation/tests.
  //eslint-disable-next-line jest/no-disabled-tests
  it.skip('should support "U" to get epoc for given date', () => {
    const formattedDate = format('2020-10-09T02:00:00.000', 'U');

    expect(formattedDate).toBe('1602201600');
  });

  it('should support "c" to obtain the full date', () => {
    const formattedDate = format('2020-10-09T11:00:00.000', 'c');

    expect(formattedDate).toBe('2020-10-09T11:00:00+00:00');
  });

  it('should support "r" to obtain RFC2822 formatted date', () => {
    const formattedDate = format('2020-10-09T11:00:00.000', 'r');

    expect(formattedDate).toBe('Fri, 09 Oct 2020 11:00:00 +0000');
  });

  it('should support "M" to obtain short textual representation of a month, three letters', () => {
    const formattedDate = format('2020-10-09T11:00:00.000', 'MM');

    expect(formattedDate).toBe('OctOct');
  });

  // Disable reason: Not implemented yet.
  //eslint-disable-next-line jest/no-disabled-tests
  it.skip('should support "I" to obtain whether or not the timezone is observing DST', () => {
    const formattedFall = format('2020-10-09T11:00:00.000', 'I');

    expect(formattedFall).toBe('1');

    const formattedWinter = format('2020-01-09T11:00:00.000', 'I');

    expect(formattedWinter).toBe('0');
  });

  it('should support "Z" to obtain timezone offset in seconds', () => {
    const formattedDate = format('2020-10-09T11:00:00.000', 'Z');

    expect(formattedDate).toBe('0');
  });

  it('should support "G \\h i \\m\\i\\n" date format', () => {
    const formattedDate = format(
      '2019-06-18T11:22:00.000',
      'G \\h i \\m\\i\\n'
    );

    // th for 18th
    expect(formattedDate).toBe('11 h 22 min');
  });
});
