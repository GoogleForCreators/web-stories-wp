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
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

/**
 * Internal dependencies
 */
import theme from '../../../theme';

import Dropdown from '../';

const wrapper = (children) => {
  return render(<ThemeProvider theme={theme}>{children}</ThemeProvider>);
};

describe('Dropdown', () => {
  const demoItems = [
    { value: '1', label: 'one' },
    { value: 'foo', label: 'two' },
    { value: false, label: 'invalid option' },
    { value: 'bar', label: 'three' },
  ];
  const onClickMock = jest.fn();

  it('should render a <Dropdown /> by default', () => {
    const { getByRole } = wrapper(
      <Dropdown
        placeholder="placeholder text"
        ariaLabel="my dropdown test"
        value={false}
        onChange={onClickMock}
        items={demoItems}
        isOpen={false}
      />
    );

    const DropdownButton = getByRole('button');
    const DropdownPopoverMenu = getByRole('list');

    expect(DropdownButton).toBeDefined();

    expect(DropdownPopoverMenu).toBeDefined();
  });
});
