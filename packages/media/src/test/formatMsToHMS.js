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
 * Internal dependencies
 */
import formatMsToHMS from '../formatMsToHMS';

describe('formatMsToHMS', () => {
  it('should correctly format 0', () => {
    expect(formatMsToHMS(0)).toBe('00:00:00');
  });

  it('should return correct results', () => {
    expect(formatMsToHMS(1000)).toBe('00:00:01');
    expect(formatMsToHMS(60000)).toBe('00:01:00');
    expect(formatMsToHMS(10500)).toBe('00:00:10.5');
  });
});
