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
import { formatTime } from '../formatTime';

describe('formatTime', () => {
  beforeEach(() => {
    MockDate.set(moment.parseZone('2020-07-15T22:47:26+00:00').format());
  });

  it('should return 12:47 pm with no formatting options', () => {
    const dateString = moment.parseZone('2020-05-02T10:47:26');
    const formattedTime = formatTime(dateString);

    expect(formattedTime).toBe('12:47 pm');
  });

  it('should return 12:47 PM with g:i A formatting options', () => {
    const dateString = moment.parseZone('2020-05-02T10:47:26');
    const formattedTime = formatTime(dateString, {
      dateFormat: 'F j, Y',
      gmtOffset: -7,
      timeFormat: 'g:i A',
      timezone: 'America/Los_Angeles',
    });

    expect(formattedTime).toBe('12:47 PM');
  });

  it('should return 12:47 with H:i formatting options', () => {
    const dateString = moment.parseZone('2020-05-02T10:47:26');
    const formattedTime = formatTime(dateString, {
      dateFormat: 'm/d/Y',
      gmtOffset: -7,
      timeFormat: 'H:i',
      timezone: 'America/Los_Angeles',
    });

    expect(formattedTime).toBe('12:47');
  });
});
