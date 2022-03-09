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
import { forwardRef } from '@googleforcreators/react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { renderWithProviders } from '../../../testUtils/renderWithProviders';
import { Menu } from '..';
import { basicDropDownOptions } from '../../../storybookUtils/sampleData';
import { getOptions } from '../utils';

const groupedOptions = getOptions(basicDropDownOptions);

const onClickMock = jest.fn();
const scrollTo = jest.fn();

describe('<Menu />', () => {
  beforeAll(() => {
    // Mock scrollTo
    Object.defineProperty(window.Element.prototype, 'scrollTo', {
      writable: true,
      value: scrollTo,
    });
  });

  it('should render a <Menu /> list with 12 items', () => {
    renderWithProviders(
      <Menu
        listId="foo"
        parentId="bar"
        hasMenuRole={false}
        emptyText={'No options available'}
        options={groupedOptions}
        onMenuItemClick={onClickMock}
        onDismissMenu={() => {}}
        activeValue={null}
      />
    );

    const menu = screen.getByRole('listbox');
    expect(menu).toBeInTheDocument();

    const options = screen.queryAllByRole('option');
    expect(options).toHaveLength(12);
  });

  it('should return an emptyText message when there are no items to display', () => {
    renderWithProviders(
      <Menu
        listId="foo"
        parentId="bar"
        hasMenuRole={false}
        emptyText={'No options available'}
        options={[]}
        onMenuItemClick={onClickMock}
        onDismissMenu={() => {}}
        activeValue={null}
      />
    );

    const emptyMessage = screen.getByText('No options available');
    expect(emptyMessage).toBeInTheDocument();
  });

  it('should trigger onMenuItemClick when list item is clicked', () => {
    renderWithProviders(
      <Menu
        listId="foo"
        parentId="bar"
        hasMenuRole={false}
        emptyText={'No options available'}
        options={groupedOptions}
        onMenuItemClick={onClickMock}
        onDismissMenu={() => {}}
        activeValue={null}
      />
    );

    const option3 = screen.queryAllByRole('option')[2];
    expect(option3).toHaveTextContent(basicDropDownOptions[2].label);

    fireEvent.click(option3);

    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it('should override list items when renderMenu is present', () => {
    const OverrideRenderItem = forwardRef(({ isSelected, ...rest }, ref) => {
      return (
        <li {...rest} ref={ref}>
          {/* eslint-disable-next-line jest/no-conditional-in-test */}
          {isSelected ? 'I AM SELECTED' : 'I AM EXTRA CONTENT'}
        </li>
      );
    });
    OverrideRenderItem.propTypes = {
      isSelected: PropTypes.bool,
    };

    renderWithProviders(
      <Menu
        listId="foo"
        parentId="bar"
        hasMenuRole={false}
        emptyText={'No options available'}
        options={groupedOptions}
        onMenuItemClick={onClickMock}
        onDismissMenu={() => {}}
        activeValue={basicDropDownOptions[2].value}
        renderItem={OverrideRenderItem}
      />
    );

    const itemsNotSelected = screen.queryAllByText('I AM EXTRA CONTENT');
    const selectedItem = screen.getByText('I AM SELECTED');

    expect(itemsNotSelected).toHaveLength(11);
    expect(selectedItem).toBeInTheDocument();
  });
});
