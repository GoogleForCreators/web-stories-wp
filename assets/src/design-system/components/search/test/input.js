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

import { fireEvent } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { renderWithProviders } from '../../../testUtils/renderWithProviders';
import SearchInput from '../input';
import { noop } from '../../../utils';

describe('Search <Input />', () => {
  const onClickMock = jest.fn();
  const handleClearInputMock = jest.fn();

  beforeEach(jest.clearAllMocks);

  it('should render a <SearchInput /> searchbox by default', () => {
    const { getByRole } = renderWithProviders(
      <SearchInput
        ariaInputLabel="search label"
        ariaClearLabel="aria label for clearing value"
        onClick={onClickMock}
        handleClearInput={handleClearInputMock}
        inputValue=""
        onChange={noop}
      />
    );

    const input = getByRole('searchbox');
    expect(input).toBeInTheDocument();
  });

  it('should render a <SearchInput /> combobox if it has a list id', () => {
    const { getByRole } = renderWithProviders(
      <SearchInput
        ariaInputLabel="search label"
        ariaClearLabel="aria label for clearing value"
        onClick={onClickMock}
        handleClearInput={handleClearInputMock}
        inputValue=""
        listId={1}
        onChange={noop}
      />
    );

    const input = getByRole('combobox');
    expect(input).toBeInTheDocument();
  });

  it('should not trigger onClickMock on click if input is disabled', () => {
    const { getByPlaceholderText } = renderWithProviders(
      <SearchInput
        ariaInputLabel="search label"
        ariaClearLabel="aria label for clearing value"
        onClick={onClickMock}
        handleClearInput={handleClearInputMock}
        placeholder="search placeholder"
        inputValue=""
        disabled
        onChange={noop}
      />
    );

    const input = getByPlaceholderText('search placeholder');
    fireEvent.click(input);

    expect(onClickMock).toHaveBeenCalledTimes(0);
  });

  it('should trigger handleClearInputMock on click of clear button if input has content', () => {
    const { getByTestId } = renderWithProviders(
      <SearchInput
        ariaInputLabel="search label"
        ariaClearLabel="aria label for clearing value"
        onClick={onClickMock}
        handleClearInput={handleClearInputMock}
        inputValue="my input value"
        placeholder="search placeholder"
        onChange={noop}
      />
    );

    const clearButton = getByTestId('clear-search-icon');
    expect(clearButton).toBeInTheDocument();

    fireEvent.click(clearButton);

    expect(handleClearInputMock).toHaveBeenCalledTimes(1);
  });
});
