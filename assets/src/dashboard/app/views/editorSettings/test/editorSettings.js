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
import {
  publisherLogoIds,
  rawPublisherLogos,
} from '../../../../dataUtils/formattedPublisherLogos';
import { renderWithProviders } from '../../../../testUtils';
import { TEXT as GA_TEXT } from '../googleAnalytics';
import { TEXT as PUBLISHER_LOGO_TEXT } from '../publisherLogo';
import EditorSettings from '../';

const mockFetchSettings = jest.fn();
const mockFetchMediaById = jest.fn();
const mockUploadMedia = jest.fn();
const mockUpdateSettings = jest.fn();
const mockFetchCurrentUser = jest.fn();

function createProviderValues({
  canUploadFiles,
  canManageSettings,
  activeLogoId,
  isLoading,
  googleAnalyticsId,
  logoIds,
  logos,
}) {
  return {
    config: {
      capabilities: {
        canUploadFiles: canUploadFiles,
        canManageSettings: canManageSettings,
      },
      maxUpload: 104857600,
      maxUploadFormatted: '100 MB',
    },
    api: {
      state: {
        settings: {
          googleAnalyticsId,
          activePublisherLogoId: activeLogoId,
          publisherLogoIds: logoIds,
        },
        media: {
          isLoading,
          newlyCreatedMediaIds: [],
          mediaById: logos,
        },
        currentUser: {
          isUpdating: false,
          data: {
            id: 1,
            meta: {
              web_stories_tracking_optin: true,
            },
          },
        },
      },
      actions: {
        settingsApi: {
          fetchSettings: mockFetchSettings,
          updateSettings: mockUpdateSettings,
        },
        mediaApi: {
          uploadMedia: mockUploadMedia,
          fetchMediaById: mockFetchMediaById,
        },
        usersApi: {
          fetchCurrentUser: mockFetchCurrentUser,
        },
      },
    },
  };
}

describe('Editor Settings: <Editor Settings />', function () {
  it('should render settings page with google analytics and publisher logo sections', function () {
    const { getByText, getByRole, getByTestId } = renderWithProviders(
      <EditorSettings />,
      createProviderValues({
        googleAnalyticsId: 'UA-098909-05',
        canUploadFiles: true,
        canManageSettings: true,
        isLoading: false,
        logoIds: [],
        logos: {},
      })
    );

    const googleAnalyticsHeading = getByText(GA_TEXT.SECTION_HEADING);
    expect(googleAnalyticsHeading).toBeInTheDocument();

    const input = getByRole('textbox');
    expect(input).toBeDefined();

    expect(input.value).toBe('UA-098909-05');

    expect(getByText(PUBLISHER_LOGO_TEXT.SECTION_HEADING)).toBeInTheDocument();
    expect(getByTestId('upload-file-input')).toBeInTheDocument();
    expect(mockFetchSettings).toHaveBeenCalledTimes(1);
  });

  it('should render settings page with publisher logos', function () {
    const { queryAllByTestId } = renderWithProviders(
      <EditorSettings />,
      createProviderValues({
        googleAnalyticsId: 'UA-098909-05',
        canUploadFiles: true,
        canManageSettings: true,
        isLoading: false,
        activeLogoId: publisherLogoIds[0],
        logoIds: publisherLogoIds,
        logos: rawPublisherLogos,
      })
    );

    expect(queryAllByTestId(/^uploaded-publisher-logo-/)).toHaveLength(
      publisherLogoIds.length
    );
  });

  it('should call mockUpdateSettings when a logo is removed', function () {
    const { getByTestId, getByRole } = renderWithProviders(
      <EditorSettings />,
      createProviderValues({
        googleAnalyticsId: 'UA-098909-05',
        canUploadFiles: true,
        canManageSettings: true,
        isLoading: false,
        activeLogoId: publisherLogoIds[0],
        logoIds: publisherLogoIds,
        logos: rawPublisherLogos,
      })
    );

    const ContextMenuButton = getByTestId(
      'publisher-logo-context-menu-button-1'
    );

    fireEvent.click(ContextMenuButton);

    const ContextMenu = getByTestId('publisher-logo-context-menu-1');
    expect(ContextMenu).toBeDefined();

    const { getByText } = within(ContextMenu);

    const DeleteFileButton = getByText('Delete');
    expect(DeleteFileButton).toBeDefined();

    fireEvent.click(DeleteFileButton);

    const DeleteDialog = getByRole('dialog');
    expect(DeleteDialog).toBeDefined();

    const ConfirmDeleteButton = within(DeleteDialog).getByText('Delete Logo');
    expect(ConfirmDeleteButton).toBeDefined();

    fireEvent.click(ConfirmDeleteButton);

    expect(mockUpdateSettings).toHaveBeenCalledTimes(1);
  });

  it('should render settings page without file upload section when canUploadFiles is false', function () {
    const { queryAllByTestId } = renderWithProviders(
      <EditorSettings />,
      createProviderValues({
        googleAnalyticsId: 'UA-098909-05',
        canUploadFiles: false,
        canManageSettings: true,
        isLoading: false,
        logoIds: [],
        logos: {},
      })
    );

    expect(queryAllByTestId('upload-file-input')).toHaveLength(0);
  });
});
