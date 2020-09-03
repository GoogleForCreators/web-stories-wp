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
import { formatDate } from '../formatDate';

describe('formatDate', () => {
  beforeEach(() => {
    MockDate.set(moment.parseZone('2020-07-15T22:47:26+00:00').format());
  });

  it('should return 2020-05-02 with no formatting options', () => {
    const dateString = '2020-05-02T10:47:26';
    const formattedDate = formatDate(dateString);

    expect(formattedDate).toBe('2020-05-02');
  });

  it('should return May 2, 2020 with F j, Y formatting options', () => {
    const dateString = '2020-05-02T10:47:26';
    const formattedDate = formatDate(dateString, {
      dateFormat: 'F j, Y',
      gmtOffset: -7,
      timeFormat: 'g:i A',
      timezone: 'America/Los_Angeles',
    });

    expect(formattedDate).toBe('May 2, 2020');
  });

  it('should return 2020-05-02 with Y-m-d formatting options', () => {
    const dateString = '2020-05-02T10:47:26';
    const formattedDate = formatDate(dateString, {
      dateFormat: 'Y-m-d',
      gmtOffset: -7,
      timeFormat: 'g:i A',
      timezone: 'America/Los_Angeles',
    });

    expect(formattedDate).toBe('2020-05-02');
  });

  it('should return 05/02/2020 with m/d/Y formatting options', () => {
    const dateString = '2020-05-02T10:47:26';
    const formattedDate = formatDate(dateString, {
      dateFormat: 'm/d/Y',
      gmtOffset: -7,
      timeFormat: 'g:i A',
      timezone: 'America/Los_Angeles',
    });

    expect(formattedDate).toBe('05/02/2020');
  });

  it('should return 02/05/2020 with d/m/Y formatting options', () => {
    const dateString = '2020-05-02T10:47:26';
    const formattedDate = formatDate(dateString, {
      dateFormat: 'd/m/Y',
      gmtOffset: -7,
      timeFormat: 'g:i A',
      timezone: 'America/Los_Angeles',
    });

    expect(formattedDate).toBe('02/05/2020');
  });

  it('should return Sat 05 02 2020 with D m d yy formatting options', () => {
    const dateString = '2020-05-02T10:47:26';
    const formattedDate = formatDate(dateString, {
      dateFormat: 'D m d yy',
      gmtOffset: -7,
      timeFormat: 'g:i A',
      timezone: 'America/Los_Angeles',
    });

    expect(formattedDate).toBe('Sat 05 02 2020');
  });

  it('should return an empty string with a null date', () => {
    const formattedDate = formatDate(null, {
      dateFormat: 'F j, Y',
      gmtOffset: null,
      timeFormat: 'g:i A',
      timezone: '',
    });

    expect(formattedDate).toBe('');
  });
});
