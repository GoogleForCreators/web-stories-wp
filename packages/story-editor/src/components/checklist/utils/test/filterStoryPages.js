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
import { filterStoryPages } from '..';

describe('filterStoryPages', () => {
  it('returns array of passing pages', () => {
    expect(
      filterStoryPages(
        [
          { id: 1, elements: [{ id: 'a' }, { id: 'b' }, { id: 'c' }] },
          { id: 2, elements: [{ id: 'd' }, { id: 'e' }] },
        ],
        (page) => page.id > 1
      )
    ).toStrictEqual([{ id: 2, elements: [{ id: 'd' }, { id: 'e' }] }]);
  });

  it('returns an empty array if story has no pages', () => {
    expect(filterStoryPages([], () => true)).toStrictEqual([]);
  });
});
