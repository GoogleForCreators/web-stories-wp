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
import { fireEvent, within } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { renderWithProviders } from '../../../../../testUtils';

import PublisherLogoSettings, { TEXT } from '..';
import formattedPublisherLogos from '../../../../../dataUtils/formattedPublisherLogos';

describe('PublisherLogo', () => {
  const mockHandleAddLogos = jest.fn();

  it('should render a fileUpload container and helper text by default when canUploadFiles is true', () => {
    const { getByTestId, getByText } = renderWithProviders(
      <PublisherLogoSettings
        handleAddLogos={mockHandleAddLogos}
        handleRemoveLogo={jest.fn}
        handleUpdateDefaultLogo={jest.fn}
        isLoading={false}
        publisherLogos={[]}
        canUploadFiles={true}
      />
    );

    expect(getByTestId('upload-file-input')).toBeInTheDocument();
    expect(getByText(TEXT.SECTION_HEADING)).toBeInTheDocument();
  });

  it('should not render fileUpload container when canUploadFiles is false', () => {
    const { queryByTestId } = renderWithProviders(
      <PublisherLogoSettings
        handleAddLogos={mockHandleAddLogos}
        handleRemoveLogo={jest.fn}
        handleUpdateDefaultLogo={jest.fn}
        isLoading={false}
        publisherLogos={[]}
      />
    );

    expect(queryByTestId('upload-file-input')).not.toBeInTheDocument();
  });

  it('should render an image for each publisherLogo in the array', () => {
    const { queryAllByRole } = renderWithProviders(
      <PublisherLogoSettings
        handleAddLogos={mockHandleAddLogos}
        handleRemoveLogo={jest.fn}
        handleUpdateDefaultLogo={jest.fn}
        isLoading={false}
        publisherLogos={formattedPublisherLogos}
      />
    );

    expect(queryAllByRole('img')).toHaveLength(formattedPublisherLogos.length);
  });

  it('should specify the first logo displayed as default', () => {
    const { getAllByRole } = renderWithProviders(
      <PublisherLogoSettings
        handleAddLogos={mockHandleAddLogos}
        handleRemoveLogo={jest.fn}
        handleUpdateDefaultLogo={jest.fn}
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
        handleAddLogos={mockHandleAddLogos}
        handleRemoveLogo={jest.fn}
        handleUpdateDefaultLogo={jest.fn}
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
        handleAddLogos={mockHandleAddLogos}
        handleRemoveLogo={jest.fn}
        handleUpdateDefaultLogo={jest.fn}
        isLoading={false}
        publisherLogos={formattedPublisherLogos}
        uploadError={'Something went wrong.'}
        canUploadFiles={true}
      />
    );

    expect(getByText('Something went wrong.')).toBeInTheDocument();
  });

  it('should trigger mockHandleRemoveLogo when delete button is pressed with enter on an uploaded file', () => {
    const mockHandleRemoveLogo = jest.fn();

    const { getByTestId } = renderWithProviders(
      <PublisherLogoSettings
        handleAddLogos={jest.fn}
        handleRemoveLogo={mockHandleRemoveLogo}
        handleUpdateDefaultLogo={mockHandleRemoveLogo}
        isLoading={false}
        publisherLogos={formattedPublisherLogos}
      />
    );

    const ContextMenuButton = getByTestId(
      'publisher-logo-context-menu-button-2'
    );
    fireEvent.click(ContextMenuButton);

    const ContextMenu = getByTestId('publisher-logo-context-menu-2');
    expect(ContextMenu).toBeInTheDocument();

    const MenuItems = within(ContextMenu).queryAllByRole('listitem');
    const DeleteFileButton = MenuItems[1];
    expect(DeleteFileButton).toBeDefined();

    fireEvent.keyDown(DeleteFileButton, {
      key: 'Enter',
      keyCode: 13,
    });

    expect(mockHandleRemoveLogo).toHaveBeenCalledTimes(1);
  });

  it('should trigger mockHandleRemoveLogo when delete button is clicked on an uploaded file', () => {
    const mockHandleRemoveLogo = jest.fn();

    const { getByTestId } = renderWithProviders(
      <PublisherLogoSettings
        handleAddLogos={mockHandleAddLogos}
        handleRemoveLogo={mockHandleRemoveLogo}
        handleUpdateDefaultLogo={jest.fn}
        isLoading={false}
        publisherLogos={formattedPublisherLogos}
      />
    );

    const ContextMenu = getByTestId('publisher-logo-context-menu-1');
    expect(ContextMenu).toBeInTheDocument();

    const DeleteFileButton = within(ContextMenu).getByText(/^Delete$/);
    expect(DeleteFileButton).toBeInTheDocument();

    fireEvent.click(DeleteFileButton);
    expect(mockHandleRemoveLogo).toHaveBeenCalledTimes(1);
  });

  it('should trigger mockHandleUpdateDefaultLogo when update default logo button is clicked on an uploaded file', () => {
    const mockHandleDefaultLogo = jest.fn();

    const { getByTestId } = renderWithProviders(
      <PublisherLogoSettings
        handleAddLogos={mockHandleAddLogos}
        handleRemoveLogo={jest.fn}
        handleUpdateDefaultLogo={mockHandleDefaultLogo}
        isLoading={false}
        publisherLogos={formattedPublisherLogos}
      />
    );

    const ContextMenu = getByTestId('publisher-logo-context-menu-1');
    expect(ContextMenu).toBeInTheDocument();

    const UpdateDefaultLogoButton = within(ContextMenu)
      .getByText(/^Set as Default$/)
      .closest('li');

    expect(UpdateDefaultLogoButton).toBeDefined();

    fireEvent.click(UpdateDefaultLogoButton);
    expect(mockHandleDefaultLogo).toHaveBeenCalledTimes(1);
  });

  it('should trigger mockHandleUpdateDefaultLogo when update default logo button is pressed with enter on an uploaded file', () => {
    const mockHandleDefaultLogo = jest.fn();
    const { getByTestId } = renderWithProviders(
      <PublisherLogoSettings
        handleAddLogos={mockHandleAddLogos}
        handleRemoveLogo={jest.fn}
        handleUpdateDefaultLogo={mockHandleDefaultLogo}
        isLoading={false}
        publisherLogos={formattedPublisherLogos}
      />
    );
    const ContextMenuButton = getByTestId(
      'publisher-logo-context-menu-button-1'
    );

    fireEvent.click(ContextMenuButton);

    const ContextMenu = getByTestId('publisher-logo-context-menu-1');
    expect(ContextMenu).toBeInTheDocument();

    const UpdateDefaultLogoButton = within(ContextMenu)
      .getByText(/^Set as Default$/)
      .closest('li');

    expect(UpdateDefaultLogoButton).toBeDefined();

    fireEvent.keyDown(UpdateDefaultLogoButton, { key: 'Enter', keyCode: 13 });

    expect(mockHandleDefaultLogo).toHaveBeenCalledTimes(1);
  });
});
