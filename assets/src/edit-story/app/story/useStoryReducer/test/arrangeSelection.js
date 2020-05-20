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

describe('arrangeSelection', () => {
  it('should arrange a single selected element to the desired position', () => {
    const { restore, arrangeSelection } = setupReducer();

    restore(getInitialState(['234']));

    const result = arrangeSelection({ position: 3 });

    expect(getElementIdsFromCurrentPage(result)).toStrictEqual([
      '123',
      '345',
      '456',
      '234',
    ]);
  });

  it('should do nothing if selection is background element', () => {
    const { restore, arrangeSelection } = setupReducer();

    const initialState = restore(getInitialState(['123']));

    const result = arrangeSelection({ position: 2 });

    expect(result).toStrictEqual(initialState);
  });

  it('should do nothing if there is no selection', () => {
    const { restore, arrangeSelection } = setupReducer();

    const initialState = restore(getInitialState([]));

    const result = arrangeSelection({ position: 2 });

    expect(result).toStrictEqual(initialState);
  });

  it('should do nothing if there is multi-selection', () => {
    const { restore, arrangeSelection } = setupReducer();

    const initialState = restore(getInitialState(['234', '456']));

    const result = arrangeSelection({ position: 2 });

    expect(result).toStrictEqual(initialState);
  });
});

function getElementIdsFromCurrentPage({ pages, current }) {
  return pages.find(({ id }) => id === current).elements.map(({ id }) => id);
}

function getInitialState(selection) {
  return {
    pages: [
      {
        backgroundOverlay: OverlayType.NONE,
        id: '111',
        elements: [
          { id: '123', isBackground: true },
          { id: '234' },
          { id: '345' },
          { id: '456' },
        ],
      },
    ],
    current: '111',
    selection,
  };
}
