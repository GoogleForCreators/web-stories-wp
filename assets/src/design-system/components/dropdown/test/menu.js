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
import { forwardRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { renderWithProviders } from '../../../testUtils/renderWithProviders';
import { DropdownMenu } from '../menu';
import { basicDropdownOptions } from '../stories/sampleData';

describe('Dropdown <DropdownMenu />', () => {
  const onClickMock = jest.fn();

  // Mock scrollTo
  const scrollTo = jest.fn();
  Object.defineProperty(window.Element.prototype, 'scrollTo', {
    writable: true,
    value: scrollTo,
  });

  it('should render a <DropdownMenu /> list with 12 items', () => {
    const { getByRole, queryAllByRole } = renderWithProviders(
      <DropdownMenu
        hasMenuRole={false}
        emptyText={'No options available'}
        items={basicDropdownOptions}
        onMenuItemClick={onClickMock}
        onDismissMenu={() => {}}
        activeValue={null}
      />
    );

    const menu = getByRole('listbox');
    expect(menu).toBeInTheDocument();

    const options = queryAllByRole('option');
    expect(options).toHaveLength(12);
  });

  it('should return an emptyText message when there are no items to display', () => {
    const { getByText } = renderWithProviders(
      <DropdownMenu
        hasMenuRole={false}
        emptyText={'No options available'}
        items={[]}
        onMenuItemClick={onClickMock}
        onDismissMenu={() => {}}
        activeValue={null}
      />
    );

    const emptyMessage = getByText('No options available');
    expect(emptyMessage).toBeTruthy();
  });

  it('should trigger onMenuItemClick when list item is clicked', () => {
    const { queryAllByRole } = renderWithProviders(
      <DropdownMenu
        hasMenuRole={false}
        emptyText={'No options available'}
        items={basicDropdownOptions}
        onMenuItemClick={onClickMock}
        onDismissMenu={() => {}}
        activeValue={null}
      />
    );

    const option3 = queryAllByRole('option')[2];
    expect(option3).toHaveTextContent(basicDropdownOptions[2].label);

    fireEvent.click(option3);

    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it('should override list items when renderMenu is present', () => {
    const OverrideRenderItem = forwardRef(function DefaultListItem(
      { isSelected, ...rest },
      ref
    ) {
      return (
        <li {...rest} ref={ref}>
          {isSelected ? 'I AM SELECTED' : 'I AM EXTRA CONTENT'}
        </li>
      );
    });
    OverrideRenderItem.propTypes = {
      isSelected: PropTypes.bool,
    };

    const { queryAllByText } = renderWithProviders(
      <DropdownMenu
        hasMenuRole={false}
        emptyText={'No options available'}
        items={basicDropdownOptions}
        onMenuItemClick={onClickMock}
        onDismissMenu={() => {}}
        activeValue={basicDropdownOptions[2].value}
        renderItem={OverrideRenderItem}
      />
    );

    const itemsNotSelected = queryAllByText('I AM EXTRA CONTENT');
    const itemsSelected = queryAllByText('I AM SELECTED');

    expect(itemsNotSelected).toHaveLength(11);
    expect(itemsSelected).toHaveLength(1);
  });
});
