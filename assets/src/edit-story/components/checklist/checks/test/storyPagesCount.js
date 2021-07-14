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
import { storyPagesCount } from '../storyPagesCount';

describe('storyPagesCount', () => {
  it('should return true if story has less than 4 pages or more than 30 pages', () => {
    const storyTooShort = storyPagesCount(3);
    const storyTooLong = storyPagesCount(31);
    const testUndefined = storyPagesCount(20);

    expect(storyTooShort).toBe(true);

    expect(storyTooLong).toBe(true);

    expect(testUndefined).toBe(false);
  });
});
