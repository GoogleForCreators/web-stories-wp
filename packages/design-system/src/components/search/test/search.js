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
import { fireEvent, waitFor, act, screen } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { renderWithProviders } from '../../../testUtils/renderWithProviders';
import { basicDropDownOptions } from '../../../testUtils/sampleData';
import Search from '../search';

const scrollTo = jest.fn();

describe('Search <Search />', () => {
  beforeAll(() => {
    // Mock scrollTo
    Object.defineProperty(window.Element.prototype, 'scrollTo', {
      writable: true,
      value: scrollTo,
    });

    jest.useFakeTimers();
  });

  it('should render a closed <Search /> menu with an input field on default', () => {
    renderWithProviders(
      <Search options={basicDropDownOptions} ariaInputLabel="label" />
    );

    const input = screen.getByRole('combobox');
    expect(input).toBeInTheDocument();

    const menu = screen.queryAllByRole('listbox');
    expect(menu).toStrictEqual([]);
  });

  it('should show placeholder value when no selected value is found', () => {
    renderWithProviders(
      <Search options={basicDropDownOptions} placeholder="select a value" />
    );

    const placeholder = screen.getByPlaceholderText('select a value');
    expect(placeholder).toBeInTheDocument();
  });

  it("should show selectedValue's associated label in input when selectedValue is present", () => {
    renderWithProviders(
      <Search
        options={basicDropDownOptions}
        placeholder="select a value"
        ariaInputLabel="my aria label"
        selectedValue={basicDropDownOptions[2]}
      />
    );

    const input = screen.getByDisplayValue(basicDropDownOptions[2].label);
    expect(input).toBeInTheDocument();
  });

  it('should allow inputState to update outside of options in menu', async () => {
    renderWithProviders(
      <Search
        options={basicDropDownOptions}
        placeholder="select a value"
        ariaInputLabel="my label"
      />
    );

    const input = screen.getByPlaceholderText('select a value');

    fireEvent.change(input, { target: { value: 'bruce wayne' } });

    await waitFor(() => {
      expect(screen.getByDisplayValue('bruce wayne')).toBeInTheDocument();
    });

    expect(input).toBeInTheDocument();
  });

  it('should show <Search /> menu when input has 1 or more characters', () => {
    renderWithProviders(
      <Search
        emptyText="No options available"
        options={basicDropDownOptions}
        ariaInputLabel="label"
      />
    );

    const input = screen.getByRole('combobox');
    expect(input).toBeInTheDocument();

    fireEvent.click(input);
    fireEvent.change(input, { target: { value: 'bruce' } });

    act(() => {
      // wait for debounced callback to allow a select click handler to process
      jest.runOnlyPendingTimers();
    });

    const menu = screen.getByRole('listbox');
    expect(menu).toBeInTheDocument();
  });

  it('should show an active icon on list item that is active', () => {
    renderWithProviders(
      <Search
        emptyText="No options available"
        ariaInputLabel="label"
        isKeepMenuOpenOnSelection={false}
        options={basicDropDownOptions}
        selectedValue={basicDropDownOptions[2]}
      />
    );

    const input = screen.getByRole('combobox');
    expect(input).toBeInTheDocument();

    fireEvent.click(input);

    act(() => {
      // wait for debounced callback to allow a select click handler to process
      jest.runOnlyPendingTimers();
    });

    const activeMenuItem = screen.getByRole('option', {
      name: `Selected ${basicDropDownOptions[2].label}`,
    });
    expect(activeMenuItem).toBeInTheDocument();
  });

  // Mouse events
  it('should not expand menu when disabled is true', () => {
    renderWithProviders(
      <Search
        options={basicDropDownOptions}
        ariaInputLabel="my label"
        disabled
      />
    );

    const input = screen.getByRole('combobox');
    expect(input).toBeInTheDocument();

    fireEvent.click(input);

    act(() => {
      // wait for debounced callback to allow a select click handler to process
      jest.runOnlyPendingTimers();
    });

    const menu = screen.queryAllByRole('listbox');
    expect(menu).toStrictEqual([]);
  });

  it('should not expand menu with selected value when disabled is true', () => {
    renderWithProviders(
      <Search
        options={basicDropDownOptions}
        selectedValue={basicDropDownOptions[2]}
        ariaInputLabel="my label"
        disabled
      />
    );

    const input = screen.getByRole('combobox');
    expect(input).toBeInTheDocument();

    fireEvent.click(input);

    act(() => {
      // wait for debounced callback to allow a select click handler to process
      jest.runOnlyPendingTimers();
    });

    const menu = screen.queryAllByRole('listbox');
    expect(menu).toStrictEqual([]);
  });

  it('should not trigger onMenuItemClick when "enter" is hit but input has no value', () => {
    const onClickMock = jest.fn();

    renderWithProviders(
      <Search
        options={basicDropDownOptions}
        ariaInputLabel="my dropDown label"
        onMenuItemClick={onClickMock}
        selectedValue={basicDropDownOptions[2]}
      />
    );

    // Fire click event
    const input = screen.getByRole('combobox');

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '' } });

    act(() => {
      // wait for debounced callback to allow a select click handler to process
      jest.runOnlyPendingTimers();
    });

    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(onClickMock).toHaveBeenCalledTimes(0);
  });

  it('should trigger onMenuItemClick when "enter" is hit and input has value', () => {
    const onClickMock = jest.fn();

    renderWithProviders(
      <Search
        options={basicDropDownOptions}
        ariaInputLabel="my dropDown label"
        onMenuItemClick={onClickMock}
      />
    );

    // Fire click event
    const input = screen.getByRole('combobox');

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'tapir' } });

    act(() => {
      // wait for debounced callback to allow a select click handler to process
      jest.runOnlyPendingTimers();
    });

    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    // first prop we get back is the event
    expect(onClickMock).toHaveBeenCalledWith(expect.anything(), {
      label: 'tapir',
      value: 'tapir',
    });

    expect(onClickMock).toHaveBeenCalledOnce();
  });

  it('should trigger onMenuItemClick from menu when input has value and menu can be seen', () => {
    const onClickMock = jest.fn();

    renderWithProviders(
      <Search
        options={basicDropDownOptions}
        ariaInputLabel="my dropDown label"
        onMenuItemClick={onClickMock}
      />
    );

    // Fire click event
    const input = screen.getByRole('combobox');

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'capybara' } });

    act(() => {
      // wait for debounced callback to allow a select click handler to process
      jest.runOnlyPendingTimers();
    });

    const menu = screen.getByRole('listbox');
    expect(menu).toBeInTheDocument();

    const menuItems = screen.getAllByRole('option');
    expect(menuItems).toHaveLength(12);

    fireEvent.click(menuItems[2]);

    // first prop we get back is the event
    expect(onClickMock).toHaveBeenCalledWith(
      expect.anything(),
      basicDropDownOptions[2]
    );

    expect(onClickMock).toHaveBeenCalledOnce();
  });
});

// TODO: Keyboard events need mock useKeyDownEffect
// https://github.com/googleforcreators/web-stories-wp/issues/5764
