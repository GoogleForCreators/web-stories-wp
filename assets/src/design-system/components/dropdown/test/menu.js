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
import { DropdownMenu } from '../menu';
import { basicDropdownItems } from '../stories/sampleData';

describe('Dropdown <DropdownMenu />', () => {
  const onClickMock = jest.fn();
  const onDismissMock = jest.fn();

  it('should render a <DropdownMenu /> list with 12 items', () => {
    const { getByRole, queryAllByRole } = renderWithProviders(
      <DropdownMenu
        hasMenuRole={false}
        emptyText={'No options available'}
        isRTL={false}
        items={basicDropdownItems}
        onMenuItemClick={onClickMock}
        onDismissMenu={onDismissMock}
        activeValue={null}
      />
    );

    const Menu = getByRole('listbox');
    expect(Menu).toBeInTheDocument();

    const ListItems = queryAllByRole('option');
    expect(ListItems).toHaveLength(12);
  });

  it('should return an emptyText message when there are no items to display', () => {
    const { getByText } = renderWithProviders(
      <DropdownMenu
        hasMenuRole={false}
        emptyText={'No options available'}
        isRTL={false}
        items={[]}
        onMenuItemClick={onClickMock}
        onDismissMenu={onDismissMock}
        activeValue={null}
      />
    );

    const EmptyMessage = getByText('No options available');
    expect(EmptyMessage).toBeTruthy();
  });

  it.skip('should trigger onDismissMenu when esc key is pressed', () => {
    const wrapper = renderWithProviders(
      <DropdownMenu
        hasMenuRole={false}
        emptyText={'No options available'}
        isRTL={false}
        items={basicDropdownItems}
        onMenuItemClick={onClickMock}
        onDismissMenu={onDismissMock}
        activeValue={basicDropdownItems[1].value}
      />
    );

    const list = wrapper.getByRole('listbox');
    expect(list).toBeDefined();

    fireEvent.keyPress(list, { key: 'escape', keyCode: 27 });
    expect(onDismissMock).toHaveBeenCalledTimes(1);
  });

  it('should trigger onMenuItemClick when list item is clicked', () => {
    const { queryAllByRole } = renderWithProviders(
      <DropdownMenu
        hasMenuRole={false}
        emptyText={'No options available'}
        isRTL={false}
        items={basicDropdownItems}
        onMenuItemClick={onClickMock}
        onDismissMenu={onDismissMock}
        activeValue={null}
      />
    );

    const ListItem3 = queryAllByRole('option')[2];
    expect(ListItem3).toHaveTextContent(basicDropdownItems[2].label);

    fireEvent.click(ListItem3);
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it.skip('should trigger onMenuItemClick when keydown "Enter" on a list item', () => {
    const wrapper = renderWithProviders(
      <DropdownMenu
        hasMenuRole={false}
        emptyText={'No options available'}
        isRTL={false}
        items={basicDropdownItems}
        onMenuItemClick={onClickMock}
        onDismissMenu={onDismissMock}
        activeValue={basicDropdownItems[0].value}
      />
    );

    const ListItem = wrapper.getAllByRole('option')[0];
    expect(ListItem).toBeDefined();

    fireEvent.keyDown(ListItem, {
      key: 'Enter',
      keyCode: 13,
    });
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it('should show an active icon on list item that is active', () => {
    const { getByTestId, getByText } = renderWithProviders(
      <DropdownMenu
        hasMenuRole={false}
        emptyText={'No options available'}
        isRTL={false}
        items={basicDropdownItems}
        onMenuItemClick={onClickMock}
        onDismissMenu={onDismissMock}
        activeValue={basicDropdownItems[2].value}
      />
    );

    const ActiveListItem = getByText(basicDropdownItems[2].label).closest('li');
    const ActiveListItemById = getByTestId(
      'dropdownMenuItem_active_icon'
    ).closest('li');
    expect(ActiveListItem).toMatchObject(ActiveListItemById);
  });

  it('should override list items when renderMenu is present', () => {
    const { queryAllByText } = renderWithProviders(
      <DropdownMenu
        hasMenuRole={false}
        emptyText={'No options available'}
        isRTL={false}
        items={basicDropdownItems}
        onMenuItemClick={onClickMock}
        onDismissMenu={onDismissMock}
        activeValue={basicDropdownItems[2].value}
        renderItem={(item, isSelected) => {
          return (
            <div>{isSelected ? 'I AM SELECTED' : 'I AM EXTRA CONTENT'}</div>
          );
        }}
      />
    );

    const itemsNotSelected = queryAllByText('I AM EXTRA CONTENT');
    const itemsSelected = queryAllByText('I AM SELECTED');

    expect(itemsNotSelected).toHaveLength(11);
    expect(itemsSelected).toHaveLength(1);
  });
});
