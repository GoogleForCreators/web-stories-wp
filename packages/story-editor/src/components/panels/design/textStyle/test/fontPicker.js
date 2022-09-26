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
import { fireEvent, waitFor, screen } from '@testing-library/react';
import { Datalist } from '@googleforcreators/design-system';
import { CURATED_FONT_NAMES } from '@googleforcreators/fonts';
import { renderWithTheme } from '@googleforcreators/test-utils';

/**
 * Internal dependencies
 */
import FontContext from '../../../../../app/font/context';
import fontsListResponse from './fontsResponse';

jest.mock('@googleforcreators/design-system', () => ({
  ...jest.requireActual('@googleforcreators/design-system'),
  Popup: ({ children, isOpen }) => (isOpen ? children : null),
}));

const fonts = fontsListResponse.map((font) => {
  return { ...font, id: font.name };
});
const availableCuratedFonts = fonts.filter(
  (font) => CURATED_FONT_NAMES.indexOf(font.name) > 0
);

function arrange(options) {
  const fontContextValues = {
    actions: {
      ensureMenuFontsLoaded: () => {},
      ensureCustomFontsLoaded: () => {},
      getCustomFonts: jest.fn(),
      getCuratedFonts: jest.fn(),
    },
  };
  const props = {
    onChange: jest.fn(),
    value: 'Roboto',
    'aria-label': 'Font family',
    options: fonts,
    primaryOptions: availableCuratedFonts,
    primaryLabel: 'Recommended',
    priorityOptions: [],
    priorityLabel: 'Recently used',
    selectedId: 'Roboto',
    placeholder: 'Roboto',
    hasSearch: true,
    ...options,
  };

  return renderWithTheme(
    <FontContext.Provider value={fontContextValues}>
      <Datalist.DropDown {...props} />
    </FontContext.Provider>
  );
}

const scrollTo = jest.fn();

describe('DropDown: Font Picker', () => {
  beforeAll(() => {
    // Mock scrollTo
    Object.defineProperty(window.Element.prototype, 'scrollTo', {
      writable: true,
      value: scrollTo,
    });
  });

  it('should render font picker title and clicking the button should open the font picker', () => {
    arrange();

    // Fire a click event.
    const selectButton = screen.getByRole('button');
    fireEvent.click(selectButton);

    // Listbox should be showing after click
    const fontsList = screen.getByRole('listbox');
    expect(fontsList).toBeInTheDocument();

    // Should render all options
    const allOptionItems = screen.getAllByRole('option');
    expect(allOptionItems).toHaveLength(availableCuratedFonts.length);
  });

  it('should mark the currently selected font', () => {
    scrollTo.mockReset();
    arrange();

    // Fire a click event.
    const selectButton = screen.getByRole('button');
    fireEvent.click(selectButton);

    // Listbox should be showing after click
    const fontsList = screen.getByRole('listbox');
    expect(fontsList).toBeInTheDocument();

    // Roboto option should be visible and have a selected checkmark
    const selectedRobotoOption = screen.getByRole('option', {
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

  it('should select the next font in the list when using the down arrow plus enter key', () => {
    const onChangeFn = jest.fn();
    arrange({ onChange: onChangeFn });

    const selectButton = screen.getByRole('button');
    fireEvent.click(selectButton);

    const fontsList = screen.getByRole('listbox');
    expect(fontsList).toBeInTheDocument();

    // focus first element in list
    fireEvent.keyDown(fontsList, {
      key: 'ArrowDown',
    });

    // focus second element in list
    fireEvent.keyDown(fontsList, {
      key: 'ArrowDown',
    });

    fireEvent.keyDown(fontsList, { key: 'Enter' });

    // The second font in the list.
    expect(onChangeFn).toHaveBeenCalledWith(availableCuratedFonts[1]);
  });

  it('should close the menu when the Esc key is pressed.', async () => {
    const onChangeFn = jest.fn();
    arrange({ onChange: onChangeFn });

    const selectButton = screen.getByRole('button');
    fireEvent.click(selectButton);

    const fontsList = screen.getByRole('listbox');
    expect(fontsList).toBeInTheDocument();

    fireEvent.keyDown(fontsList, {
      key: 'Escape',
    });

    await waitFor(() => expect(fontsList).not.toBeInTheDocument());
  });

  it('should select the previous font in the list when using the up arrow plus enter key', () => {
    const onChangeFn = jest.fn();
    arrange({ onChange: onChangeFn });

    const selectButton = screen.getByRole('button');
    fireEvent.click(selectButton);

    const fontsList = screen.getByRole('listbox');
    expect(fontsList).toBeInTheDocument();

    // Move to first element in list
    fireEvent.keyDown(fontsList, {
      key: 'ArrowDown',
    });

    // Move to second element in list
    fireEvent.keyDown(fontsList, {
      key: 'ArrowDown',
    });

    // Move to third element in list
    fireEvent.keyDown(fontsList, {
      key: 'ArrowDown',
    });

    fireEvent.keyDown(fontsList, {
      key: 'ArrowUp',
    });

    fireEvent.keyDown(fontsList, { key: 'Enter' });

    // Moving down by 2 and back 1 up should end up with the second font: Roboto Condensed.
    expect(onChangeFn).toHaveBeenCalledWith(availableCuratedFonts[1]);
  });

  it('should search and filter the list to match the results.', async () => {
    arrange();

    const selectButton = screen.getByRole('button');
    fireEvent.click(selectButton);

    expect(screen.queryAllByRole('option')).toHaveLength(
      availableCuratedFonts.length
    );

    // Search for "Ab" which is the prefix of 3 font, and the substring of another 2 fonts
    // should match all 5 fonts
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'Ab' },
    });

    await waitFor(
      () => expect(screen.queryAllByRole('option')).toHaveLength(5),
      {
        timeout: 500,
      }
    );
  });

  it('should show an empty list when the search keyword has no results.', async () => {
    arrange();

    const selectButton = screen.getByRole('button');
    fireEvent.click(selectButton);

    expect(screen.queryAllByRole('option')).toHaveLength(
      availableCuratedFonts.length
    );

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'Not a font!' },
    });

    await waitFor(
      () => expect(screen.queryByRole('option')).not.toBeInTheDocument(),
      {
        timeout: 500,
      }
    );
  });
});
