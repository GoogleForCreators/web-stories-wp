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
import { render, fireEvent } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

/**
 * Internal dependencies
 */
import theme from '../../../theme';
import TypeaheadOptions from '../';

const wrapper = (children) => {
  return render(<ThemeProvider theme={theme}>{children}</ThemeProvider>);
};

describe('TypeaheadOptions', () => {
  const demoItems = [
    { value: '1', label: 'one' },
    { value: 'foo', label: 'two' },
    { value: false, label: 'invalid option' },
    { value: 'bar', label: 'three' },
    { value: 'sports', label: 'Sports' },
    { value: 'beauty', label: 'Beauty' },
  ];

  const onClickMock = jest.fn();

  it('should render a <TypeaheadOptions />', () => {
    const { getByText } = wrapper(
      <TypeaheadOptions onSelect={onClickMock} items={demoItems} isOpen />
    );

    expect(getByText('one')).toBeDefined();
  });

  it('should simulate a click on one of the items', () => {
    const { getByText } = wrapper(
      <TypeaheadOptions onSelect={onClickMock} items={demoItems} isOpen />
    );

    const menuItem = getByText('two');

    fireEvent.click(menuItem);

    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it('should not allow click on item that has false value', () => {
    const { getByText } = wrapper(
      <TypeaheadOptions onSelect={onClickMock} items={demoItems} isOpen />
    );

    const menuItem = getByText('invalid option');

    fireEvent.click(menuItem);

    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it('should default to showing 5 items', () => {
    const { getAllByRole } = wrapper(
      <TypeaheadOptions onSelect={onClickMock} items={demoItems} isOpen />
    );

    const menuItems = getAllByRole('listitem');

    expect(menuItems).toHaveLength(5);
  });

  it('should only show 3 items when maxItemsVisible is set', () => {
    const { getAllByRole } = wrapper(
      <TypeaheadOptions
        onSelect={onClickMock}
        items={demoItems}
        isOpen
        maxItemsVisible={3}
      />
    );

    const menuItems = getAllByRole('listitem');

    expect(menuItems).toHaveLength(3);
  });
});
