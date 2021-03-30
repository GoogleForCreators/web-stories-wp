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

describe('deletePage', () => {
  it('should delete the specified page', () => {
    const { restore, deletePage } = setupReducer();

    // Set an initial state with multiple pages.
    restore({ pages: [{ id: '111' }, { id: '222' }] });

    const result = deletePage({ pageId: '222' });

    expect(result.pages).toStrictEqual([{ id: '111' }]);
  });

  it("should not delete the page if it's the only page", () => {
    const { restore, deletePage } = setupReducer();

    // Set an initial state with only one page.
    const initialState = restore({ pages: [{ id: '111' }] });

    const result = deletePage({ pageId: '111' });

    expect(result).toStrictEqual(initialState);
  });

  it('should ignore unknown page ids', () => {
    const { restore, deletePage } = setupReducer();

    // Set an initial state with multiple pages.
    const initialState = restore({ pages: [{ id: '111' }, { id: '222' }] });

    const result = deletePage({ pageId: '333' });

    expect(result).toStrictEqual(initialState);
  });
});
