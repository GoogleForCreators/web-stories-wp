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
import formatTime from '../formatTime';
import { updateSettings, resetSettings } from '../settings';

describe('date/formatTime', () => {
  beforeEach(() => {
    MockDate.set('2020-07-15T22:47:26+00:00');
  });

  afterEach(() => {
    MockDate.reset();
    resetSettings();
  });

  it('should return 10:47 am with no formatting options', () => {
    const dateString = '2020-05-02T10:47:26';
    const formattedTime = formatTime(dateString);

    expect(formattedTime).toStrictEqual('10:47 a.m.');
  });

  it('should return 5:47 PM with g:i A formatting options', () => {
    updateSettings({
      dateFormat: 'F j, Y',
      gmtOffset: -7,
      timeFormat: 'g:i A',
      timezone: 'America/Los_Angeles',
    });
    const dateString = '2020-05-02T17:47:26';
    const formattedTime = formatTime(dateString);

    expect(formattedTime).toStrictEqual('5:47 PM');
  });

  it('should return 20:23 with H:i formatting options', () => {
    updateSettings({
      dateFormat: 'm/d/Y',
      gmtOffset: -7,
      timeFormat: 'H:i',
      timezone: 'America/Los_Angeles',
    });

    const dateString = '2020-05-02T20:23:39';
    const formattedTime = formatTime(dateString);

    expect(formattedTime).toStrictEqual('20:23');
  });
});
