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

describe('deleteCurrentPage', () => {
  it('should update the current page to the next one if possible, otherwise previous', () => {
    const { restore, deleteCurrentPage } = setupReducer();

    // Set an initial state with multiple pages.
    restore({
      pages: [{ id: '111' }, { id: '222' }, { id: '333' }, { id: '444' }],
      current: '333',
    });

    // Delete page 333 (not last) and 444 becomes current
    const firstResult = deleteCurrentPage();
    const firstSetOfPageIds = firstResult.pages.map(({ id }) => id);
    expect(firstSetOfPageIds).toStrictEqual(['111', '222', '444']);
    expect(firstResult.current).toStrictEqual('444');

    // Now delete page 444 (last) and 222 becomes current
    const secondResult = deleteCurrentPage();
    const secondSetOfPageIds = secondResult.pages.map(({ id }) => id);
    expect(secondSetOfPageIds).toStrictEqual(['111', '222']);
    expect(secondResult.current).toStrictEqual('222');
  });
});
