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
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { FlagsProvider } from 'flagged';
import { PAGE_RATIO, UnitsProvider } from '@googleforcreators/units';
import { CURATED_FONT_NAMES } from '@googleforcreators/fonts';

/**
 * Internal dependencies
 */
import { renderWithTheme } from '../../../../testUtils';
import FontContext from '../../../../app/font/context';
import useFont from '../../../../app/font/useFont';
import fontsListResponse from '../../../panels/design/textStyle/test/fontsResponse.json';
import TextPane from '../../panes/text/textPane';
import { PRESETS } from '../../panes/text/textPresets';
import useLibrary from '../../useLibrary';
import useInsertPreset from '../../panes/text/useInsertPreset';
import { TEXT_SET_SIZE } from '../../../../constants';
import CanvasContext from '../../../../app/canvas/context';
import StoryContext from '../../../../app/story/context';

jest.mock('../../useLibrary');
jest.mock('../../../../app/font/useFont');
jest.mock('../../panes/text/useInsertPreset');

describe('TextPane', () => {
  const maybeEnqueueFontStyle = jest.fn();
  const insertPreset = jest.fn();
  const getPosition = jest.fn();
  beforeAll(() => {
    useLibrary.mockImplementation((selector) =>
      selector({
        state: {
          textSets: {},
        },
        actions: {
          insertElement: jest.fn(),
        },
      })
    );

    useFont.mockImplementation(() => ({
      actions: {
        maybeEnqueueFontStyle: maybeEnqueueFontStyle,
      },
    }));

    useInsertPreset.mockImplementation(() => ({
      insertPreset,
      getPosition,
    }));
  });

  it('should insert text with preset text style when clicking Enter', async () => {
    const availableCuratedFonts = fontsListResponse.filter(
      (font) => CURATED_FONT_NAMES.indexOf(font.name) > 0
    );

    const fontContextValues = {
      state: {
        fonts: fontsListResponse,
        recentFonts: [],
        curatedFonts: availableCuratedFonts,
      },
      actions: {
        ensureMenuFontsLoaded: () => {},
        ensureCustomFontsLoaded: () => {},
        getCustomFonts: jest.fn(),
        getCuratedFonts: jest.fn(),
      },
    };

    const canvasContextValue = {
      state: {
        nodesById: {},
        pageSize: {},
        pageContainer: document.body,
        canvasContainer: document.body,
        designSpaceGuideline: {},
      },
      actions: {},
    };

    const storyContextValue = {
      state: {
        currentPage: {
          elements: [
            {
              id: 'bg',
              type: 'shape',
            },
          ],
        },
        selectedElementIds: [],
        selectedElements: [],
        story: {
          globalStoryStyles: {
            ...{ colors: [], textStyles: [] },
          },
          currentStoryStyles: {
            colors: [],
          },
        },
      },
      actions: {},
    };

    renderWithTheme(
      <FlagsProvider
        features={{
          showTextSets: false,
          showTextAndShapesSearchInput: false,
        }}
      >
        <StoryContext.Provider value={storyContextValue}>
          <CanvasContext.Provider value={canvasContextValue}>
            <FontContext.Provider value={fontContextValues}>
              <UnitsProvider
                pageSize={{
                  width: TEXT_SET_SIZE,
                  height: TEXT_SET_SIZE / PAGE_RATIO,
                }}
                dataToEditorX={jest.fn()}
                dataToEditorY={jest.fn()}
              >
                <TextPane isActive />
              </UnitsProvider>
            </FontContext.Provider>
          </CanvasContext.Provider>
        </StoryContext.Provider>
      </FlagsProvider>
    );

    // Note: onClick handler is in Moveable so we can't test that directly in this component
    // and have to test using key handlers instead.
    fireEvent.keyDown(screen.getByRole('button', { name: 'Title 1' }), {
      key: 'Enter',
      which: 13,
    });

    await waitFor(() => expect(insertPreset).toHaveBeenCalledTimes(1));

    // Height is being assigned in the process of text insertion.
    await waitFor(() =>
      expect(insertPreset).toHaveBeenCalledWith(PRESETS[0].element, {
        isPositioned: false,
        accessibleColors: undefined,
      })
    );
  });
});
