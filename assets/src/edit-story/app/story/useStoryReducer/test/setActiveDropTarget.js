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

describe('setActiveDropTarget', () => {
  it('should set active drop target if it exists', () => {
    const { restore, setActiveDropTarget } = setupReducer();

    // Set an initial state with multiple pages.
    restore({
      pages: [
        { id: '111', elements: [{ id: 'aaaa-bbbb-cccc-dddd' }] },
        { id: '222' },
      ],
      current: '111',
    });

    // Update active drop target to aaaa-bbbb-cccc-dddd
    const result = setActiveDropTarget({ elementId: 'aaaa-bbbb-cccc-dddd' });

    expect(result.activeDropTarget).toStrictEqual('aaaa-bbbb-cccc-dddd');
  });

  it('should ignore unknown elements', () => {
    const { restore, setActiveDropTarget } = setupReducer();

    // Set an initial state with multiple pages.
    const initialState = restore({
      pages: [{ id: '111' }, { id: '222' }],
      current: '111',
    });

    // Unknown element aaaa-bbbb-cccc-dddd, do nothing
    const result = setActiveDropTarget({ elementId: 'aaaa-bbbb-cccc-dddd' });

    expect(result).toStrictEqual(initialState);
  });
});
