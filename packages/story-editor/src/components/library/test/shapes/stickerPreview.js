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
import { screen } from '@testing-library/react';
import { UnitsProvider, PAGE_RATIO } from '@googleforcreators/units';
import STICKERS from '@googleforcreators/stickers';
import { renderWithTheme } from '@googleforcreators/test-utils';

/**
 * Internal dependencies
 */
import StickerPreview from '../../panes/shapes/stickerPreview';
import useLibrary from '../../useLibrary';
import { TEXT_SET_SIZE } from '../../../../constants';
import CanvasContext from '../../../../app/canvas/context';

jest.mock('../../useLibrary');

describe('StickerPreview', () => {
  const insertElement = jest.fn();

  beforeAll(() => {
    useLibrary.mockImplementation(() => ({
      actions: {
        insertElement: insertElement,
      },
    }));
  });

  it('should render', () => {
    const canvasValue = {
      state: {
        nodesById: {},
        pageSize: {},
        pageContainer: document.body,
        canvasContainer: document.body,
        designSpaceGuideline: {},
        boundingBoxes: {},
      },
      actions: {},
    };
    renderWithTheme(
      <CanvasContext.Provider value={canvasValue}>
        <UnitsProvider
          pageSize={{
            width: TEXT_SET_SIZE,
            height: TEXT_SET_SIZE / PAGE_RATIO,
          }}
          dataToEditorX={jest.fn()}
          dataToEditorY={jest.fn()}
        >
          <StickerPreview stickerType={'beautyCta'} />
        </UnitsProvider>
      </CanvasContext.Provider>
    );

    // Stickers render title in svg <title>...</title> element
    expect(screen.getByText(STICKERS.beautyCta.title)).toBeInTheDocument();
  });
});
