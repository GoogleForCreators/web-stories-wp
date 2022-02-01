/*
 * Copyright 2022 Google LLC
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
import { axe } from 'jest-axe';
/**
 * Internal dependencies
 */
import renderWithTheme from '../../../testUtils/renderWithTheme';
import Header from '../header';

describe('publishModal/header', () => {
  const mockOnClose = jest.fn();
  const mockOnPublish = jest.fn();

  afterEach(() => {
    mockOnClose.mockReset();
    mockOnPublish.mockReset();
  });

  it('should have no accessibility issues', async () => {
    const { container } = renderWithTheme(
      <Header
        isPublishEnabled
        onClose={mockOnClose}
        onPublish={mockOnPublish}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should call onClose when close button is clicked', () => {
    renderWithTheme(
      <Header
        isPublishEnabled
        onClose={mockOnClose}
        onPublish={mockOnPublish}
      />
    );

    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should not call onPublish when publish button is clicked and isPublishEnabled is false', () => {
    renderWithTheme(
      <Header
        isPublishEnabled={false}
        onClose={mockOnClose}
        onPublish={mockOnPublish}
      />
    );

    const publishButton = screen.getByText('Publish');
    fireEvent.click(publishButton);

    expect(mockOnPublish).toHaveBeenCalledTimes(0);
  });

  it('should call onPublish when publish button is clicked and isPublishEnabled is true', () => {
    renderWithTheme(
      <Header
        isPublishEnabled
        onClose={mockOnClose}
        onPublish={mockOnPublish}
      />
    );

    const publishButton = screen.getByText('Publish');
    fireEvent.click(publishButton);

    expect(mockOnPublish).toHaveBeenCalledTimes(1);
  });
});
