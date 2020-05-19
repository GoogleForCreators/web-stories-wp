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
 * External dependencies
 */
import { act } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { FontProvider } from '../../../../app/font';
import ShapePreview from '../../panes/shapes/shapePreview';
import APIContext from '../../../../app/api/context';
import { renderWithTheme } from '../../../../testUtils/index';

jest.mock('../../useLibrary');
import useLibrary from '../../useLibrary';

const rectangleMask = {
  type: 'rectangle',
  name: 'Rectangle',
  path: 'M 0,0 1,0 1,1 0,1 0,0 Z',
  ratio: 1,
};

describe('ShapePreview', () => {
  const insertElement = jest.fn();

  beforeAll(() => {
    useLibrary.mockImplementation(() => ({
      actions: {
        insertElement: insertElement,
      },
    }));
  });

  it('should be draggable', async () => {
    const getAllFontsPromise = Promise.resolve([]);
    const apiContextValue = {
      actions: {
        getAllFonts: () => getAllFontsPromise,
      },
    };

    let shapePreviewElement;
    await act(async () => {
      const { getByTestId } = renderWithTheme(
        <APIContext.Provider value={apiContextValue}>
          <FontProvider apiContextValue>
            <ShapePreview mask={rectangleMask} />
          </FontProvider>
        </APIContext.Provider>
      );

      await getAllFontsPromise;
      // Test that the drag event has the right data transfer object...
      shapePreviewElement = getByTestId('preview');
    });

    expect(shapePreviewElement).toHaveAttribute('draggable');
  });
});
