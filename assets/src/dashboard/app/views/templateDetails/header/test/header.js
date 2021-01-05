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
import Header from '../';
import { renderWithProviders } from '../../../../../testUtils';
import LayoutProvider from '../../../../../components/layout/provider';

describe('Template Details <Header />', () => {
  const mockBookmarkClick = jest.fn();
  const mockHandleCtaClick = jest.fn();

  it('should render nav bar for detail template view', () => {
    const { getByRole } = renderWithProviders(
      <LayoutProvider>
        <Header
          onBookmarkClick={mockBookmarkClick}
          onHandleCtaClick={mockHandleCtaClick}
        />
      </LayoutProvider>
    );
    const nav = getByRole('navigation');

    expect(nav).toBeInTheDocument();
  });

  it('should trigger mockHandleCtaClick when cta is clicked', () => {
    const { getByText } = renderWithProviders(
      <LayoutProvider>
        <Header
          onBookmarkClick={mockBookmarkClick}
          onHandleCtaClick={mockHandleCtaClick}
        />
      </LayoutProvider>
    );
    const cta = getByText('Use template');

    expect(cta).toBeInTheDocument();

    fireEvent.click(cta);

    expect(mockHandleCtaClick).toHaveBeenCalledTimes(1);
  });

  it('should not render bookmark button when onBookmarkClick is null', () => {
    const { queryByRole } = renderWithProviders(
      <LayoutProvider>
        <Header onBookmarkClick={null} onHandleCtaClick={mockHandleCtaClick} />
      </LayoutProvider>
    );
    const buttons = queryByRole('button');

    expect(buttons).toBeInTheDocument();
  });

  it('should render bookmark button when onBookmarkClick is truthy', () => {
    const { queryAllByRole } = renderWithProviders(
      <LayoutProvider>
        <Header
          onBookmarkClick={mockBookmarkClick}
          onHandleCtaClick={mockHandleCtaClick}
        />
      </LayoutProvider>
    );
    const buttons = queryAllByRole('button');

    expect(buttons).toHaveLength(2);
  });
});
