/*
 * Copyright 2021 Google LLC
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
import getCurrentDate from '../getCurrentDate';
import { resetSettings, updateSettings } from '../settings';

describe('getCurrentDate', () => {
  beforeEach(() => {
    MockDate.set('2020-07-15T22:47:26+00:00');
  });

  afterEach(() => {
    MockDate.reset();
    resetSettings();
  });

  it('should return the current date with LA timezone', () => {
    updateSettings({
      dateFormat: 'F j, Y',
      gmtOffset: -7,
      timeFormat: 'g:i A',
      timezone: 'America/Los_Angeles',
    });

    expect(getCurrentDate().toISOString()).toStrictEqual(
      '2020-07-15T22:47:26.000Z'
    );
  });
});
