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
import { validateGoogleAnalyticsIdFormat } from '../';

const idsToValidate = [
  ['UA-000000-56', true],
  ['ua-098765432-9875', true],
  ['78787878', false],
  ['ua--123448-0', false],
  ['clearly wrong', false],
  ['G-9878987', true],
  ['g-9878987', true],
  ['G-1A2BCD345E', true],
  ['X-8888888', false],
  ['G-123456', true],
  ['G-12345678', true],
  ['G-abcdefg8910', true],
];

describe('validateGoogleAnalyticsIdFormat', () => {
  it.each(idsToValidate)(
    'should take " %s " and return as %p google analytic id format',
    (validId, expected) => {
      const bool = validateGoogleAnalyticsIdFormat(validId);
      expect(bool).toBe(expected);
    }
  );
});
