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

describe('addElementToSelection', () => {
  it('should add element to selection (if not already there)', () => {
    const { restore, addElementToSelection } = setupReducer();

    // Set an initial state.
    const initialState = restore({
      pages: [
        {
          id: '111',
          elements: [
            { id: 'e1', isBackground: true },
            { id: 'e2' },
            { id: 'e3' },
          ],
        },
      ],
      current: '111',
      selection: [],
    });

    expect(initialState.selection).not.toContain('e1');

    // Add element e1
    const firstResult = addElementToSelection({ elementId: 'e1' });
    expect(firstResult.selection).toContain('e1');

    // Add element e1 again - nothing happens
    const secondResult = addElementToSelection({ elementId: 'e1' });
    expect(secondResult).toStrictEqual(firstResult);
  });

  it('should ignore missing element id', () => {
    const { restore, addElementToSelection } = setupReducer();

    // Set an initial state.
    const initialState = restore({
      pages: [
        {
          id: '111',
          elements: [
            { id: 'e1', isBackground: true },
            { id: 'e2' },
            { id: 'e3' },
          ],
        },
      ],
      current: '111',
      selection: ['e1', 'e2'],
    });

    // Add no element
    const failedAttempt = addElementToSelection({ elementId: null });
    expect(failedAttempt).toStrictEqual(initialState);
  });

  it('should not allow adding video placeholder to non-empty selection', () => {
    const { restore, addElementToSelection } = setupReducer();

    // Set an initial state.
    const initialState = restore({
      pages: [
        {
          id: '111',
          elements: [
            { id: 'e1', resource: { isPlaceholder: true } },
            { id: 'e2' },
            { id: 'e3' },
          ],
        },
      ],
      current: '111',
      selection: ['e2', 'e3'],
    });

    // Toggle no element
    const failedAttempt = addElementToSelection({ elementId: 'e1' });
    expect(failedAttempt.selection).toStrictEqual(initialState.selection);
  });

  it('should not allow adding background element to non-empty selection', () => {
    const { restore, addElementToSelection } = setupReducer();

    // Set an initial state.
    const initialState = restore({
      pages: [
        {
          id: '111',
          elements: [
            { id: 'e1', isBackground: true },
            { id: 'e2' },
            { id: 'e3' },
          ],
        },
      ],
      current: '111',
      selection: ['e2', 'e3'],
    });

    // Toggle no element
    const failedAttempt = addElementToSelection({ elementId: 'e1' });
    expect(failedAttempt.selection).toStrictEqual(initialState.selection);
  });

  it('should remove background element from selection if adding a new one', () => {
    const { restore, addElementToSelection } = setupReducer();

    // Set an initial state with bg element selected
    restore({
      pages: [
        {
          id: '111',
          elements: [
            { id: 'e1', isBackground: true },
            { id: 'e2' },
            { id: 'e3' },
          ],
        },
      ],
      current: '111',
      selection: ['e1'],
    });

    // Add a new element to selection - should expunge bg element from selection
    const { selection } = addElementToSelection({ elementId: 'e2' });
    expect(selection).not.toContain('e1');
    expect(selection).toContain('e2');
  });

  it('should replace selection if adding locked element to non-empty selection', () => {
    const { restore, addElementToSelection } = setupReducer();

    // Set an initial state.
    restore({
      pages: [
        {
          id: '111',
          elements: [
            { id: 'e1', isBackground: true },
            { id: 'e2' },
            { id: 'e3' },
            { id: 'e4', isLocked: true },
          ],
        },
      ],
      current: '111',
      selection: ['e2', 'e3'],
    });

    const replacedSelection = addElementToSelection({ elementId: 'e4' });
    expect(replacedSelection.selection).toStrictEqual(['e4']);
  });

  it('should remove locked element from selection if adding a new one', () => {
    const { restore, addElementToSelection } = setupReducer();

    // Set an initial state with bg element selected
    restore({
      pages: [
        {
          id: '111',
          elements: [
            { id: 'e1', isBackground: true },
            { id: 'e2', isLocked: true },
            { id: 'e3' },
          ],
        },
      ],
      current: '111',
      selection: ['e2'],
    });

    // Add a new element to selection - should expunge locked element from selection
    const { selection } = addElementToSelection({ elementId: 'e3' });
    expect(selection).toStrictEqual(['e3']);
  });
});
