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
import formattedPublisherLogos from '../../../../../dataUtils/formattedPublisherLogos';

describe('PublisherLogo', () => {
  const mockHandleAddLogos = jest.fn();
  const mockHandleRemoveLogo = jest.fn();

  it('should render a fileUpload container and helper text by default when canUploadFiles is true', () => {
    const { getByTestId, getByText } = renderWithTheme(
      <PublisherLogoSettings
        handleAddLogos={mockHandleAddLogos}
        handleRemoveLogo={mockHandleRemoveLogo}
        isLoading={false}
        publisherLogos={[]}
        canUploadFiles={true}
      />
    );

    expect(getByTestId('upload-file-input')).toBeInTheDocument();
    expect(getByText(TEXT.SECTION_HEADING)).toBeInTheDocument();
  });

  it('should not render fileUpload container when canUploadFiles is false', () => {
    const { queryAllByTestId } = renderWithTheme(
      <PublisherLogoSettings
        handleAddLogos={mockHandleAddLogos}
        handleRemoveLogo={mockHandleRemoveLogo}
        isLoading={false}
        publisherLogos={[]}
      />
    );

    expect(queryAllByTestId('upload-file-input')).toHaveLength(0);
  });

  it('should render an image for each publisherLogo in the array', () => {
    const { queryAllByRole } = renderWithTheme(
      <PublisherLogoSettings
        handleAddLogos={mockHandleAddLogos}
        handleRemoveLogo={mockHandleRemoveLogo}
        isLoading={false}
        publisherLogos={formattedPublisherLogos}
      />
    );

    expect(queryAllByRole('img')).toHaveLength(formattedPublisherLogos.length);
  });

  it('should render a button to remove publisherLogos aside from the default logo', () => {
    const { queryAllByTestId } = renderWithTheme(
      <PublisherLogoSettings
        handleAddLogos={mockHandleAddLogos}
        handleRemoveLogo={mockHandleRemoveLogo}
        isLoading={false}
        publisherLogos={formattedPublisherLogos}
      />
    );

    expect(queryAllByTestId(/^remove-publisher-logo/)).toHaveLength(
      formattedPublisherLogos.length - 1
    );
  });

  it('should render an error message if uploadError is present', () => {
    const { getByText } = renderWithTheme(
      <PublisherLogoSettings
        handleAddLogos={mockHandleAddLogos}
        handleRemoveLogo={mockHandleRemoveLogo}
        isLoading={false}
        publisherLogos={formattedPublisherLogos}
        uploadError={'Something went wrong.'}
      />
    );

    expect(getByText('Something went wrong.')).toBeInTheDocument();
  });

  it('should trigger mockHandleRemoveLogo when delete button is clicked on an uploaded file', () => {
    const { getByTestId } = renderWithTheme(
      <PublisherLogoSettings
        handleAddLogos={mockHandleAddLogos}
        handleRemoveLogo={mockHandleRemoveLogo}
        isLoading={false}
        publisherLogos={formattedPublisherLogos}
      />
    );

    const DeleteFileButton = getByTestId('remove-publisher-logo-2').lastChild;
    expect(DeleteFileButton).toBeDefined();
    fireEvent.click(DeleteFileButton);
    expect(mockHandleRemoveLogo).toHaveBeenCalledTimes(1);
  });

  it('should trigger mockHandleRemoveLogo when delete button is pressed with enter on an uploaded file', () => {
    const { getByTestId } = renderWithTheme(
      <PublisherLogoSettings
        handleAddLogos={mockHandleAddLogos}
        handleRemoveLogo={mockHandleRemoveLogo}
        isLoading={false}
        publisherLogos={formattedPublisherLogos}
      />
    );

    const DeleteFileButton = getByTestId('remove-publisher-logo-1').lastChild;
    expect(DeleteFileButton).toBeDefined();
    fireEvent.keyDown(DeleteFileButton, { key: 'Enter', code: 'Enter' });
    expect(mockHandleRemoveLogo).toHaveBeenCalledTimes(1);
  });
});
