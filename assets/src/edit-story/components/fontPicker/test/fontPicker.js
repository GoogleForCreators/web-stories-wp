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

async function fontPicker() {
  const getAllFontsPromise = Promise.resolve(fontsListResponse);
  const apiContextValue = {
    actions: {
      getAllFonts: () => getAllFontsPromise,
    },
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
  it('should render font picker title and clicking the button should open the font picker', async () => {
    const { getByRole, getByLabelText, getAllByRole } = await fontPicker();

    // Fire a click event.
    const selectButton = getByRole('button');
    act(() => fireEvent.click(selectButton));

    // Listbox should be showing after click
    const fontsList = getByRole('listbox');
    expect(fontsList).toBeInTheDocument();

    // Search fonts input should be rendered
    const searchInputText = getByLabelText('Search Fonts');
    expect(searchInputText).toBeInTheDocument();

    // Should render all 35 options
    const allOptionItems = getAllByRole('option');
    expect(allOptionItems).toHaveLength(fontsListResponse.length);
  });

  it('open the font picker, types on search box should have two fonts list that starts with search value and including search value', async () => {
    const { getByRole, getByLabelText, getAllByRole } = await fontPicker();

    const searchValue = 'al';

    // Fire a click event.
    const selectButton = getByRole('button');
    act(() => fireEvent.click(selectButton));

    // Search font input and types al
    const searchInputText = getByLabelText('Search Fonts');
    fireEvent.change(searchInputText, { target: { value: searchValue } });

    // There should be two separate font lists
    const fontLists = getAllByRole('listbox');
    expect(fontLists).toHaveLength(2);

    // Should render all starts with fonts and including fonts
    const otherFonts = fontsListResponse.filter(({ name }) =>
      name.toLowerCase().startsWith(searchValue.toLowerCase())
    );
    const includeSearchFonts = fontsListResponse.filter(
      ({ name }) => name.toLowerCase().indexOf(searchValue.toLowerCase()) > 0
    );
    const allOptionItems = getAllByRole('option');
    expect(allOptionItems).toHaveLength(
      otherFonts.length + includeSearchFonts.length
    );
  });

  it('types on search box, press enter should select the first font', async () => {
    const {
      getByRole,
      queryByRole,
      getByLabelText,
      getAllByText,
    } = await fontPicker();

    const searchValue = 'al';

    // Fire a click event.
    const selectButton = getByRole('button');
    act(() => fireEvent.click(selectButton));

    // Search font input and types al
    const searchInputText = getByLabelText('Search Fonts');
    act(() =>
      fireEvent.change(searchInputText, { target: { value: searchValue } })
    );

    expect(searchInputText.value).toBe(searchValue);

    // Press enter
    act(() =>
      fireEvent.keyDown(searchInputText, {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
      })
    );

    // Now list should be there, the picker should be closed
    const fontsLists = queryByRole('listbox');
    expect(fontsLists).toBeNull();

    // Open the font picker again
    act(() => fireEvent.click(selectButton));

    const selectedFont = 'Alfa Slab One';

    const allOptionItems = getAllByText(selectedFont);
    expect(allOptionItems).toHaveLength(2);
  });

  it('should render no match available', async () => {
    const { getByRole, queryByText, getByLabelText } = await fontPicker();

    const searchValue = 'abcdef';

    // Fire a click event.
    const selectButton = getByRole('button');
    act(() => fireEvent.click(selectButton));

    // Search font input and types al
    const searchInputText = getByLabelText('Search Fonts');
    act(() =>
      fireEvent.change(searchInputText, { target: { value: searchValue } })
    );

    expect(searchInputText.value).toBe(searchValue);

    const noMatchText = 'No matches found';

    const noMatchITem = queryByText(noMatchText);
    expect(noMatchITem).toBeInTheDocument();
  });
});
