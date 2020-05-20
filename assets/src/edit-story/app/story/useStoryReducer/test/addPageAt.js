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
import { setupReducer } from './_utils';

describe('addPageAt', () => {
  it('should add a page at the given position', () => {
    const { restore, addPageAt } = setupReducer();

    // Set an initial state with multiple pages.
    restore({
      pages: [{ id: '111' }, { id: '222' }],
      current: '222',
    });

    const result = addPageAt({
      page: { id: '123', elements: [{ id: '456' }] },
      position: 1,
    });
    expect(getPageIds(result)).toStrictEqual(['111', '123', '222']);
  });

  it('should treat illegal positions as "add after current"', () => {
    const { restore, addPageAt } = setupReducer();

    // Set an initial state with multiple pages.
    restore({
      pages: [{ id: '111' }, { id: '222' }],
      current: '222',
    });

    const firstResult = addPageAt({
      page: { id: '123', elements: [{ id: '456' }] },
      position: -50,
    });
    expect(getPageIds(firstResult)).toStrictEqual(['111', '222', '123']);

    const secondResult = addPageAt({
      page: { id: '321', elements: [{ id: '456' }] },
      position: 50,
    });
    expect(getPageIds(secondResult)).toStrictEqual([
      '111',
      '222',
      '123',
      '321',
    ]);
  });
});

function getPageIds({ pages }) {
  return pages.map(({ id }) => id);
}
