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
        disabled={true}
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
        isFlexibleValue={true}
      />
    );

    const clearButton = getByTestId('clear-search-icon');
    expect(clearButton).toBeInTheDocument();

    fireEvent.click(clearButton);

    expect(handleClearInputMock).toHaveBeenCalledTimes(1);
  });

  it('should show chevron icon by default while input is not open', () => {
    const { getByTestId } = renderWithProviders(
      <SearchInput
        ariaInputLabel={'search label'}
        ariaClearLabel={'aria label for clearing value'}
        onClick={onClickMock}
        handleClearInputValue={handleClearInputMock}
        inputValue={''}
      />
    );

    const chevron = getByTestId('chevron-search-icon');
    expect(chevron).toBeInTheDocument();
  });

  it('should still show chevron icon by default while input is not open and input has value', () => {
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

  it('should show clear icon by while input is not open and input has value if isFlexibleValue true', () => {
    const { getByTestId } = renderWithProviders(
      <SearchInput
        ariaInputLabel={'search label'}
        ariaClearLabel={'aria label for clearing value'}
        onClick={onClickMock}
        handleClearInputValue={handleClearInputMock}
        inputValue={'existing value'}
        isFlexibleValue={true}
      />
    );

    const clear = getByTestId('clear-search-icon');
    expect(clear).toBeInTheDocument();
  });

  it('should show clear icon by while input is open and input has value if isFlexibleValue true', () => {
    const { getByTestId } = renderWithProviders(
      <SearchInput
        ariaInputLabel={'search label'}
        ariaClearLabel={'aria label for clearing value'}
        onClick={onClickMock}
        handleClearInputValue={handleClearInputMock}
        inputValue={'existing value'}
        isFlexibleValue={true}
        isOpen={true}
      />
    );

    const clear = getByTestId('clear-search-icon');
    expect(clear).toBeInTheDocument();
  });

  it('should show clear icon by while input is open and input has value', () => {
    const { getByTestId } = renderWithProviders(
      <SearchInput
        ariaInputLabel={'search label'}
        ariaClearLabel={'aria label for clearing value'}
        onClick={onClickMock}
        handleClearInputValue={handleClearInputMock}
        inputValue={'existing value'}
        isOpen={true}
      />
    );

    const clear = getByTestId('clear-search-icon');
    expect(clear).toBeInTheDocument();
  });

  it('should show chevron icon by while input is open and input has no value', () => {
    const { getByTestId } = renderWithProviders(
      <SearchInput
        ariaInputLabel={'search label'}
        ariaClearLabel={'aria label for clearing value'}
        onClick={onClickMock}
        handleClearInputValue={handleClearInputMock}
        inputValue={''}
        isOpen={true}
      />
    );

    const chevron = getByTestId('chevron-search-icon');
    expect(chevron).toBeInTheDocument();
  });

  it('should not show search icon by default', () => {
    const { queryAllByTestId } = renderWithProviders(
      <SearchInput
        ariaInputLabel={'search label'}
        ariaClearLabel={'aria label for clearing value'}
        onClick={onClickMock}
        handleClearInputValue={handleClearInputMock}
        inputValue={''}
      />
    );

    const search = queryAllByTestId('search-search-icon');
    expect(search).toStrictEqual([]);
  });

  it('should show search icon if isOpen is true', () => {
    const { getByTestId } = renderWithProviders(
      <SearchInput
        ariaInputLabel={'search label'}
        ariaClearLabel={'aria label for clearing value'}
        onClick={onClickMock}
        handleClearInputValue={handleClearInputMock}
        inputValue={''}
        isOpen={true}
      />
    );

    const search = getByTestId('search-search-icon');
    expect(search).toBeInTheDocument();
  });

  it('should show search icon if isOpen is false and isFlexibleValue is true and there is an inputValue', () => {
    const { getByTestId } = renderWithProviders(
      <SearchInput
        ariaInputLabel={'search label'}
        ariaClearLabel={'aria label for clearing value'}
        onClick={onClickMock}
        handleClearInputValue={handleClearInputMock}
        inputValue={'existing value'}
        isFlexibleValue={true}
      />
    );

    const search = getByTestId('search-search-icon');
    expect(search).toBeInTheDocument();
  });

  it('should not show search icon if isOpen is false and isFlexibleValue is true and there is no inputValue', () => {
    const { queryAllByTestId } = renderWithProviders(
      <SearchInput
        ariaInputLabel={'search label'}
        ariaClearLabel={'aria label for clearing value'}
        onClick={onClickMock}
        handleClearInputValue={handleClearInputMock}
        inputValue={''}
        isFlexibleValue={true}
      />
    );

    const search = queryAllByTestId('search-search-icon');
    expect(search).toStrictEqual([]);
  });
});
