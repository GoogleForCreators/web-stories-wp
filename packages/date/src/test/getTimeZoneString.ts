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
 * Internal dependencies
 */
import getTimeZoneString from '../getTimeZoneString';
import { resetSettings, updateSettings } from '../settings';

describe('date/getTimeZoneString', () => {
  afterEach(() => {
    resetSettings();
  });

  it('returns +00 by default', () => {
    expect(getTimeZoneString()).toBe('+00');
  });

  it('returns timezone if present', () => {
    updateSettings({ timezone: '+02:30' });
    expect(getTimeZoneString()).toBe('+02:30');
  });

  it('returns value as hours from gmtOffset if low number', () => {
    updateSettings({ gmtOffset: 10 });
    expect(getTimeZoneString()).toBe('+10');

    updateSettings({ gmtOffset: -6 });
    expect(getTimeZoneString()).toBe('-06');
  });

  it('returns value converted from minutes to hours from gmtOffset if high number', () => {
    updateSettings({ gmtOffset: 120 });
    expect(getTimeZoneString()).toBe('+02');

    updateSettings({ gmtOffset: -150 });
    expect(getTimeZoneString()).toBe('-02:30');

    updateSettings({ gmtOffset: 375 });
    expect(getTimeZoneString()).toBe('+06:15');
  });

  it('rounds minutes appropriately', () => {
    // With low numbers where minutes are the decimals
    updateSettings({ gmtOffset: 6.25 });
    expect(getTimeZoneString()).toBe('+06:15');

    updateSettings({ gmtOffset: 6.27 });
    expect(getTimeZoneString()).toBe('+06:16');

    // With high numbers where minutes are the %60
    updateSettings({ gmtOffset: -121 });
    expect(getTimeZoneString()).toBe('-02:01');

    updateSettings({ gmtOffset: -121.1 });
    expect(getTimeZoneString()).toBe('-02:01');
  });
});
