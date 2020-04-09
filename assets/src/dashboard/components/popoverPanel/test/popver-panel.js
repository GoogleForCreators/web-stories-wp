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
import { fireEvent, render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

/**
 * Internal dependencies
 */
import theme from '../../../theme';
import PopoverPanel from '../';

const wrapper = (children) => {
  return render(<ThemeProvider theme={theme}>{children}</ThemeProvider>);
};

describe('CardGrid', () => {
  it('should render children when open', () => {
    const { getAllByTestId } = wrapper(
      <PopoverPanel isOpen onClose={() => {}} title={'Sample Popover'}>
        <div data-testid={'test-child'}>{'Popover Content'}</div>
      </PopoverPanel>
    );

    expect(getAllByTestId('test-child')).toHaveLength(1);
  });

  it('should not render children when open', () => {
    const { queryByTestId } = wrapper(
      <PopoverPanel isOpen={false} onClose={() => {}} title={'Sample Popover'}>
        <div data-testid={'test-child'}>{'Popover Content'}</div>
      </PopoverPanel>
    );

    expect(queryByTestId('test-child')).toBeNull();
  });

  it('calls the close function when the x icon is pressed', () => {
    const closeFn = jest.fn();
    const { getByTestId } = wrapper(
      <PopoverPanel isOpen onClose={closeFn} title={'Sample Popover'}>
        <div data-testid={'test-child'}>{'Popover Content'}</div>
      </PopoverPanel>
    );

    const closeButton = getByTestId('popover-close-btn');
    fireEvent.click(closeButton);

    expect(closeFn).toHaveBeenCalledTimes(1);
  });
});
