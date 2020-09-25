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
import { act, fireEvent, waitFor } from '@testing-library/react';

/**
 * Internal dependencies
 */
import FontPicker from '../';
import FontContext from '../../../app/font/context';
import { renderWithTheme } from '../../../testUtils';
import { curatedFontNames } from '../../../app/font/curatedFonts';
import fontsListResponse from './fontsResponse';

const availableCuratedFonts = fontsListResponse.filter(
  (font) => curatedFontNames.indexOf(font.name) > 0
);

function getFontPicker(options) {
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
  const props = {
    onChange: jest.fn(),
    value: 'Roboto',
    ...options,
  };

  const accessors = renderWithTheme(
    <FontContext.Provider value={fontContextValues}>
      <FontPicker {...props} />
    </FontContext.Provider>
  );

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
    expect(allOptionItems).toHaveLength(availableCuratedFonts.length);
  });

  it('should mark the currently selected font', async () => {
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

  it('should select the next font in the list when using the down arrow plus enter key', async () => {
    const onChangeFn = jest.fn();
    const { getByRole } = await getFontPicker({ onChange: onChangeFn });

    const selectButton = getByRole('button');
    fireEvent.click(selectButton);

    const fontsList = getByRole('listbox');
    expect(fontsList).toBeInTheDocument();

    // focus first element in list
    act(() => {
      fireEvent.keyDown(fontsList, {
        key: 'ArrowDown',
      });
    });

    // focus second element in list
    act(() => {
      fireEvent.keyDown(fontsList, {
        key: 'ArrowDown',
      });
    });

    act(() => {
      fireEvent.keyDown(fontsList, { key: 'Enter' });
    });

    // The second font in the list.
    expect(onChangeFn).toHaveBeenCalledWith(availableCuratedFonts[1].name);
  });

  it('should close the menu when the Esc key is pressed.', async () => {
    const onChangeFn = jest.fn();
    const { getByRole } = await getFontPicker({ onChange: onChangeFn });

    const selectButton = getByRole('button');
    fireEvent.click(selectButton);

    const fontsList = getByRole('listbox');
    expect(fontsList).toBeInTheDocument();

    act(() => {
      fireEvent.keyDown(fontsList, {
        key: 'Escape',
      });
    });

    await waitFor(() => expect(fontsList).not.toBeInTheDocument());
  });

  it('should select the previous font in the list when using the up arrow plus enter key', async () => {
    const onChangeFn = jest.fn();
    const { getByRole } = await getFontPicker({ onChange: onChangeFn });

    const selectButton = getByRole('button');
    fireEvent.click(selectButton);

    const fontsList = getByRole('listbox');
    expect(fontsList).toBeInTheDocument();

    // Move to first element in list
    act(() => {
      fireEvent.keyDown(fontsList, {
        key: 'ArrowDown',
      });
    });
    // Move to second element in list
    act(() => {
      fireEvent.keyDown(fontsList, {
        key: 'ArrowDown',
      });
    });
    // Move to third element in list
    act(() => {
      fireEvent.keyDown(fontsList, {
        key: 'ArrowDown',
      });
    });

    act(() => {
      fireEvent.keyDown(fontsList, {
        key: 'ArrowUp',
      });
    });

    act(() => {
      fireEvent.keyDown(fontsList, { key: 'Enter' });
    });

    // Moving down by 2 and back 1 up should end up with the second font: Roboto Condensed.
    expect(onChangeFn).toHaveBeenCalledWith(availableCuratedFonts[1].name);
  });

  it('should search and filter the list to match the results.', async () => {
    const { getByRole, queryAllByRole } = await getFontPicker();

    const selectButton = getByRole('button');
    fireEvent.click(selectButton);

    expect(queryAllByRole('option')).toHaveLength(availableCuratedFonts.length);

    act(() => {
      fireEvent.change(getByRole('combobox'), {
        target: { value: 'Yrsa' },
      });
    });

    await waitFor(() => expect(queryAllByRole('option')).toHaveLength(1), {
      timeout: 500,
    });
  });

  it('should show an empty list when the search keyword has no results.', async () => {
    const { getByRole, queryAllByRole } = await getFontPicker();

    const selectButton = getByRole('button');
    fireEvent.click(selectButton);

    expect(queryAllByRole('option')).toHaveLength(availableCuratedFonts.length);

    act(() => {
      fireEvent.change(getByRole('combobox'), {
        target: { value: 'Not a font!' },
      });
    });

    await waitFor(() => expect(queryAllByRole('option')).toHaveLength(0), {
      timeout: 500,
    });
  });
});
