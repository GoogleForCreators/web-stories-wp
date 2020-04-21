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

describe('updateCurrentPageProperties', () => {
  it('should update properties of the current page', () => {
    const { restore, updateCurrentPageProperties } = setupReducer();

    // Set an initial state with multiple pages.
    restore({ pages: [{ id: '111' }, { id: '222' }], current: '222' });

    // Add x=1 to page 222
    const result = updateCurrentPageProperties({ properties: { x: 1 } });

    expect(result.pages).toStrictEqual([{ id: '111' }, { id: '222', x: 1 }]);
  });
});
