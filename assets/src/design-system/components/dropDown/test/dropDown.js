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
import { basicDropDownOptions } from '../../../testUtils/sampleData';
import { DropDown } from '../';

describe('DropDown <DropDown />', () => {
  // Mock scrollTo
  const scrollTo = jest.fn();
  Object.defineProperty(window.Element.prototype, 'scrollTo', {
    writable: true,
    value: scrollTo,
  });

  jest.useFakeTimers();

  it('should render a closed <DropDown /> menu with a select button on default', () => {
    const { getByRole, queryAllByRole } = renderWithProviders(
      <DropDown options={basicDropDownOptions} dropDownLabel={'label'} />
    );

    const select = getByRole('button');
    expect(select).toBeInTheDocument();

    const menu = queryAllByRole('listbox');
    expect(menu).toStrictEqual([]);
  });

  it('should show placeholder value when no selected value is found', () => {
    const { getByText } = renderWithProviders(
      <DropDown options={basicDropDownOptions} placeholder={'select a value'} />
    );

    const placeholder = getByText('select a value');
    expect(placeholder).toBeInTheDocument();
  });

  it("should show selectedValue's associated label when selectedValue is present", () => {
    const { getByText } = renderWithProviders(
      <DropDown
        options={basicDropDownOptions}
        placeholder={'select a value'}
        dropDownLabel={'label'}
        selectedValue={basicDropDownOptions[2].value}
      />
    );

    const select = getByText(basicDropDownOptions[2].label);
    expect(select).toBeInTheDocument();
  });

  it("should show placeholder when selectedValue's associated label cannot be found", () => {
    const { getByText } = renderWithProviders(
      <DropDown
        options={basicDropDownOptions}
        placeholder={'select a value'}
        dropDownLabel={'label'}
        selectedValue={'value that is not found in items'}
      />
    );

    const select = getByText('select a value');
    expect(select).toBeInTheDocument();
  });

  it('should show label value when provided', () => {
    const { getByText } = renderWithProviders(
      <DropDown
        options={basicDropDownOptions}
        placeholder={'select a value'}
        dropDownLabel={'my label'}
      />
    );

    const label = getByText('my label');
    expect(label).toBeInTheDocument();
  });

  it('should use dropDownLabel as aria-label when no ariaLabel is specified', () => {
    const { getByRole, getByLabelText } = renderWithProviders(
      <DropDown
        options={basicDropDownOptions}
        placeholder={'select a value'}
        dropDownLabel={'my label'}
      />
    );

    const label = getByLabelText('my label');
    fireEvent.click(label);

    const menu = getByRole('listbox');
    expect(menu).toBeInTheDocument();
  });

  it('should use ariaLabel as aria-label when present', () => {
    const { getByRole, getByLabelText } = renderWithProviders(
      <DropDown
        options={basicDropDownOptions}
        placeholder={'select a value'}
        dropDownLabel={'my label'}
        ariaLabel={'my aria label override'}
      />
    );

    const label = getByLabelText('my aria label override');
    fireEvent.click(label);

    const menu = getByRole('listbox');
    expect(menu).toBeInTheDocument();
  });

  it('should show <DropDown /> menu when a select button is clicked', () => {
    const { getByRole } = renderWithProviders(
      <DropDown
        emptyText={'No options available'}
        options={basicDropDownOptions}
        dropDownLabel={'label'}
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
      <DropDown
        emptyText={'No options available'}
        dropDownLabel={'label'}
        isKeepMenuOpenOnSelection={false}
        options={basicDropDownOptions}
        selectedValue={basicDropDownOptions[2].value}
      />
    );

    const select = getByRole('button');
    expect(select).toBeInTheDocument();
    fireEvent.click(select);

    const activeMenuItem = getByRole('option', {
      name: `Selected ${basicDropDownOptions[2].label}`,
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
      <DropDown
        emptyText={'No options available'}
        dropDownLabel={'label'}
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

    expect(queryAllByText('should be ignored')).toStrictEqual([]);
  });

  // Mouse events
  it('should not expand menu when disabled is true', () => {
    const { getByRole, queryAllByRole } = renderWithProviders(
      <DropDown
        options={basicDropDownOptions}
        dropDownLabel={'my label'}
        disabled={true}
      />
    );

    const select = getByRole('button');
    expect(select).toBeInTheDocument();

    fireEvent.click(select);

    const menu = queryAllByRole('listbox');
    expect(menu).toStrictEqual([]);
  });

  it('should trigger onMenuItemClick when item is clicked', () => {
    const onClickMock = jest.fn();

    const { getByRole, getAllByRole } = renderWithProviders(
      <DropDown
        options={basicDropDownOptions}
        selectedValue={null}
        dropDownLabel={'my dropDown label'}
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

    fireEvent.click(menuItems[2]);

    // first prop we get back is the event
    expect(onClickMock).toHaveBeenCalledWith(
      expect.anything(),
      basicDropDownOptions[2].value
    );

    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it('should close active menu when select is clicked', () => {
    const wrapper = renderWithProviders(
      <DropDown
        dropDownLabel={'label'}
        options={basicDropDownOptions}
        selectedValue={basicDropDownOptions[1].value}
      />
    );
    const select = wrapper.getByRole('button');
    fireEvent.click(select);

    const menu = wrapper.getByRole('listbox');
    expect(menu).toBeInTheDocument();

    // wait for debounced callback to allow a select click handler to process
    jest.runOnlyPendingTimers();

    fireEvent.click(select);

    expect(wrapper.queryByRole('listbox')).not.toBeInTheDocument();
  });
});

// TODO: Keyboard events need mock useKeyDownEffect
// https://github.com/google/web-stories-wp/issues/5764

// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable jest/no-commented-out-tests */
// it('should trigger onMenuItemClick when using the down arrow plus enter key and keep menu open when isKeepMenuOpenOnSelection is true', async () => {
//   const onClickMock = jest.fn();
//   const { getByRole, getAllByRole } = await renderWithProviders(
//     <DropDown
//       emptyText={'No options available'}
//       dropDownLabel={'label'}
//       isKeepMenuOpenOnSelection={true}
//       options={basicDropDownOptions}
//       onMenuItemClick={onClickMock}
//       selectedValue={null}
//     />
//   );
//   const selectButton = getByRole('button');
//   fireEvent.click(selectButton);

//   const menu = getByRole('listbox');
//   expect(menu).toBeInTheDocument();

//   const menuItems = getAllByRole('option');
//   expect(menuItems).toHaveLength(12);

//   // wait for debounced callback to allow a select click handler to process
//   jest.runOnlyPendingTimers();

//   // focus first element in menu
//   act(() => {
//     fireEvent.keyDown(menu, {
//       key: 'ArrowDown',
//     });
//   });

//   expect(menuItems[0]).toHaveFocus();

//   // focus second element in menu
//   act(() => {
//     fireEvent.keyDown(menu, {
//       key: 'ArrowDown',
//     });
//   });
//   expect(menuItems[1]).toHaveFocus();

//   act(() => {
//     fireEvent.keyDown(menu, { key: 'Enter' });
//   });

//   // The second item in the menu.
//   // first prop we get back is the event
//   expect(onClickMock).toHaveBeenCalledWith(
//     expect.anything(),
//     basicDropDownOptions[1].value
//   );

//   expect(onClickMock).toHaveBeenCalledTimes(1);

//   expect(menu).toBeInTheDocument();
// });

// it('should trigger onMenuItemClick when using the down arrow plus enter key and close menu', async () => {
//   const onClickMock = jest.fn();

//   const { getByRole } = await renderWithProviders(
//     <DropDown
//       emptyText={'No options available'}
//       dropDownLabel={'label'}
//       options={basicDropDownOptions}
//       onMenuItemClick={onClickMock}
//       selectedValue={basicDropDownOptions[0].value}
//     />
//   );
//   const selectButton = getByRole('button');
//   fireEvent.click(selectButton);

//   const menu = getByRole('listbox');
//   expect(menu).toBeInTheDocument();

//   // focus first element in menu
//   act(() => {
//     fireEvent.keyDown(menu, {
//       key: 'ArrowDown',
//     });
//   });

//   // focus second element in menu
//   act(() => {
//     fireEvent.keyDown(menu, {
//       key: 'ArrowDown',
//     });
//   });

//   act(() => {
//     fireEvent.keyDown(menu, { key: 'Enter' });
//   });

//   // The second item in the menu.
//   // first prop we get back is the event
//   expect(onClickMock).toHaveBeenCalledWith(
//     expect.anything(),
//     basicDropDownOptions[2].value
//   );

//   expect(onClickMock).toHaveBeenCalledTimes(1);

//   await waitFor(() => expect(menu).not.toBeInTheDocument());
// });

// it('should trigger onDismissMenu when esc key is pressed', async () => {
//   const wrapper = await renderWithProviders(
//     <DropDown
//       dropDownLabel={'label'}
//       options={basicDropDownOptions}
//       selectedValue={basicDropDownOptions[1].value}
//     />
//   );
//   const select = wrapper.getByRole('button');
//   fireEvent.click(select);

//   const menu = wrapper.queryByRole('listbox');
//   expect(menu).toBeInTheDocument();

//   act(() => {
//     fireEvent.keyDown(menu, {
//       key: 'Escape',
//     });
//   });

//   await waitFor(() => expect(menu).not.toBeInTheDocument());
// });
