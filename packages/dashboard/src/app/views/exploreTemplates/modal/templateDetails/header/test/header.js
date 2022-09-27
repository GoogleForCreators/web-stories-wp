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
import Header from '..';
import { renderWithProviders } from '../../../../../../../testUtils';
import LayoutProvider from '../../../../../../../components/layout/provider';

describe('Template Details <Header />', () => {
  const mockHandleCtaClick = jest.fn();

  it('should render nav bar for detail template view', () => {
    renderWithProviders(
      <LayoutProvider>
        <Header
          templateActions={{ createStoryFromTemplate: mockHandleCtaClick }}
          canCreateStory
        />
      </LayoutProvider>
    );
    const nav = screen.getByRole('navigation');

    expect(nav).toBeInTheDocument();
  });

  it('should trigger mockHandleCtaClick when cta is clicked', () => {
    renderWithProviders(
      <LayoutProvider>
        <Header
          templateActions={{ createStoryFromTemplate: mockHandleCtaClick }}
          canCreateStory
        />
      </LayoutProvider>
    );
    const cta = screen.getByText('Use template');

    expect(cta).toBeInTheDocument();

    fireEvent.click(cta);

    expect(mockHandleCtaClick).toHaveBeenCalledOnce();
  });
});
