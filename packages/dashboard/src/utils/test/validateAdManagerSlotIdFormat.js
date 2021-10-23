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
import { validateAdManagerSlotIdFormat } from '..';

const one_hundred_chars = 'abcde'.repeat(20);

const idsToValidate = [
  ['123456789/amp_story_dfp_example', false],
  ['/123456789/amp_story_dfp_example', true],
  ['/123456789/a4a/amp_story_dfp_example', true],
  ['/123456789/a4a/trailing-slash/', false],
  ['/not/numeric/start', false],
  ['clearly wrong', false],
  ['/1234567,1234/Travel', true],
  ['/123456789/post.mobileamp/webstory', true],
  ['/123456789/abc_123-.*/\\![:()', true],
  [`/123456789/${one_hundred_chars}/${one_hundred_chars}`, true],
  [`/123456789/${one_hundred_chars}f/${one_hundred_chars}`, false],
  [`/123456789/${one_hundred_chars}/${one_hundred_chars}a`, false],
];

describe('validateAdManagerSlotIdFormat', () => {
  it.each(idsToValidate)(
    'should take "%s" and return as %p Ad Manager slot id format',
    (slotId, expected) => {
      const bool = validateAdManagerSlotIdFormat(slotId);
      expect(bool).toBe(expected);
    }
  );
});
