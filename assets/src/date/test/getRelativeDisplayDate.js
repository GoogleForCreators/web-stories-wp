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
import { getRelativeDisplayDate } from '../';

describe('date/getRelativeDisplayDate', () => {
  beforeEach(() => {
    MockDate.set(moment.parseZone('2020-07-15T22:47:26+00:00').format());
  });

  it('should return 2 minutes ago in America/New_York using moment', () => {
    const dateString = moment.utc().subtract(2, 'minutes');
    const formattedDate = getRelativeDisplayDate(dateString, {
      dateFormat: 'F j, Y',
      gmtOffset: -4,
      timeFormat: 'g:i A',
      timezone: 'America/New_York',
    });

    expect(formattedDate).toBe('2 minutes ago');
  });

  it('should return 2 minutes ago in America/Los_Angeles using moment', () => {
    const dateString = moment.utc().subtract(2, 'minutes');
    const formattedDate = getRelativeDisplayDate(dateString, {
      dateFormat: 'F j, Y',
      gmtOffset: -7,
      timeFormat: 'g:i A',
      timezone: 'America/Los_Angeles',
    });

    expect(formattedDate).toBe('2 minutes ago');
  });

  it('should return an hour ago using moment', () => {
    const dateString = moment.utc().subtract(1, 'hours');
    const formattedDate = getRelativeDisplayDate(dateString, {
      dateFormat: 'F j, Y',
      gmtOffset: -7,
      timeFormat: 'g:i A',
      timezone: 'America/Los_Angeles',
    });

    expect(formattedDate).toBe('an hour ago');
  });

  it('should return 2 hours ago using moment', () => {
    const dateString = moment.utc().subtract(2, 'hours');
    const formattedDate = getRelativeDisplayDate(dateString, {
      dateFormat: 'F j, Y',
      gmtOffset: -7,
      timeFormat: 'g:i A',
      timezone: 'America/Los_Angeles',
    });

    expect(formattedDate).toBe('2 hours ago');
  });

  it('should return yesterday using moment', () => {
    const dateString = moment.utc().subtract(1, 'days');
    const formattedDate = getRelativeDisplayDate(dateString, {
      dateFormat: 'F j, Y',
      gmtOffset: -7,
      timeFormat: 'g:i A',
      timezone: 'America/Los_Angeles',
    });

    expect(formattedDate).toBe('yesterday');
  });

  it('should return 2020-05-02 with no formatting options', () => {
    const dateString = moment.parseZone('2020-05-02T10:47:26');
    const formattedDate = getRelativeDisplayDate(dateString);

    expect(formattedDate).toBe('2020-05-02');
  });

  it('should return May 2, 2020 with F j, Y formatting options', () => {
    const dateString = moment.parseZone('2020-05-02T10:47:26');
    const formattedDate = getRelativeDisplayDate(dateString, {
      dateFormat: 'F j, Y',
      gmtOffset: -7,
      timeFormat: 'g:i A',
      timezone: 'America/Los_Angeles',
    });

    expect(formattedDate).toBe('May 2, 2020');
  });

  it('should return 2020-05-02 with Y-m-d formatting options', () => {
    const dateString = moment.parseZone('2020-05-02T10:47:26');
    const formattedDate = getRelativeDisplayDate(dateString, {
      dateFormat: 'Y-m-d',
      gmtOffset: -7,
      timeFormat: 'g:i A',
      timezone: 'America/Los_Angeles',
    });

    expect(formattedDate).toBe('2020-05-02');
  });

  it('should return 05/02/2020 with m/d/Y formatting options', () => {
    const dateString = moment.parseZone('2020-05-02T10:47:26');
    const formattedDate = getRelativeDisplayDate(dateString, {
      dateFormat: 'm/d/Y',
      gmtOffset: -7,
      timeFormat: 'g:i A',
      timezone: 'America/Los_Angeles',
    });

    expect(formattedDate).toBe('05/02/2020');
  });

  it('should return 02/05/2020 with d/m/Y formatting options', () => {
    const dateString = moment.parseZone('2020-05-02T10:47:26');
    const formattedDate = getRelativeDisplayDate(dateString, {
      dateFormat: 'd/m/Y',
      gmtOffset: -7,
      timeFormat: 'g:i A',
      timezone: 'America/Los_Angeles',
    });

    expect(formattedDate).toBe('02/05/2020');
  });

  it('should return Sat 05 02 2020 with D m d yy formatting options', () => {
    const dateString = moment.parseZone('2020-05-02T10:47:26');
    const formattedDate = getRelativeDisplayDate(dateString, {
      dateFormat: 'D m d yy',
      gmtOffset: -7,
      timeFormat: 'g:i A',
      timezone: 'America/Los_Angeles',
    });

    expect(formattedDate).toBe('Sat 05 02 2020');
  });

  it('should return an empty string with a null date', () => {
    const formattedDate = getRelativeDisplayDate(null, {
      dateFormat: 'F j, Y',
      gmtOffset: null,
      timeFormat: 'g:i A',
      timezone: '',
    });

    expect(formattedDate).toBe('');
  });
});
