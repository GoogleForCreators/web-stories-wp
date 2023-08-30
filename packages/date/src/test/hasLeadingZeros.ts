/*
 * Copyright 2023 Google LLC
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
import hasLeadingZeros from '../hasLeadingZeros';
import { updateSettings } from '../settings';

describe('date/hasLeadingZeros', () => {
  it('should detect time format correctly', () => {
    updateSettings({
      timeFormat: 'h:i A',
    });

    const hasLeadingZeros1 = hasLeadingZeros();
    expect(hasLeadingZeros1).toBeTrue();

    updateSettings({
      timeFormat: 'H:i A',
    });

    const hasLeadingZeros2 = hasLeadingZeros();
    expect(hasLeadingZeros2).toBeTrue();

    updateSettings({
      timeFormat: 'g:i',
    });

    const hasLeadingZeros3 = hasLeadingZeros();
    expect(hasLeadingZeros3).toBeFalse();

    updateSettings({
      timeFormat: 'G:i',
    });

    const hasLeadingZeros4 = hasLeadingZeros();
    expect(hasLeadingZeros4).toBeFalse();
  });
});
