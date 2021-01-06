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
import TypeaheadInput from '../input';

describe('Typeahead <Input />', () => {
  const onClickMock = jest.fn();
  const handleClearInputMock = jest.fn();

  it('should render a <TypeaheadInput /> combobox by default', () => {
    const { getByRole } = renderWithProviders(
      <TypeaheadInput
        ariaInputLabel={'typeahead label'}
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
      <TypeaheadInput
        ariaInputLabel={'typeahead label'}
        ariaClearLabel={'aria label for clearing value'}
        onClick={onClickMock}
        handleClearInputValue={handleClearInputMock}
        placeholder={'typeahead placeholder'}
        inputValue={''}
        disabled={true}
      />
    );

    const input = getByPlaceholderText('typeahead placeholder');
    fireEvent.click(input);

    expect(onClickMock).toHaveBeenCalledTimes(0);
  });

  it('should trigger onClickMock on click if input is not disabled', () => {
    const { getByPlaceholderText } = renderWithProviders(
      <TypeaheadInput
        ariaInputLabel={'typeahead label'}
        ariaClearLabel={'aria label for clearing value'}
        onClick={onClickMock}
        handleClearInputValue={handleClearInputMock}
        inputValue={''}
        placeholder={'typeahead placeholder'}
      />
    );

    const input = getByPlaceholderText('typeahead placeholder');
    fireEvent.click(input);

    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it('should trigger handleClearInputMock on click of clear button if input has content', () => {
    const { getByTestId } = renderWithProviders(
      <TypeaheadInput
        ariaInputLabel={'typeahead label'}
        ariaClearLabel={'aria label for clearing value'}
        onClick={onClickMock}
        handleClearInputValue={handleClearInputMock}
        inputValue={'my input value'}
        placeholder={'typeahead placeholder'}
        isFlexibleValue={true}
      />
    );

    const clearButton = getByTestId('clear-typeahead-icon');
    expect(clearButton).toBeInTheDocument();

    fireEvent.click(clearButton);

    expect(handleClearInputMock).toHaveBeenCalledTimes(1);
  });

  it('should show chevron icon by default while input is not open', () => {
    const { getByTestId } = renderWithProviders(
      <TypeaheadInput
        ariaInputLabel={'typeahead label'}
        ariaClearLabel={'aria label for clearing value'}
        onClick={onClickMock}
        handleClearInputValue={handleClearInputMock}
        inputValue={''}
      />
    );

    const chevron = getByTestId('chevron-typeahead-icon');
    expect(chevron).toBeInTheDocument();
  });

  it('should still show chevron icon by default while input is not open and input has value', () => {
    const { getByTestId } = renderWithProviders(
      <TypeaheadInput
        ariaInputLabel={'typeahead label'}
        ariaClearLabel={'aria label for clearing value'}
        onClick={onClickMock}
        handleClearInputValue={handleClearInputMock}
        inputValue={'existing value'}
      />
    );

    const chevron = getByTestId('chevron-typeahead-icon');
    expect(chevron).toBeInTheDocument();
  });

  it('should show clear icon by while input is not open and input has value if isFlexibleValue true', () => {
    const { getByTestId } = renderWithProviders(
      <TypeaheadInput
        ariaInputLabel={'typeahead label'}
        ariaClearLabel={'aria label for clearing value'}
        onClick={onClickMock}
        handleClearInputValue={handleClearInputMock}
        inputValue={'existing value'}
        isFlexibleValue={true}
      />
    );

    const clear = getByTestId('clear-typeahead-icon');
    expect(clear).toBeInTheDocument();
  });

  it('should show clear icon by while input is open and input has value if isFlexibleValue true', () => {
    const { getByTestId } = renderWithProviders(
      <TypeaheadInput
        ariaInputLabel={'typeahead label'}
        ariaClearLabel={'aria label for clearing value'}
        onClick={onClickMock}
        handleClearInputValue={handleClearInputMock}
        inputValue={'existing value'}
        isFlexibleValue={true}
        isOpen={true}
      />
    );

    const clear = getByTestId('clear-typeahead-icon');
    expect(clear).toBeInTheDocument();
  });

  it('should show clear icon by while input is open and input has value', () => {
    const { getByTestId } = renderWithProviders(
      <TypeaheadInput
        ariaInputLabel={'typeahead label'}
        ariaClearLabel={'aria label for clearing value'}
        onClick={onClickMock}
        handleClearInputValue={handleClearInputMock}
        inputValue={'existing value'}
        isOpen={true}
      />
    );

    const clear = getByTestId('clear-typeahead-icon');
    expect(clear).toBeInTheDocument();
  });

  it('should show chevron icon by while input is open and input has no value', () => {
    const { getByTestId } = renderWithProviders(
      <TypeaheadInput
        ariaInputLabel={'typeahead label'}
        ariaClearLabel={'aria label for clearing value'}
        onClick={onClickMock}
        handleClearInputValue={handleClearInputMock}
        inputValue={''}
        isOpen={true}
      />
    );

    const chevron = getByTestId('chevron-typeahead-icon');
    expect(chevron).toBeInTheDocument();
  });
});
