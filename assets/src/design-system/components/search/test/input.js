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

describe('Search <Input />', () => {
  const onClickMock = jest.fn();
  const handleClearInputMock = jest.fn();

  beforeEach(jest.clearAllMocks);

  it('should render a <SearchInput /> combobox by default', () => {
    const { getByRole } = renderWithProviders(
      <SearchInput
        ariaInputLabel={'search label'}
        ariaClearLabel={'aria label for clearing value'}
        onClick={onClickMock}
        handleClearInputValue={handleClearInputMock}
        inputValue={''}
      />
    );

    const input = getByRole('combobox');
    expect(input).toBeInTheDocument();
  });

  it('should not trigger onClickMock on click if input is disabled', () => {
    const { getByPlaceholderText } = renderWithProviders(
      <SearchInput
        ariaInputLabel={'search label'}
        ariaClearLabel={'aria label for clearing value'}
        onClick={onClickMock}
        handleClearInputValue={handleClearInputMock}
        placeholder={'search placeholder'}
        inputValue={''}
        disabled
      />
    );

    const input = getByPlaceholderText('search placeholder');
    fireEvent.click(input);

    expect(onClickMock).toHaveBeenCalledTimes(0);
  });

  it('should trigger onClickMock on click if input is not disabled', () => {
    const { getByPlaceholderText } = renderWithProviders(
      <SearchInput
        ariaInputLabel={'search label'}
        ariaClearLabel={'aria label for clearing value'}
        onClick={onClickMock}
        handleClearInputValue={handleClearInputMock}
        inputValue={''}
        placeholder={'search placeholder'}
      />
    );

    const input = getByPlaceholderText('search placeholder');
    fireEvent.click(input);

    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it('should trigger handleClearInputMock on click of clear button if input has content', () => {
    const { getByTestId } = renderWithProviders(
      <SearchInput
        ariaInputLabel={'search label'}
        ariaClearLabel={'aria label for clearing value'}
        onClick={onClickMock}
        handleClearInputValue={handleClearInputMock}
        inputValue={'my input value'}
        placeholder={'search placeholder'}
      />
    );

    const clearButton = getByTestId('clear-search-icon');
    expect(clearButton).toBeInTheDocument();

    fireEvent.click(clearButton);

    expect(handleClearInputMock).toHaveBeenCalledTimes(1);
  });

  it('should show chevron icon when there is an input value and menu is expanded', () => {
    const { queryAllByTestId } = renderWithProviders(
      <SearchInput
        ariaInputLabel={'search label'}
        ariaClearLabel={'aria label for clearing value'}
        onClick={onClickMock}
        handleClearInputValue={handleClearInputMock}
        inputValue={'e'}
        isOpen
      />
    );

    const chevron = queryAllByTestId('chevron-search-icon');
    expect(chevron).toStrictEqual([]);
  });

  it('should show chevron when input is not open', () => {
    const { getByTestId } = renderWithProviders(
      <SearchInput
        ariaInputLabel={'search label'}
        ariaClearLabel={'aria label for clearing value'}
        onClick={onClickMock}
        handleClearInputValue={handleClearInputMock}
        inputValue={'existing value'}
      />
    );

    const chevron = getByTestId('chevron-search-icon');
    expect(chevron).toBeInTheDocument();
  });

  it('should show clear icon by while input is open and input has value', () => {
    const { getByTestId } = renderWithProviders(
      <SearchInput
        ariaInputLabel={'search label'}
        ariaClearLabel={'aria label for clearing value'}
        onClick={onClickMock}
        handleClearInputValue={handleClearInputMock}
        inputValue={'existing value'}
        isOpen
      />
    );

    const clear = getByTestId('clear-search-icon');
    expect(clear).toBeInTheDocument();
  });
});
