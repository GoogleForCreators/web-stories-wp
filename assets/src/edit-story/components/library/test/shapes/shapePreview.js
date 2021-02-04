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
import ShapePreview from '../../panes/shapes/shapePreview';
import { renderWithTheme } from '../../../../testUtils/index';

jest.mock('../../useLibrary');
import useLibrary from '../../useLibrary';
import { PAGE_RATIO, TEXT_SET_SIZE } from '../../../../constants';
import { UnitsProvider } from '../../../../units';
import CanvasContext from '../../../../app/canvas/context';

describe('ShapePreview', () => {
  const insertElement = jest.fn();

  const rectangleMask = {
    type: 'rectangle',
    name: 'Rectangle',
    path: 'M 0,0 1,0 1,1 0,1 0,0 Z',
    ratio: 1,
  };

  beforeAll(() => {
    useLibrary.mockImplementation(() => ({
      actions: {
        insertElement: insertElement,
      },
    }));
  });

  it('should render', () => {
    let shapePreviewElement;
    act(() => {
      const canvasValue = {
        state: {
          nodesById: {},
          pageSize: {},
          pageContainer: document.body,
          canvasContainer: document.body,
          designSpaceGuideline: {},
        },
      };
      const { getByLabelText } = renderWithTheme(
        <CanvasContext.Provider value={canvasValue}>
          <UnitsProvider
            pageSize={{
              width: TEXT_SET_SIZE,
              height: TEXT_SET_SIZE / PAGE_RATIO,
            }}
            dataToEditorX={jest.fn()}
            dataToEditorY={jest.fn()}
          >
            <ShapePreview mask={rectangleMask} />
          </UnitsProvider>
        </CanvasContext.Provider>
      );
      shapePreviewElement = getByLabelText(rectangleMask.name);
    });

    expect(shapePreviewElement).toBeInTheDocument();
  });
});
