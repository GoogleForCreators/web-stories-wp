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
import { OverlayType } from '../../../../utils/backgroundOverlay';
import { setupReducer } from './_utils';

describe('setSelectedElementsById', () => {
  it('should update selection', () => {
    const { restore, setSelectedElementsById } = setupReducer();

    // Set an initial state.
    restore({
      pages: [
        { id: '111', elements: [{ id: 'e1' }, { id: 'e2' }, { id: 'e3' }] },
      ],
      current: '111',
      selection: ['e2', 'e1'],
    });

    // Select element 1 and 3
    const result = setSelectedElementsById({ elementIds: ['e1', 'e3'] });

    expect(result.selection).toStrictEqual(['e1', 'e3']);
  });

  it('should remove duplicates', () => {
    const { restore, setSelectedElementsById } = setupReducer();

    // Set an initial state.
    restore({
      pages: [
        { id: '111', elements: [{ id: 'e1' }, { id: 'e2' }, { id: 'e3' }] },
      ],
      current: '111',
      selection: [],
    });

    // Select element 1 and 3 (and 1 again for weird reasons)
    const result = setSelectedElementsById({ elementIds: ['e1', 'e3', 'e1'] });

    expect(result.selection).toStrictEqual(['e1', 'e3']);
  });

  it('should not update selection if nothing has changed', () => {
    const { restore, setSelectedElementsById } = setupReducer();

    // Set an initial state.
    restore({
      pages: [
        { id: '111', elements: [{ id: 'e1' }, { id: 'e2' }, { id: 'e3' }] },
      ],
      current: '111',
      selection: ['e1', 'e2'],
    });

    // Update to e2+e1, which is the same as e1+e2.
    const result = setSelectedElementsById({ elementIds: ['e2', 'e1'] });

    expect(result.selection).toStrictEqual(['e1', 'e2']);
  });

  it('should ignore non-list arguments', () => {
    const { restore, setSelectedElementsById } = setupReducer();

    // Set an initial state.
    restore({
      pages: [
        { id: '111', elements: [{ id: 'e1' }, { id: 'e2' }, { id: 'e3' }] },
      ],
      current: '111',
      selection: ['e1', 'e2'],
    });

    // Can't clear by setting to null (hint: use clearSelection)
    const result = setSelectedElementsById({ elementIds: null });

    expect(result.selection).toStrictEqual(['e1', 'e2']);
  });

  it('should remove background if included among other elements', () => {
    const { restore, setSelectedElementsById } = setupReducer();

    // Set an initial state.
    restore({
      pages: [
        {
          id: '111',
          backgroundElementId: 'e1',
          backgroundOverlay: OverlayType.NONE,
          elements: [{ id: 'e1' }, { id: 'e2' }, { id: 'e3' }],
        },
      ],
      current: '111',
      selection: [],
    });

    // Try setting all elements as selected
    const result = setSelectedElementsById({ elementIds: ['e2', 'e1', 'e3'] });

    expect(result.selection).toStrictEqual(['e2', 'e3']);
  });
});
