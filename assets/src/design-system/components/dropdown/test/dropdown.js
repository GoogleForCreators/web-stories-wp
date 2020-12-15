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
import { Dropdown } from '../';
import { basicDropdownItems } from '../stories/sampleData';

// TODO: scrolling tests, keydown tests
describe('Dropdown <Dropdown />', () => {
  const onClickMock = jest.fn();

  it('should render a closed <Dropdown /> menu with a select button on default', () => {
    const { getByRole, queryAllByRole } = renderWithProviders(
      <Dropdown
        emptyText={'No options available'}
        items={basicDropdownItems}
        hint={'default hint text'}
        placeholder={'select a value'}
        dropdownLabel={'label'}
        isKeepMenuOpenOnSelection={false}
        isRTL={false}
        disabled={false}
        selectedValue={null}
        onMenuItemClick={onClickMock}
      />
    );

    const Select = getByRole('button');
    expect(Select).toBeDefined();

    const Menu = queryAllByRole('listbox');
    expect(Menu).toHaveLength(0);
  });

  it('should show <Dropdown /> menu when a select button is clicked', () => {
    const wrapper = renderWithProviders(
      <Dropdown
        emptyText={'No options available'}
        items={basicDropdownItems}
        hint={'default hint text'}
        placeholder={'select a value'}
        dropdownLabel={'label'}
        isKeepMenuOpenOnSelection={false}
        isRTL={false}
        disabled={false}
        selectedValue={null}
        onMenuItemClick={onClickMock}
      />
    );

    const Select = wrapper.getByRole('button');

    fireEvent.click(Select);

    expect(wrapper.queryAllByRole('listbox')).toHaveLength(1);
  });

  it('should show placeholder value when no selected value is found', () => {
    const { getByText } = renderWithProviders(
      <Dropdown
        emptyText={'No options available'}
        items={basicDropdownItems}
        hint={'default hint text'}
        placeholder={'select a value'}
        dropdownLabel={'label'}
        isKeepMenuOpenOnSelection={false}
        isRTL={false}
        disabled={false}
        selectedValue={null}
        onMenuItemClick={onClickMock}
      />
    );

    const Placeholder = getByText('select a value');
    expect(Placeholder).toBeDefined();
  });

  it("should show selectedValue's associated label when selectedValue is present", () => {
    const { getByText } = renderWithProviders(
      <Dropdown
        emptyText={'No options available'}
        items={basicDropdownItems}
        hint={'default hint text'}
        placeholder={'select a value'}
        dropdownLabel={'label'}
        isKeepMenuOpenOnSelection={false}
        isRTL={false}
        disabled={false}
        selectedValue={basicDropdownItems[2].value}
        onMenuItemClick={onClickMock}
      />
    );

    const Select = getByText(basicDropdownItems[2].label);
    expect(Select).toBeDefined();
  });

  it("should show placeholder when selectedValue's associated label cannot be found", () => {
    const { getByText } = renderWithProviders(
      <Dropdown
        emptyText={'No options available'}
        items={basicDropdownItems}
        hint={'default hint text'}
        placeholder={'select a value'}
        dropdownLabel={'label'}
        isKeepMenuOpenOnSelection={false}
        isRTL={false}
        disabled={false}
        selectedValue={'value that is not found in items'}
        onMenuItemClick={onClickMock}
      />
    );

    const Select = getByText('select a value');
    expect(Select).toBeDefined();
  });

  it('should show label value when provided', () => {
    const { getByText } = renderWithProviders(
      <Dropdown
        items={basicDropdownItems}
        placeholder={'select a value'}
        dropdownLabel={'my label'}
        onMenuItemClick={onClickMock}
      />
    );

    const Label = getByText('my label');
    expect(Label).toBeDefined();
  });

  it('should trigger onMenuItemClick when item is clicked', () => {
    const wrapper = renderWithProviders(
      <Dropdown
        items={basicDropdownItems}
        selectedValue={null}
        onMenuItemClick={onClickMock}
      />
    );

    const Select = wrapper.getByRole('button');

    fireEvent.click(Select);

    const MenuItems = wrapper.getAllByRole('option');

    fireEvent.click(MenuItems[2]);

    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it('should not expand menu when disabled is true', () => {
    const wrapper = renderWithProviders(
      <Dropdown
        items={basicDropdownItems}
        dropdownLabel={'my label'}
        disabled={true}
        onMenuItemClick={onClickMock}
      />
    );

    const Select = wrapper.getByRole('button');

    fireEvent.click(Select);

    const Menu = wrapper.queryAllByRole('listbox');

    expect(Menu).toHaveLength(0);
  });
});
