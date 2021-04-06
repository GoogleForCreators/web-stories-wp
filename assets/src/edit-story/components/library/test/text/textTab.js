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
import { curatedFontNames } from '@web-stories-wp/fonts';

/**
 * Internal dependencies
 */
import { renderWithTheme } from '../../../../testUtils';
import FontContext from '../../../../app/font/context';
import fontsListResponse from '../../../form/advancedDropDown/test/fontsResponse.json';
import TextIcon from '../../panes/text/textIcon';
import { DEFAULT_PRESET } from '../../panes/text/textPresets';
import useLibrary from '../../useLibrary';

jest.mock('../../useLibrary');

describe('TextTab', () => {
  const insertElement = jest.fn();
  beforeAll(() => {
    useLibrary.mockImplementation(() => ({
      actions: {
        insertElement: insertElement,
      },
    }));
  });

  it('should insert text with default text style on shortcut click', () => {
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

    const { getByLabelText } = renderWithTheme(
      <FontContext.Provider value={fontContextValues}>
        <TextIcon isActive />
      </FontContext.Provider>
    );

    act(() => {
      fireEvent.click(getByLabelText('Add new text element'));
    });

    expect(insertElement).toHaveBeenCalledTimes(1);
    expect(insertElement).toHaveBeenCalledWith('text', DEFAULT_PRESET);
  });
});
