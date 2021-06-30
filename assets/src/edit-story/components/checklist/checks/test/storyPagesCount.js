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
  it('should return guidance if story has less than 4 pages or more than 30 pages', () => {
    const storyTooShort = storyPagesCount({
      id: 123,
      title: 'Publishers HATE her!',
      pages: new Array(3),
    });
    const storyTooLong = storyPagesCount({
      id: 456,
      title: 'Carrot Cake Recipe',
      pages: new Array(31),
    });
    const testUndefined = storyPagesCount({
      id: 567,
      title: "World's best banana bread",
      pages: new Array(20),
    });

    expect(storyTooShort).toBe(true);

    expect(storyTooLong).toBe(true);

    expect(testUndefined).toBe(false);
  });
});
