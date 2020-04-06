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

describe('clearBackgroundElement', () => {
  it('should clear the background element', () => {
    const { restore, clearBackgroundElement } = setupReducer();

    // Set an initial state with a current page and some elements.
    restore({
      pages: [
        {
          id: '111',
          elements: [{ id: '123' }, { id: '456' }, { id: '789' }],
          backgroundElementId: '123',
          backgroundOverlay: OverlayType.NONE,
        },
      ],
      current: '111',
      selection: [],
    });

    const result = clearBackgroundElement();

    expect(result.pages[0]).toStrictEqual({
      id: '111',
      backgroundElementId: null,
      backgroundOverlay: OverlayType.NONE,
      elements: [{ id: '123' }, { id: '456' }, { id: '789' }],
    });
  });

  it('should do nothing if there is no background', () => {
    const { restore, clearBackgroundElement } = setupReducer();

    // Set an initial state with a current page and some elements.
    const initialState = restore({
      pages: [
        {
          id: '111',
          elements: [{ id: '123' }, { id: '456' }, { id: '789' }],
          backgroundElementId: null,
        },
      ],
      current: '111',
      selection: [],
    });

    const result = clearBackgroundElement();

    expect(result).toStrictEqual(initialState);
  });
});
