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

describe('removeElementFromSelection', () => {
  it('should remove element from selection (if even there)', () => {
    const { restore, removeElementFromSelection } = setupReducer();

    // Set an initial state.
    const initialState = restore({
      pages: [
        { id: '111', elements: [{ id: 'e1' }, { id: 'e2' }, { id: 'e3' }] },
      ],
      current: '111',
      selection: ['e1', 'e2'],
    });

    expect(initialState.selection).toContain('e1');

    // Remove element e1
    const firstResult = removeElementFromSelection({ elementId: 'e1' });
    expect(firstResult.selection).not.toContain('e1');

    // Remove element e1 again - nothing happens
    const secondResult = removeElementFromSelection({ elementId: 'e1' });
    expect(secondResult).toStrictEqual(firstResult);
  });

  it('should ignore missing element id', () => {
    const { restore, removeElementFromSelection } = setupReducer();

    // Set an initial state.
    const initialState = restore({
      pages: [
        { id: '111', elements: [{ id: 'e1' }, { id: 'e2' }, { id: 'e3' }] },
      ],
      current: '111',
      selection: ['e1', 'e2'],
    });

    // Remove no element
    const failedAttempt = removeElementFromSelection({ elementId: null });
    expect(failedAttempt).toStrictEqual(initialState);
  });
});
