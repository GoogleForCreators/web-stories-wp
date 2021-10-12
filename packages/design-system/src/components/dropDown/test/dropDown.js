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
import { fireEvent, screen } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { renderWithProviders } from '../../../testUtils/renderWithProviders';
import { basicDropDownOptions } from '../../../testUtils/sampleData';
import { DropDown } from '..';

const scrollTo = jest.fn();

describe('DropDown <DropDown />', () => {
  beforeAll(() => {
    // Mock scrollTo
    Object.defineProperty(window.Element.prototype, 'scrollTo', {
      writable: true,
      value: scrollTo,
    });

    jest.useFakeTimers();
  });

  it('should render a closed <DropDown /> menu with a select button on default', () => {
    renderWithProviders(
      <DropDown options={basicDropDownOptions} dropDownLabel={'label'} />
    );

    const select = screen.getByRole('button');
    expect(select).toBeInTheDocument();

    const menu = screen.queryAllByRole('listbox');
    expect(menu).toStrictEqual([]);
  });

  it('should show placeholder value when no selected value is found', () => {
    renderWithProviders(
      <DropDown options={basicDropDownOptions} placeholder={'select a value'} />
    );

    const placeholder = screen.getByText('select a value');
    expect(placeholder).toBeInTheDocument();
  });

  it("should show selectedValue's associated label when selectedValue is present", () => {
    renderWithProviders(
      <DropDown
        options={basicDropDownOptions}
        placeholder={'select a value'}
        dropDownLabel={'label'}
        selectedValue={basicDropDownOptions[2].value}
      />
    );

    const select = screen.getByText(basicDropDownOptions[2].label);
    expect(select).toBeInTheDocument();
  });

  it("should show placeholder when selectedValue's associated label cannot be found", () => {
    renderWithProviders(
      <DropDown
        options={basicDropDownOptions}
        placeholder={'select a value'}
        dropDownLabel={'label'}
        selectedValue={'value that is not found in items'}
      />
    );

    const select = screen.getByText('select a value');
    expect(select).toBeInTheDocument();
  });

  it('should show label value when provided', () => {
    renderWithProviders(
      <DropDown
        options={basicDropDownOptions}
        placeholder={'select a value'}
        dropDownLabel={'my label'}
      />
    );

    const label = screen.getByText('my label');
    expect(label).toBeInTheDocument();
  });

  it('should use dropDownLabel as aria-label when no ariaLabel is specified', () => {
    renderWithProviders(
      <DropDown
        options={basicDropDownOptions}
        placeholder={'select a value'}
        dropDownLabel={'my label'}
      />
    );

    const label = screen.getByLabelText('my label');
    fireEvent.click(label);

    const menu = screen.getByRole('listbox');
    expect(menu).toBeInTheDocument();
  });

  it('should use ariaLabel as aria-label when present', () => {
    renderWithProviders(
      <DropDown
        options={basicDropDownOptions}
        placeholder={'select a value'}
        dropDownLabel={'my label'}
        ariaLabel={'my aria label override'}
      />
    );

    const label = screen.getByLabelText('my aria label override');
    fireEvent.click(label);

    const menu = screen.getByRole('listbox');
    expect(menu).toBeInTheDocument();
  });

  it('should show <DropDown /> menu when a select button is clicked', () => {
    renderWithProviders(
      <DropDown
        emptyText={'No options available'}
        options={basicDropDownOptions}
        dropDownLabel={'label'}
      />
    );

    const select = screen.getByRole('button');
    expect(select).toBeInTheDocument();

    fireEvent.click(select);

    const menu = screen.getByRole('listbox');
    expect(menu).toBeInTheDocument();
  });

  it('should show an active icon on list item that is active', () => {
    renderWithProviders(
      <DropDown
        emptyText={'No options available'}
        dropDownLabel={'label'}
        isKeepMenuOpenOnSelection={false}
        options={basicDropDownOptions}
        selectedValue={basicDropDownOptions[2].value}
      />
    );

    const select = screen.getByRole('button');
    expect(select).toBeInTheDocument();
    fireEvent.click(select);

    const activeMenuItem = screen.getByRole('option', {
      name: `Selected ${basicDropDownOptions[2].label}`,
    });
    expect(activeMenuItem).toBeInTheDocument();

    // We can't really validate this number anyway in JSDom (no actual
    // layout is happening), so just expect it to be called
    expect(scrollTo).toHaveBeenCalledWith(0, expect.any(Number));
  });

  // Mouse events
  it('should not expand menu when disabled is true', () => {
    renderWithProviders(
      <DropDown
        options={basicDropDownOptions}
        dropDownLabel={'my label'}
        disabled
      />
    );

    const select = screen.getByRole('button');
    expect(select).toBeInTheDocument();

    fireEvent.click(select);

    const menu = screen.queryAllByRole('listbox');
    expect(menu).toStrictEqual([]);
  });

  it('should trigger onMenuItemClick when item is clicked', () => {
    const onClickMock = jest.fn();

    renderWithProviders(
      <DropDown
        options={basicDropDownOptions}
        selectedValue={null}
        dropDownLabel={'my dropDown label'}
        onMenuItemClick={onClickMock}
      />
    );

    // Fire click event
    const select = screen.getByRole('button');
    fireEvent.click(select);

    const menu = screen.getByRole('listbox');
    expect(menu).toBeInTheDocument();

    const menuItems = screen.getAllByRole('option');
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
    renderWithProviders(
      <DropDown
        dropDownLabel={'label'}
        options={basicDropDownOptions}
        selectedValue={basicDropDownOptions[1].value}
      />
    );
    const select = screen.getByRole('button');
    fireEvent.click(select);

    const menu = screen.getByRole('listbox');
    expect(menu).toBeInTheDocument();

    // wait for debounced callback to allow a select click handler to process
    jest.runOnlyPendingTimers();

    fireEvent.click(select);

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});

// TODO: Keyboard events need mock useKeyDownEffect
// https://github.com/google/web-stories-wp/issues/5764

// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable jest/no-commented-out-tests */
// it('should trigger onMenuItemClick when using the down arrow plus enter key and keep menu open when isKeepMenuOpenOnSelection is true', async () => {
//   const onClickMock = jest.fn();
//   await renderWithProviders(
//     <DropDown
//       emptyText={'No options available'}
//       dropDownLabel={'label'}
//       isKeepMenuOpenOnSelection={true}
//       options={basicDropDownOptions}
//       onMenuItemClick={onClickMock}
//       selectedValue={null}
//     />
//   );
//   const selectButton = screen.getByRole('button');
//   fireEvent.click(selectButton);

//   const menu = screen.getByRole('listbox');
//   expect(menu).toBeInTheDocument();

//   const menuItems = screen.getAllByRole('option');
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

//   await renderWithProviders(
//     <DropDown
//       emptyText={'No options available'}
//       dropDownLabel={'label'}
//       options={basicDropDownOptions}
//       onMenuItemClick={onClickMock}
//       selectedValue={basicDropDownOptions[0].value}
//     />
//   );
//   const selectButton = screen.getByRole('button');
//   fireEvent.click(selectButton);

//   const menu = screen.getByRole('listbox');
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
