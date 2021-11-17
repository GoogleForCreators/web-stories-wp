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
import getMsFromHMS from '../getMsFromHMS';

describe('getMsFromHMS', () => {
  it('should correctly format values resulting in 0', () => {
    expect(getMsFromHMS('00:00:00')).toBe(0);
    expect(getMsFromHMS(null)).toBe(0);
    expect(getMsFromHMS('foo')).toBe(0);
  });

  it('should return correct results', () => {
    expect(getMsFromHMS('00:00:01')).toBe(1000);
    expect(getMsFromHMS('00:01:00')).toBe(60000);
    expect(getMsFromHMS('00:00:10.5')).toBe(10500);
  });
});
