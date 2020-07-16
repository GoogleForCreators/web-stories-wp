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
import { getTimeSensitiveDisplayDate } from '../';

describe('date/getTimeSensitiveDisplayDate', () => {
  beforeEach(() => {
    MockDate.set(moment('2013-02-08 09:30'));
  });

  it('should return 2 minutes ago using moment', () => {
    const dateString = moment().subtract(2, 'minutes');
    const formattedDate = getTimeSensitiveDisplayDate(dateString);

    expect(formattedDate).toBe('2 minutes ago');
  });

  it('should return an hour ago using moment', () => {
    const dateString = moment().subtract(1, 'hours');
    const formattedDate = getTimeSensitiveDisplayDate(dateString);

    expect(formattedDate).toBe('an hour ago');
  });

  it('should return 2 hours ago using moment', () => {
    const dateString = moment().subtract(2, 'hours');
    const formattedDate = getTimeSensitiveDisplayDate(dateString);

    expect(formattedDate).toBe('2 hours ago');
  });

  it('should return yesterday using moment', () => {
    const dateString = moment().subtract(1, 'days');
    const formattedDate = getTimeSensitiveDisplayDate(dateString);

    expect(formattedDate).toBe('yesterday');
  });

  it('should return 2020-05-02 with no formatting options', () => {
    const dateString = moment('05-02-2020', 'MM-DD-YYYY');
    const formattedDate = getTimeSensitiveDisplayDate(dateString);

    expect(formattedDate).toBe('2020-05-02');
  });

  it('should return May 2, 2020 with F j, Y formatting options', () => {
    const dateString = moment('05-02-2020', 'MM-DD-YYYY');
    const formattedDate = getTimeSensitiveDisplayDate(dateString, {
      dateFormat: 'F j, Y',
    });

    expect(formattedDate).toBe('May 2, 2020');
  });

  it('should return an empty string with a null date', () => {
    const formattedDate = getTimeSensitiveDisplayDate(null, {
      dateFormat: 'F j, Y',
    });

    expect(formattedDate).toBe('');
  });
});
