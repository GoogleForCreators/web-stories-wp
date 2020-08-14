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
import { renderWithTheme } from '../../../../../testUtils';

import PublisherLogoSettings, { TEXT } from '..';

describe('PublisherLogo', () => {
  const mockHandleAddLogos = jest.fn();
  const mockHandleDeleteLogo = jest.fn();
  it('should render a fileUpload container and helper text by default', () => {
    const { getByTestId, getByText } = renderWithTheme(
      <PublisherLogoSettings
        handleAddLogos={mockHandleAddLogos}
        handleDeleteLogo={mockHandleDeleteLogo}
        isLoading={false}
        publisherLogos={[]}
      />
    );

    expect(getByTestId('upload-file-input')).toBeInTheDocument();
    expect(getByText(TEXT.SECTION_HEADING)).toBeInTheDocument();
  });

  it('should trigger onUpdatePublisherLogo when delete button is clicked on an uploaded file', () => {
    const { getByTestId } = renderWithTheme(
      <PublisherLogoSettings
        handleAddLogos={mockHandleAddLogos}
        handleDeleteLogo={mockHandleDeleteLogo}
        isLoading={false}
        publisherLogos={[
          {
            src: 'source-that-displays-an-image',
            title: 'mockfile.png',
            alt: 'mockfile.png',
          },
        ]}
      />
    );

    const DeleteFileButton = getByTestId('remove-publisher-logo-0').lastChild;
    expect(DeleteFileButton).toBeDefined();
    fireEvent.click(DeleteFileButton);
    expect(mockHandleDeleteLogo).toHaveBeenCalledTimes(1);
  });
});
