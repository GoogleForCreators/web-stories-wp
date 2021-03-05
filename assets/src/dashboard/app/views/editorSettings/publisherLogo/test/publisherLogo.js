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
import { within } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { renderWithProviders } from '../../../../../testUtils';

import PublisherLogoSettings, { TEXT } from '..';
import formattedPublisherLogos from '../../../../../dataUtils/formattedPublisherLogos';
import { noop } from '../../../../../../design-system';

describe('PublisherLogo', () => {
  const mockHandleAddLogos = jest.fn();

  it('should render a fileUpload container and helper text by default when canUploadFiles is true', () => {
    const { getByTestId, getByText } = renderWithProviders(
      <PublisherLogoSettings
        onAddLogos={mockHandleAddLogos}
        onRemoveLogo={noop}
        onUpdateDefaultLogo={noop}
        isLoading={false}
        publisherLogos={[]}
        canUploadFiles
      />
    );

    expect(getByTestId('upload-file-input')).toBeInTheDocument();
    expect(getByText(TEXT.SECTION_HEADING)).toBeInTheDocument();
  });

  it('should not render fileUpload container when canUploadFiles is false', () => {
    const { queryByTestId } = renderWithProviders(
      <PublisherLogoSettings
        onAddLogos={mockHandleAddLogos}
        onRemoveLogo={noop}
        onUpdateDefaultLogo={noop}
        isLoading={false}
        publisherLogos={[]}
      />
    );

    expect(queryByTestId('upload-file-input')).not.toBeInTheDocument();
  });

  it('should render an image for each publisherLogo in the array', () => {
    const { queryAllByRole } = renderWithProviders(
      <PublisherLogoSettings
        onAddLogos={mockHandleAddLogos}
        onRemoveLogo={noop}
        onUpdateDefaultLogo={noop}
        isLoading={false}
        publisherLogos={formattedPublisherLogos}
      />
    );

    expect(queryAllByRole('img')).toHaveLength(formattedPublisherLogos.length);
  });

  it('should specify the first logo displayed as default', () => {
    const { getAllByRole } = renderWithProviders(
      <PublisherLogoSettings
        onAddLogos={mockHandleAddLogos}
        onRemoveLogo={noop}
        onUpdateDefaultLogo={noop}
        isLoading={false}
        publisherLogos={formattedPublisherLogos}
      />
    );

    const FirstGridItem = getAllByRole('listitem')[0];
    const Default = within(FirstGridItem).getByText('Default');
    expect(Default).toBeInTheDocument();
  });

  it('should render a context menu button for each uploaded logo', () => {
    const { queryAllByTestId } = renderWithProviders(
      <PublisherLogoSettings
        onAddLogos={mockHandleAddLogos}
        onRemoveLogo={noop}
        onUpdateDefaultLogo={noop}
        isLoading={false}
        publisherLogos={formattedPublisherLogos}
      />
    );

    expect(
      queryAllByTestId(/^publisher-logo-context-menu-button-/)
    ).toHaveLength(formattedPublisherLogos.length);
  });

  it('should render an error message if uploadError is present', () => {
    const { getByText } = renderWithProviders(
      <PublisherLogoSettings
        onAddLogos={mockHandleAddLogos}
        onRemoveLogo={noop}
        onUpdateDefaultLogo={noop}
        isLoading={false}
        publisherLogos={formattedPublisherLogos}
        uploadError={'Something went wrong.'}
        canUploadFiles
      />
    );

    expect(getByText('Something went wrong.')).toBeInTheDocument();
  });
});
