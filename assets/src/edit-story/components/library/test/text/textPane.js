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
import { act, fireEvent } from '@testing-library/react';
import { FlagsProvider } from 'flagged';

/**
 * Internal dependencies
 */
import TextPane from '../../panes/text/textPane';
import { PRESETS } from '../../panes/text/textPresets';
import { renderWithTheme } from '../../../../testUtils/index';

jest.mock('../../useLibrary');
jest.mock('../../../../app/font/useFont');
import useFont from '../../../../app/font/useFont';
import useLibrary from '../../useLibrary';
import FontContext from '../../../../app/font/context';
import fontsListResponse from '../../../form/advancedDropDown/test/fontsResponse.json';
import { curatedFontNames } from '../../../../app/font/curatedFonts';

describe('TextPane', () => {
  const insertElement = jest.fn();
  const maybeEnqueueFontStyle = jest.fn();
  beforeAll(() => {
    useLibrary.mockImplementation((selector) =>
      selector({
        actions: {
          insertElement: insertElement,
        },
      })
    );

    useFont.mockImplementation(() => ({
      actions: {
        maybeEnqueueFontStyle: maybeEnqueueFontStyle,
      },
    }));
  });

  it('should insert text with preset text style on pressing a preset', async () => {
    const availableCuratedFonts = fontsListResponse.filter(
      (font) => curatedFontNames.indexOf(font.name) > 0
    );

    const fontContextValues = {
      state: {
        fonts: fontsListResponse,
        recentFonts: [],
        curatedFonts: availableCuratedFonts,
      },
      actions: {
        ensureMenuFontsLoaded: () => {},
      },
    };
    await act(() => {
      const { getByRole } = renderWithTheme(
        <FlagsProvider
          features={{
            showTextSets: false,
            showTextAndShapesSearchInput: false,
          }}
        >
          <FontContext.Provider value={fontContextValues}>
            <TextPane isActive={true} />
          </FontContext.Provider>
        </FlagsProvider>
      );

      fireEvent.click(getByRole('button', { name: 'Heading 1' }));
    });

    expect(insertElement).toHaveBeenCalledTimes(1);
    expect(insertElement).toHaveBeenCalledWith('text', PRESETS[0].element);
  });
});
