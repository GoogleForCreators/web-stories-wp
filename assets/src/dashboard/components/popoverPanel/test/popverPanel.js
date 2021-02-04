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
import { renderWithProviders } from '../../../testUtils/';
import PopoverPanel from '../';

const categoryDemoData = [
  {
    label: <span>{'All Categories'}</span>,
    value: 'all',
    selected: true,
  },
  { label: 'Arts and Crafts', value: 'arts_crafts' },
  { label: 'Beauty', value: 'beauty' },
  { label: 'Cooking', value: 'cooking' },
  { label: 'News', value: 'news' },
  { label: 'Sports', value: 'sports' },
  { label: 'News', value: 'news' },
];

describe('CardGrid', () => {
  it('should render children when open', () => {
    const { getAllByTestId } = renderWithProviders(
      <PopoverPanel
        isOpen
        onClose={() => {}}
        title={'Sample Popover'}
        items={categoryDemoData}
        onSelect={() => {}}
      />
    );

    expect(getAllByTestId('popover-pill')).toHaveLength(
      categoryDemoData.length
    );
  });

  it('should not render children when open', () => {
    const { queryByTestId } = renderWithProviders(
      <PopoverPanel
        isOpen={false}
        onClose={() => {}}
        title={'Sample Popover'}
        items={categoryDemoData}
        onSelect={() => {}}
      />
    );

    expect(queryByTestId('pill-fieldset')).not.toBeInTheDocument();
  });

  it('calls the close function when the x icon is pressed', () => {
    const closeFn = jest.fn();
    const { getByTestId } = renderWithProviders(
      <PopoverPanel
        isOpen
        onClose={closeFn}
        title={'Sample Popover'}
        items={categoryDemoData}
        onSelect={() => {}}
      />
    );

    const closeButton = getByTestId('popover-close-btn');
    fireEvent.click(closeButton);

    expect(closeFn).toHaveBeenCalledTimes(1);
  });
});
