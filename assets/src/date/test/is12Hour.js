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
import is12Hour from '../is12Hour';
import { updateSettings } from '../settings';

describe('date/is12Hour', () => {
  it('should default to true', () => {
    expect(is12Hour()).toBeTrue();
  });

  it('should detect time format correctly', () => {
    updateSettings({
      timeFormat: 'g:i A',
    });

    const is12Hour1 = is12Hour();
    expect(is12Hour1).toBeTrue();

    updateSettings({
      timeFormat: 'H:i',
    });

    const is12Hour2 = is12Hour();
    expect(is12Hour2).toBeFalse();
  });
});
