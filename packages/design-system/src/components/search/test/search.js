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
import { fireEvent, waitFor, act } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { renderWithProviders } from '../../../testUtils/renderWithProviders';
import { basicDropDownOptions } from '../../../testUtils/sampleData';
import { Search } from '..';

describe('Search <Search />', () => {
  // Mock scrollTo
  const scrollTo = jest.fn();
  Object.defineProperty(window.Element.prototype, 'scrollTo', {
    writable: true,
    value: scrollTo,
  });

  jest.useFakeTimers();

  it('should render a closed <Search /> menu with an input field on default', () => {
    const { getByRole, queryAllByRole } = renderWithProviders(
      <Search options={basicDropDownOptions} ariaInputLabel="label" />
    );

    const input = getByRole('combobox');
    expect(input).toBeInTheDocument();

    const menu = queryAllByRole('listbox');
    expect(menu).toStrictEqual([]);
  });

  it('should show placeholder value when no selected value is found', () => {
    const { getByPlaceholderText } = renderWithProviders(
      <Search options={basicDropDownOptions} placeholder="select a value" />
    );

    const placeholder = getByPlaceholderText('select a value');
    expect(placeholder).toBeInTheDocument();
  });

  it("should show selectedValue's associated label in input when selectedValue is present", () => {
    const container = renderWithProviders(
      <Search
        options={basicDropDownOptions}
        placeholder="select a value"
        ariaInputLabel="my aria label"
        selectedValue={basicDropDownOptions[2]}
      />
    );

    const input = container.getByDisplayValue(basicDropDownOptions[2].label);
    expect(input).toBeInTheDocument();
  });

  it('should allow inputState to update outside of options in menu', async () => {
    const container = renderWithProviders(
      <Search
        options={basicDropDownOptions}
        placeholder="select a value"
        ariaInputLabel="my label"
      />
    );

    const input = container.getByPlaceholderText('select a value');

    act(() => {
      fireEvent.change(input, { target: { value: 'bruce wayne' } });
    });

    await waitFor(() => {
      expect(container.getByDisplayValue('bruce wayne')).toBeInTheDocument();
    });

    expect(input).toBeInTheDocument();
  });

  it('should show <Search /> menu when input has 1 or more characters', () => {
    const { getByRole } = renderWithProviders(
      <Search
        emptyText="No options available"
        options={basicDropDownOptions}
        ariaInputLabel="label"
      />
    );

    const input = getByRole('combobox');
    expect(input).toBeInTheDocument();
    act(() => {
      fireEvent.click(input);
      fireEvent.change(input, { target: { value: 'bruce' } });

      // wait for debounced callback to allow a select click handler to process
      jest.runOnlyPendingTimers();
    });

    const menu = getByRole('listbox');
    expect(menu).toBeInTheDocument();
  });

  it('should show an active icon on list item that is active', () => {
    const { getByRole } = renderWithProviders(
      <Search
        emptyText="No options available"
        ariaInputLabel="label"
        isKeepMenuOpenOnSelection={false}
        options={basicDropDownOptions}
        selectedValue={basicDropDownOptions[2]}
      />
    );

    const input = getByRole('combobox');
    expect(input).toBeInTheDocument();

    act(() => {
      fireEvent.click(input);

      // wait for debounced callback to allow a select click handler to process
      jest.runOnlyPendingTimers();
    });

    const activeMenuItem = getByRole('option', {
      name: `Selected ${basicDropDownOptions[2].label}`,
    });
    expect(activeMenuItem).toBeInTheDocument();
  });

  // Mouse events
  it('should not expand menu when disabled is true', () => {
    const { getByRole, queryAllByRole } = renderWithProviders(
      <Search
        options={basicDropDownOptions}
        ariaInputLabel="my label"
        disabled
      />
    );

    const input = getByRole('combobox');
    expect(input).toBeInTheDocument();

    act(() => {
      fireEvent.click(input);

      // wait for debounced callback to allow a select click handler to process
      jest.runOnlyPendingTimers();
    });

    const menu = queryAllByRole('listbox');
    expect(menu).toStrictEqual([]);
  });

  it('should not expand menu with selected value when disabled is true', () => {
    const { getByRole, queryAllByRole } = renderWithProviders(
      <Search
        options={basicDropDownOptions}
        selectedValue={basicDropDownOptions[2]}
        ariaInputLabel="my label"
        disabled
      />
    );

    const input = getByRole('combobox');
    expect(input).toBeInTheDocument();

    act(() => {
      fireEvent.click(input);

      // wait for debounced callback to allow a select click handler to process
      jest.runOnlyPendingTimers();
    });

    const menu = queryAllByRole('listbox');
    expect(menu).toStrictEqual([]);
  });

  it('should not trigger onMenuItemClick when "enter" is hit but input has no value', () => {
    const onClickMock = jest.fn();

    const { getByRole } = renderWithProviders(
      <Search
        options={basicDropDownOptions}
        ariaInputLabel="my dropDown label"
        onMenuItemClick={onClickMock}
        selectedValue={basicDropDownOptions[2]}
      />
    );

    // Fire click event
    const input = getByRole('combobox');
    act(() => {
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: '' } });
      // wait for debounced callback to allow a select click handler to process
      jest.runOnlyPendingTimers();
    });
    act(() => {
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    });

    expect(onClickMock).toHaveBeenCalledTimes(0);
  });

  it('should trigger onMenuItemClick when "enter" is hit and input has value', () => {
    const onClickMock = jest.fn();

    const { getByRole } = renderWithProviders(
      <Search
        options={basicDropDownOptions}
        ariaInputLabel="my dropDown label"
        onMenuItemClick={onClickMock}
      />
    );

    // Fire click event
    const input = getByRole('combobox');
    act(() => {
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'tapir' } });
      // wait for debounced callback to allow a select click handler to process
      jest.runOnlyPendingTimers();
    });
    act(() => {
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    });

    // first prop we get back is the event
    expect(onClickMock).toHaveBeenCalledWith(expect.anything(), {
      label: 'tapir',
      value: 'tapir',
    });

    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it('should trigger onMenuItemClick from menu when input has value and menu can be seen', () => {
    const onClickMock = jest.fn();

    const { getByRole, getAllByRole } = renderWithProviders(
      <Search
        options={basicDropDownOptions}
        ariaInputLabel="my dropDown label"
        onMenuItemClick={onClickMock}
      />
    );

    // Fire click event
    const input = getByRole('combobox');

    act(() => {
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'capybara' } });

      // wait for debounced callback to allow a select click handler to process
      jest.runOnlyPendingTimers();
    });

    const menu = getByRole('listbox');
    expect(menu).toBeInTheDocument();

    const menuItems = getAllByRole('option');
    expect(menuItems).toHaveLength(12);

    fireEvent.click(menuItems[2]);

    // first prop we get back is the event
    expect(onClickMock).toHaveBeenCalledWith(
      expect.anything(),
      basicDropDownOptions[2]
    );

    expect(onClickMock).toHaveBeenCalledTimes(1);
  });
});

// TODO: Keyboard events need mock useKeyDownEffect
// https://github.com/google/web-stories-wp/issues/5764
