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
import { within, screen } from '@testing-library/react';
import { noop } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import PublisherLogoSettings, { TEXT } from '..';
import { rawPublisherLogos } from '../../dataUtils/formattedPublisherLogos';
import { renderWithProviders } from '../../../../testUtils';

describe('PublisherLogo', () => {
  const mockHandleAddLogos = jest.fn();

  it('should render a fileUpload container and helper text by default when canUploadFiles is true', () => {
    renderWithProviders(
      <PublisherLogoSettings
        onAddLogos={mockHandleAddLogos}
        onRemoveLogo={noop}
        onUpdateDefaultLogo={noop}
        isLoading={false}
        publisherLogos={[]}
        canUploadFiles
      />
    );

    expect(screen.getByTestId('upload-file-input')).toBeInTheDocument();
    expect(screen.getByText(TEXT.SECTION_HEADING)).toBeInTheDocument();
  });

  it('should not render fileUpload container when canUploadFiles is false', () => {
    renderWithProviders(
      <PublisherLogoSettings
        onAddLogos={mockHandleAddLogos}
        onRemoveLogo={noop}
        onUpdateDefaultLogo={noop}
        isLoading={false}
        publisherLogos={[]}
      />
    );

    expect(screen.queryByTestId('upload-file-input')).not.toBeInTheDocument();
  });

  it('should render an image for each publisherLogo in the array', () => {
    renderWithProviders(
      <PublisherLogoSettings
        onAddLogos={mockHandleAddLogos}
        onRemoveLogo={noop}
        onUpdateDefaultLogo={noop}
        isLoading={false}
        publisherLogos={rawPublisherLogos}
      />
    );

    expect(screen.queryAllByRole('img')).toHaveLength(rawPublisherLogos.length);
  });

  it('should specify the first logo displayed as default', () => {
    renderWithProviders(
      <PublisherLogoSettings
        onAddLogos={mockHandleAddLogos}
        onRemoveLogo={noop}
        onUpdateDefaultLogo={noop}
        isLoading={false}
        publisherLogos={rawPublisherLogos}
      />
    );

    const FirstGridItem = screen.getAllByRole('listitem')[0];
    const Default = within(FirstGridItem).getByText('Default');
    expect(Default).toBeInTheDocument();
  });

  it('should render a context menu button for each uploaded logo', () => {
    renderWithProviders(
      <PublisherLogoSettings
        onAddLogos={mockHandleAddLogos}
        onRemoveLogo={noop}
        onUpdateDefaultLogo={noop}
        isLoading={false}
        publisherLogos={rawPublisherLogos}
      />
    );

    expect(
      screen.queryAllByTestId(/^publisher-logo-context-menu-button-/)
    ).toHaveLength(rawPublisherLogos.length);
  });

  it('should render an error message if uploadError is present', () => {
    renderWithProviders(
      <PublisherLogoSettings
        onAddLogos={mockHandleAddLogos}
        onRemoveLogo={noop}
        onUpdateDefaultLogo={noop}
        isLoading={false}
        publisherLogos={rawPublisherLogos}
        uploadError={'Something went wrong.'}
        canUploadFiles
      />
    );

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
  });
});
