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
import { renderWithTheme } from '../../../testUtils/';
import PopoverMenu from '../';

describe('PopoverMenu', () => {
  const demoItems = [
    { value: '1', label: 'one' },
    { value: 'foo', label: 'two' },
    { value: false, label: 'invalid option' },
    { value: 'bar', label: 'three' },
    {
      value: 'link',
      label: 'i am a link!',
      url: 'https://www.google.com/',
    },
  ];
  const onClickMock = jest.fn();

  it('should render a <PopoverMenu />', () => {
    const { getByText } = renderWithTheme(
      <PopoverMenu onSelect={onClickMock} items={demoItems} isOpen />
    );

    expect(getByText('one')).toBeDefined();
  });

  it('should simulate a click on one of the items', () => {
    const { getByText } = renderWithTheme(
      <PopoverMenu onSelect={onClickMock} items={demoItems} isOpen />
    );

    const menuItem = getByText('two');

    fireEvent.click(menuItem);

    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it('should not allow click on item that has false value', () => {
    const { getByText } = renderWithTheme(
      <PopoverMenu onSelect={onClickMock} items={demoItems} isOpen />
    );

    const menuItem = getByText('invalid option');

    fireEvent.click(menuItem);

    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it('should render one anchor and 4 list items', () => {
    const { queryAllByRole } = renderWithTheme(
      <PopoverMenu onSelect={onClickMock} items={demoItems} isOpen />
    );

    expect(queryAllByRole('listitem')).toHaveLength(4);
    expect(queryAllByRole('link')).toHaveLength(1);
  });
});
