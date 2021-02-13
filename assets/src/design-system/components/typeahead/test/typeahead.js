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
import { fireEvent, waitFor } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { renderWithProviders } from '../../../testUtils/renderWithProviders';
import { basicDropDownOptions } from '../../../testUtils/sampleData';
import { Typeahead } from '../';

describe('Typeahead <Typeahead />', () => {
  // Mock scrollTo
  const scrollTo = jest.fn();
  Object.defineProperty(window.Element.prototype, 'scrollTo', {
    writable: true,
    value: scrollTo,
  });

  jest.useFakeTimers();

  it('should render a closed <Typeahead /> menu with an input field on default', () => {
    const { getByRole, queryAllByRole } = renderWithProviders(
      <Typeahead options={basicDropDownOptions} ariaInputLabel={'label'} />
    );

    const input = getByRole('combobox');
    expect(input).toBeInTheDocument();

    const menu = queryAllByRole('listbox');
    expect(menu).toStrictEqual([]);
  });

  it('should show placeholder value when no selected value is found', () => {
    const { getByPlaceholderText } = renderWithProviders(
      <Typeahead
        options={basicDropDownOptions}
        placeholder={'select a value'}
      />
    );

    const placeholder = getByPlaceholderText('select a value');
    expect(placeholder).toBeInTheDocument();
  });

  it("should show selectedValue's associated label in input when selectedValue is present", () => {
    const container = renderWithProviders(
      <Typeahead
        options={basicDropDownOptions}
        placeholder={'select a value'}
        ariaInputLabel={'my aria label'}
        selectedValue={basicDropDownOptions[2].value}
      />
    );

    const input = container.getByDisplayValue(basicDropDownOptions[2].label);
    expect(input).toBeInTheDocument();
  });

  it('should show inputValue as selectedValue regardless of if selectedValue is found in options', async () => {
    const container = renderWithProviders(
      <Typeahead
        options={basicDropDownOptions}
        placeholder={'select a value'}
        ariaInputLabel={'my label'}
      />
    );

    const input = container.getByPlaceholderText('select a value');

    fireEvent.change(input, { target: { value: 'bruce wayne' } });

    await waitFor(() => {
      expect(container.getByDisplayValue('bruce wayne')).toBeInTheDocument();
    });

    expect(input).toBeInTheDocument();
  });

  it('should show <Typeahead /> menu when input is clicked', () => {
    const { getByRole } = renderWithProviders(
      <Typeahead
        emptyText={'No options available'}
        options={basicDropDownOptions}
        ariaInputLabel={'label'}
      />
    );

    const input = getByRole('combobox');
    expect(input).toBeInTheDocument();

    fireEvent.click(input);

    const menu = getByRole('listbox');
    expect(menu).toBeInTheDocument();
  });

  it('should show an active icon on list item that is active', () => {
    const { getByRole } = renderWithProviders(
      <Typeahead
        emptyText={'No options available'}
        ariaInputLabel={'label'}
        isKeepMenuOpenOnSelection={false}
        options={basicDropDownOptions}
        selectedValue={basicDropDownOptions[2].value}
      />
    );

    const input = getByRole('combobox');
    expect(input).toBeInTheDocument();
    fireEvent.click(input);

    const activeMenuItem = getByRole('option', {
      name: `Selected ${basicDropDownOptions[2].label}`,
    });
    expect(activeMenuItem).toBeInTheDocument();

    // We can't really validate this number anyway in JSDom (no actual
    // layout is happening), so just expect it to be called
    expect(scrollTo).toHaveBeenCalledWith(0, expect.any(Number));
  });

  // Mouse events
  it('should not expand menu when disabled is true', () => {
    const { getByRole, queryAllByRole } = renderWithProviders(
      <Typeahead
        options={basicDropDownOptions}
        ariaInputLabel={'my label'}
        disabled={true}
      />
    );

    const input = getByRole('combobox');
    expect(input).toBeInTheDocument();

    fireEvent.click(input);

    const menu = queryAllByRole('listbox');
    expect(menu).toStrictEqual([]);
  });

  it('should trigger onMenuItemClick when item is clicked', () => {
    const onClickMock = jest.fn();

    const { getByRole, getAllByRole } = renderWithProviders(
      <Typeahead
        options={basicDropDownOptions}
        selectedValue={null}
        ariaInputLabel={'my dropDown label'}
        onMenuItemClick={onClickMock}
      />
    );

    // Fire click event
    const input = getByRole('combobox');
    fireEvent.click(input);

    const menu = getByRole('listbox');
    expect(menu).toBeInTheDocument();

    const menuItems = getAllByRole('option');
    expect(menuItems).toHaveLength(12);

    fireEvent.click(menuItems[2]);

    // first prop we get back is the event
    expect(onClickMock).toHaveBeenCalledWith(
      expect.anything(),
      basicDropDownOptions[2].value
    );

    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it('should close active menu when input is clicked', () => {
    const wrapper = renderWithProviders(
      <Typeahead
        ariaInputLabel={'label'}
        options={basicDropDownOptions}
        selectedValue={basicDropDownOptions[1].value}
      />
    );
    const input = wrapper.getByRole('combobox');
    fireEvent.click(input);

    const menu = wrapper.getByRole('listbox');
    expect(menu).toBeInTheDocument();

    // wait for debounced callback to allow a select click handler to process
    jest.runOnlyPendingTimers();

    fireEvent.click(input);

    expect(wrapper.queryByRole('listbox')).not.toBeInTheDocument();
  });
});

// TODO: Keyboard events need mock useKeyDownEffect
// https://github.com/google/web-stories-wp/issues/5764
