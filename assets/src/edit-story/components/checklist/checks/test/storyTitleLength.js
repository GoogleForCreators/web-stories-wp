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
import { storyTitleLength } from '../storyTitleLength';

describe('storyTitleLength', () => {
  it('should return true if the story title is longer than 40 characters', () => {
    const testTitle =
      'If you want to make an apple pie from scratch, you must first create the universe.';
    const testFalse = storyTitleLength(
      'Once, there was a man from Nantucket...'
    );
    const test = storyTitleLength(testTitle);
    expect(test).toBe(true);
    expect(testFalse).toBe(false);
  });
});
