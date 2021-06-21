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
import { storyMissingTitle } from '../storyMissingTitle';

describe('storyMissingTitle', () => {
  it('should return an error-type guidance message if the story is missing its title', () => {
    const testEmptyStringStory = {
      id: 890,
      status: 'draft',
      title: '',
    };
    const testUndefinedTitleStory = {
      id: 890,
      status: 'draft',
    };
    const testUndefined = storyMissingTitle(testUndefinedTitleStory);
    const testEmptyString = storyMissingTitle(testEmptyStringStory);
    const testHappy = storyMissingTitle({
      title: 'The Allegory of the Cave',
    });
    expect(testHappy).toBe(false);
    expect(testEmptyString).toBe(true);
    expect(testUndefined).toBe(true);
  });
});
