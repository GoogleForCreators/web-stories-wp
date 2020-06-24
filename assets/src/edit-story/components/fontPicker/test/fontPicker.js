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

/**
 * Internal dependencies
 */
import FontPicker from '../';
import { FontProvider } from '../../../app/font';
import APIContext from '../../../app/api/context';
import { renderWithTheme } from '../../../testUtils';
import fontsListResponse from './fontsResponse';

async function getFontPicker(extraFontOptions) {
  const getAllFontsPromise = Promise.resolve(fontsListResponse);
  const apiContextValue = {
    actions: {
      getAllFonts: () => getAllFontsPromise,
    },
    ...extraFontOptions,
  };
  const props = {
    onChange: jest.fn(),
    value: 'Roboto',
  };

  const accessors = renderWithTheme(
    <APIContext.Provider value={apiContextValue}>
      <FontProvider>
        <FontPicker {...props} />
      </FontProvider>
    </APIContext.Provider>
  );

  await act(() => getAllFontsPromise);

  return accessors;
}

describe('Font Picker', () => {
  // Mock scrollTo
  const scrollTo = jest.fn();
  Object.defineProperty(window.Element.prototype, 'scrollTo', {
    writable: true,
    value: scrollTo,
  });

  it('should render font picker title and clicking the button should open the font picker', async () => {
    const { getByRole, getAllByRole } = await getFontPicker();

    // Fire a click event.
    const selectButton = getByRole('button');
    fireEvent.click(selectButton);

    // Listbox should be showing after click
    const fontsList = getByRole('listbox');
    expect(fontsList).toBeInTheDocument();

    // Should render all options
    const allOptionItems = getAllByRole('option');
    expect(allOptionItems).toHaveLength(fontsListResponse.length);
  });

  it('should mark the currently selected font and scroll to it', async () => {
    scrollTo.mockReset();
    const { getByRole } = await getFontPicker();

    // Fire a click event.
    const selectButton = getByRole('button');
    fireEvent.click(selectButton);

    // Listbox should be showing after click
    const fontsList = getByRole('listbox');
    expect(fontsList).toBeInTheDocument();

    // Roboto option should be visible and have a selected checkmark
    const selectedRobotoOption = getByRole('option', {
      // The "accessible name" is derived by concatenating the accessible names
      // of all children,  which in this case is an SVG with aria-label="Selected"
      // and a plain text node with the font name. Thus this works!
      name: 'Selected Roboto',
    });
    expect(selectedRobotoOption).toBeInTheDocument();

    // We can't really validate this number anyway in JSDom (no actual
    // layout is happening), so just expect it to be called
    expect(scrollTo).toHaveBeenCalledWith(0, expect.any(Number));
  });

  it('should display used font as the first options', async () => {
    const extraFontOptions = {
      state: {
        recentFonts: {
          family: 'Space Mono',
          name: 'Space Mono',
        },
      },
    };
    const { getByRole, getAllByRole } = await getFontPicker(extraFontOptions);

    // Fire a click event.
    const selectButton = getByRole('button');
    fireEvent.click(selectButton);

    // Listbox should be showing after click
    const fontsList = getByRole('listbox');
    expect(fontsList).toBeInTheDocument();

    const firstOptionItem = getAllByRole('option')[0];
    expect(firstOptionItem).toHaveTextContent('Space Mono');
  });
});
