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
import { subMinutes, subHours, subDays } from 'date-fns';
import { toDate } from 'date-fns-tz';

/**
 * Internal dependencies
 */
import getRelativeDisplayDate from '../getRelativeDisplayDate';
import { updateSettings, resetSettings } from '../settings';
import getOptions from '../getOptions';

/**
 * Returns the current date in the site's timezone.
 *
 * @return Date object.
 */
function getCurrentDate() {
  return toDate(new Date(), getOptions());
}

describe('date/getRelativeDisplayDate', () => {
  beforeEach(() => {
    MockDate.set('2020-07-15T12:00:00.000');
  });

  afterEach(() => {
    MockDate.reset();
    resetSettings();
  });

  it('should return 2 minutes ago in America/New_York', () => {
    updateSettings({
      dateFormat: 'F j, Y',
      gmtOffset: -4,
      timeFormat: 'g:i A',
      timezone: 'America/New_York',
    });
    const date = subMinutes(getCurrentDate(), 2);
    const formattedDate = getRelativeDisplayDate(date);

    expect(formattedDate).toBe('2 minutes ago');
  });

  it('should return 2 minutes ago in America/Los_Angeles', () => {
    updateSettings({
      dateFormat: 'F j, Y',
      gmtOffset: -7,
      timeFormat: 'g:i A',
      timezone: 'America/Los_Angeles',
    });

    const date = subMinutes(getCurrentDate(), 2);
    const formattedDate = getRelativeDisplayDate(date);

    expect(formattedDate).toBe('2 minutes ago');
  });

  it('should return an hour ago', () => {
    updateSettings({
      dateFormat: 'F j, Y',
      gmtOffset: -7,
      timeFormat: 'g:i A',
      timezone: 'America/Los_Angeles',
    });

    const date = subHours(getCurrentDate(), 1);
    const formattedDate = getRelativeDisplayDate(date);

    expect(formattedDate).toBe('an hour ago');
  });

  it('should return 2 hours ago', () => {
    updateSettings({
      dateFormat: 'F j, Y',
      gmtOffset: -7,
      timeFormat: 'g:i A',
      timezone: 'America/Los_Angeles',
    });
    const date = subHours(getCurrentDate(), 2);
    const formattedDate = getRelativeDisplayDate(date);

    expect(formattedDate).toBe('2 hours ago');
  });

  it('should return yesterday', () => {
    updateSettings({
      dateFormat: 'F j, Y',
      gmtOffset: -7,
      timeFormat: 'g:i A',
      timezone: 'America/Los_Angeles',
    });
    const date = subDays(getCurrentDate(), 1);
    const formattedDate = getRelativeDisplayDate(date);

    expect(formattedDate).toBe('yesterday');
  });

  // Uses DEFAULT_DATE_SETTINGS.dateFormat
  it('should return May 2, 2020 with no formatting options', () => {
    const date = '2020-05-02T10:47:26';
    const formattedDate = getRelativeDisplayDate(date);

    expect(formattedDate).toBe('May 2, 2020');
  });

  it('should return May 2, 2020 with F j, Y formatting options', () => {
    updateSettings({
      dateFormat: 'F j, Y',
      gmtOffset: -7,
      timeFormat: 'g:i A',
      timezone: 'America/Los_Angeles',
    });

    const date = '2020-05-02T10:47:26';
    const formattedDate = getRelativeDisplayDate(date);

    expect(formattedDate).toBe('May 2, 2020');
  });

  it('should return 2020-05-02 with Y-m-d formatting options', () => {
    updateSettings({
      dateFormat: 'Y-m-d',
      gmtOffset: -7,
      timeFormat: 'g:i A',
      timezone: 'America/Los_Angeles',
    });

    const date = '2020-05-02T10:47:26';
    const formattedDate = getRelativeDisplayDate(date);

    expect(formattedDate).toBe('2020-05-02');
  });

  it('should return 05/02/2020 with m/d/Y formatting options', () => {
    updateSettings({
      dateFormat: 'm/d/Y',
      gmtOffset: -7,
      timeFormat: 'g:i A',
      timezone: 'America/Los_Angeles',
    });

    const date = '2020-05-02T10:47:26';
    const formattedDate = getRelativeDisplayDate(date);

    expect(formattedDate).toBe('05/02/2020');
  });

  it('should return 02/05/2020 with d/m/Y formatting options', () => {
    updateSettings({
      dateFormat: 'd/m/Y',
      gmtOffset: -7,
      timeFormat: 'g:i A',
      timezone: 'America/Los_Angeles',
    });

    const date = '2020-05-02T10:47:26';
    const formattedDate = getRelativeDisplayDate(date);

    expect(formattedDate).toBe('02/05/2020');
  });

  it('should return Sat 05 02 2020 with D m d yy formatting options', () => {
    updateSettings({
      dateFormat: 'D m d yy',
      gmtOffset: -7,
      timeFormat: 'g:i A',
      timezone: 'America/Los_Angeles',
    });
    const date = '2020-05-02T10:47:26';
    const formattedDate = getRelativeDisplayDate(date);

    expect(formattedDate).toBe('Sat 05 02 2020');
  });

  it('should correctly format a string date', () => {
    updateSettings({
      dateFormat: 'm/d/Y',
      gmtOffset: -7,
      timeFormat: 'g:i A',
      timezone: 'America/Los_Angeles',
    });

    const date = '2020-05-02T10:47:26';
    const formattedDate = getRelativeDisplayDate(date);

    expect(formattedDate).toBe('05/02/2020');
  });
});
