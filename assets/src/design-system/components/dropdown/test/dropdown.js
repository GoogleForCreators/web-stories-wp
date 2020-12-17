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

import {
  act,
  fireEvent,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';

/**
 * Internal dependencies
 */
import { renderWithProviders } from '../../../testUtils/renderWithProviders';
import { Dropdown } from '../';
import { basicDropdownOptions } from '../stories/sampleData';

// TODO: fix tests to wait properly for menu to hide
/* eslint-disable jest/no-disabled-tests */
describe('Dropdown <Dropdown />', () => {
  // Mock scrollTo
  const scrollTo = jest.fn();
  Object.defineProperty(window.Element.prototype, 'scrollTo', {
    writable: true,
    value: scrollTo,
  });

  it('should render a closed <Dropdown /> menu with a select button on default', () => {
    const { getByRole, queryAllByRole } = renderWithProviders(
      <Dropdown options={basicDropdownOptions} dropdownLabel={'label'} />
    );

    const select = getByRole('button');
    expect(select).toBeDefined();

    const menu = queryAllByRole('listbox');
    expect(menu).toHaveLength(0);
  });

  it('should show placeholder value when no selected value is found', () => {
    const { getByText } = renderWithProviders(
      <Dropdown options={basicDropdownOptions} placeholder={'select a value'} />
    );

    const placeholder = getByText('select a value');
    expect(placeholder).toBeDefined();
  });

  it("should show selectedValue's associated label when selectedValue is present", () => {
    const { getByText } = renderWithProviders(
      <Dropdown
        options={basicDropdownOptions}
        placeholder={'select a value'}
        dropdownLabel={'label'}
        selectedValue={basicDropdownOptions[2].value}
      />
    );

    const select = getByText(basicDropdownOptions[2].label);
    expect(select).toBeDefined();
  });

  it("should show placeholder when selectedValue's associated label cannot be found", () => {
    const { getByText } = renderWithProviders(
      <Dropdown
        options={basicDropdownOptions}
        placeholder={'select a value'}
        dropdownLabel={'label'}
        selectedValue={'value that is not found in items'}
      />
    );

    const select = getByText('select a value');
    expect(select).toBeDefined();
  });

  it('should show label value when provided', () => {
    const { getByText } = renderWithProviders(
      <Dropdown
        options={basicDropdownOptions}
        placeholder={'select a value'}
        dropdownLabel={'my label'}
      />
    );

    const label = getByText('my label');
    expect(label).toBeDefined();
  });

  it('should show <Dropdown /> menu when a select button is clicked', () => {
    const { getByRole } = renderWithProviders(
      <Dropdown
        emptyText={'No options available'}
        options={basicDropdownOptions}
        dropdownLabel={'label'}
      />
    );

    const select = getByRole('button');
    expect(select).toBeInTheDocument();

    fireEvent.click(select);

    const menu = getByRole('listbox');
    expect(menu).toBeInTheDocument();
  });

  it('should show an active icon on list item that is active', () => {
    const { getByRole } = renderWithProviders(
      <Dropdown
        emptyText={'No options available'}
        dropdownLabel={'label'}
        isKeepMenuOpenOnSelection={false}
        options={basicDropdownOptions}
        selectedValue={basicDropdownOptions[2].value}
      />
    );

    const select = getByRole('button');
    expect(select).toBeInTheDocument();
    fireEvent.click(select);

    const activeMenuItem = getByRole('option', {
      name: `Selected ${basicDropdownOptions[2].label}`,
    });
    expect(activeMenuItem).toBeInTheDocument();

    // We can't really validate this number anyway in JSDom (no actual
    // layout is happening), so just expect it to be called
    expect(scrollTo).toHaveBeenCalledWith(0, expect.any(Number));
  });

  it('should clean badly grouped data', () => {
    const nestedOptions = [
      {
        label: 'section 1',
        options: [
          { value: 'one', label: '1' },
          { value: 'two', label: '2' },
        ],
        somethingExtra: [1, 2, 3, 4, 5],
      },
      {
        label: 'section 2',
        options: [
          { value: 'three', label: '3' },
          { value: 'four', label: '4' },
          { value: 'five', label: '5' },
        ],
      },
      'should be ignored',
    ];
    const { getByRole, getAllByRole, queryAllByText } = renderWithProviders(
      <Dropdown
        emptyText={'No options available'}
        dropdownLabel={'label'}
        isKeepMenuOpenOnSelection={false}
        options={nestedOptions}
      />
    );

    const select = getByRole('button');
    expect(select).toBeInTheDocument();
    fireEvent.click(select);

    const menuItems = getAllByRole('option');
    expect(menuItems).toHaveLength(5);

    const menuLabels = getAllByRole('presentation');
    expect(menuLabels).toHaveLength(2);

    expect(queryAllByText('should be ignored')).toHaveLength(0);
  });

  // Mouse events
  it('should not expand menu when disabled is true', () => {
    const { getByRole, queryAllByRole } = renderWithProviders(
      <Dropdown
        options={basicDropdownOptions}
        dropdownLabel={'my label'}
        disabled={true}
      />
    );

    const select = getByRole('button');
    expect(select).toBeInTheDocument();

    fireEvent.click(select);

    const menu = queryAllByRole('listbox');
    expect(menu).toHaveLength(0);
  });

  it('should trigger onMenuItemClick when item is clicked', () => {
    const onClickMock = jest.fn();

    const { getByRole, getAllByRole } = renderWithProviders(
      <Dropdown
        options={basicDropdownOptions}
        selectedValue={null}
        dropdownLabel={'my dropdown label'}
        onMenuItemClick={onClickMock}
      />
    );

    // Fire click event
    const select = getByRole('button');
    fireEvent.click(select);

    const menu = getByRole('listbox');
    expect(menu).toBeInTheDocument();

    const menuItems = getAllByRole('option');
    expect(menuItems).toHaveLength(12);

    fireEvent.click(menuItems[3]);

    // first prop we get back is the event
    expect(onClickMock).toHaveBeenCalledWith(
      expect.anything(),
      basicDropdownOptions[3].value
    );

    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it.skip('should close active menu when select is clicked', async () => {
    const wrapper = renderWithProviders(
      <Dropdown
        dropdownLabel={'label'}
        options={basicDropdownOptions}
        selectedValue={basicDropdownOptions[1].value}
      />
    );
    const select = wrapper.getByRole('button');
    fireEvent.click(select);

    const menu = wrapper.getByRole('listbox');
    expect(menu).toBeInTheDocument();

    fireEvent.click(select);

    await waitForElementToBeRemoved(() =>
      expect(wrapper.queryByRole('listbox')).not.toBeInTheDocument()
    );
  });

  // Keyboard events

  it.skip('should trigger onMenuItemClick when using the down arrow plus enter key and keep menu open when isKeepMenuOpenOnSelection is true', async () => {
    const onClickMock = jest.fn();
    const { getByRole, getAllByRole } = await renderWithProviders(
      <Dropdown
        emptyText={'No options available'}
        dropdownLabel={'label'}
        isKeepMenuOpenOnSelection={true}
        options={basicDropdownOptions}
        onMenuItemClick={onClickMock}
        selectedValue={null}
      />
    );
    const selectButton = getByRole('button');
    fireEvent.click(selectButton);

    const menu = getByRole('listbox');
    expect(menu).toBeInTheDocument();

    const menuItems = getAllByRole('option');
    expect(menuItems).toHaveLength(12);
    // focus first element in menu
    act(() => {
      fireEvent.keyDown(menu, {
        key: 'ArrowDown',
      });
    });

    expect(menuItems[0]).toHaveFocus();

    // focus second element in menu
    act(() => {
      fireEvent.keyDown(menu, {
        key: 'ArrowDown',
      });
    });
    expect(menuItems[1]).toHaveFocus();

    act(() => {
      fireEvent.keyDown(menu, { key: 'Enter' });
    });

    // The second item in the menu.
    // first prop we get back is the event
    expect(onClickMock).toHaveBeenCalledWith(
      expect.anything(),
      basicDropdownOptions[1].value
    );

    expect(onClickMock).toHaveBeenCalledTimes(1);

    expect(menu).toBeInTheDocument();
  });

  it.skip('should trigger onMenuItemClick when using the down arrow plus enter key and close menu', async () => {
    const onClickMock = jest.fn();

    const { getByRole } = await renderWithProviders(
      <Dropdown
        emptyText={'No options available'}
        dropdownLabel={'label'}
        options={basicDropdownOptions}
        onMenuItemClick={onClickMock}
        selectedValue={basicDropdownOptions[0].value}
      />
    );
    const selectButton = getByRole('button');
    fireEvent.click(selectButton);

    const menu = getByRole('listbox');
    expect(menu).toBeInTheDocument();

    // focus first element in menu
    act(() => {
      fireEvent.keyDown(menu, {
        key: 'ArrowDown',
      });
    });

    // focus second element in menu
    act(() => {
      fireEvent.keyDown(menu, {
        key: 'ArrowDown',
      });
    });

    act(() => {
      fireEvent.keyDown(menu, { key: 'Enter' });
    });

    // The second item in the menu.
    // first prop we get back is the event
    expect(onClickMock).toHaveBeenCalledWith(
      expect.anything(),
      basicDropdownOptions[2].value
    );

    expect(onClickMock).toHaveBeenCalledTimes(1);

    await waitFor(() => expect(menu).not.toBeInTheDocument());
  });

  it.skip('should trigger onDismissMenu when esc key is pressed', async () => {
    const { getByRole } = await renderWithProviders(
      <Dropdown
        dropdownLabel={'label'}
        options={basicDropdownOptions}
        selectedValue={basicDropdownOptions[1].value}
      />
    );
    const select = getByRole('button');
    fireEvent.click(select);

    const menu = getByRole('listbox');
    expect(menu).toBeInTheDocument();

    act(() => {
      fireEvent.keyDown(menu, {
        key: 'Escape',
      });
    });

    await waitFor(() => expect(menu).not.toBeInTheDocument());
  });
});
