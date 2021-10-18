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
import { fireEvent, within, screen } from '@testing-library/react';
import { setAppElement } from '@web-stories-wp/design-system';
import {
  renderWithProviders,
  AD_NETWORK_TYPE,
} from '@web-stories-wp/dashboard';

/**
 * Internal dependencies
 */
import EditorSettings from '..';

const rawPublisherLogos = [
  {
    id: 577,
    src: 'https://picsum.photos/96',
    title: 'dummy image 1',
    active: true,
  },
  {
    id: 584,
    src: 'https://picsum.photos/97',
    title: 'dummy image 2',
    active: false,
  },
  {
    id: 582,
    src: 'https://picsum.photos/98',
    title: 'dummy image 3',
    active: false,
  },
  {
    id: 581,
    src: 'https://picsum.photos/99',
    title: 'dummy image 4',
    active: false,
  },
];

const mockFetchSettings = jest.fn();
const mockUploadMedia = jest.fn();
const mockUpdateSettings = jest.fn();
const mockSearch = jest.fn();
const mockGetPageById = jest.fn();
const mockFetchPublisherLogos = jest.fn();
const mockAddPublisherLogo = jest.fn();
const mockRemovePublisherLogo = jest.fn();
const mockSetPublisherLogoAsDefault = jest.fn();

function createProviderValues({
  canUploadFiles,
  canManageSettings,
  isLoading,
  googleAnalyticsId,
  adSensePublisherId = '',
  adSenseSlotId = '',
  adManagerSlotId = '',
  adNetwork = AD_NETWORK_TYPE.NONE,
  publisherLogos,
}) {
  return {
    config: {
      allowedImageMimeTypes: ['image/png', 'image/jpeg', 'image/gif'],
      capabilities: {
        canUploadFiles: canUploadFiles,
        canManageSettings: canManageSettings,
      },
      maxUpload: 104857600,
      maxUploadFormatted: '100 MB',
      archiveURL: 'https://example.com/archive',
    },
    api: {
      state: {
        settings: {
          googleAnalyticsId,
          adSensePublisherId,
          adSenseSlotId,
          adManagerSlotId,
          adNetwork,
          error: {},
          archive: 'default',
          archivePageId: 0,
        },
        media: {
          isLoading,
          newlyCreatedMediaIds: [],
          error: {},
        },
        stories: { error: {} },
        templates: { error: {} },
        currentUser: {
          isUpdating: false,
          data: {
            id: 1,
            meta: {
              web_stories_tracking_optin: true,
              web_stories_media_optimization: true,
            },
          },
        },
        publisherLogos: {
          publisherLogos,
        },
      },
      actions: {
        settingsApi: {
          fetchSettings: mockFetchSettings,
          updateSettings: mockUpdateSettings,
        },
        mediaApi: {
          uploadMedia: mockUploadMedia,
        },
        usersApi: {},
        pagesApi: {
          searchPages: mockSearch,
          getPageById: mockGetPageById,
        },
        publisherLogosApi: {
          fetchPublisherLogos: mockFetchPublisherLogos,
          addPublisherLogo: mockAddPublisherLogo,
          removePublisherLogo: mockRemovePublisherLogo,
          setPublisherLogoAsDefault: mockSetPublisherLogoAsDefault,
        },
      },
    },
  };
}

describe('Editor Settings: <Editor Settings />', function () {
  it('should render settings page with google analytics and publisher logo sections', function () {
    const { container } = renderWithProviders(
      <EditorSettings />,
      createProviderValues({
        googleAnalyticsId: 'UA-098909-05',
        usingLegacyAnalytics: false,
        canUploadFiles: true,
        canManageSettings: true,
        isLoading: false,
        logoIds: [],
        publisherLogos: [],
      })
    );
    setAppElement(container);

    const googleAnalyticsHeading = screen.getByText('Google Analytics');
    expect(googleAnalyticsHeading).toBeInTheDocument();

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();

    expect(input).toHaveValue('UA-098909-05');

    expect(screen.getByText('Publisher Logo')).toBeInTheDocument();
    expect(screen.getByTestId('upload-file-input')).toBeInTheDocument();
    expect(mockFetchSettings).toHaveBeenCalledTimes(1);

    expect(screen.getByText('Monetization')).toBeInTheDocument();
  });

  it('should render settings page with publisher logos', function () {
    const { container } = renderWithProviders(
      <EditorSettings />,
      createProviderValues({
        googleAnalyticsId: 'UA-098909-05',
        usingLegacyAnalytics: false,
        canUploadFiles: true,
        canManageSettings: true,
        isLoading: false,
        publisherLogos: rawPublisherLogos,
      })
    );
    setAppElement(container);

    expect(screen.queryAllByTestId(/^uploaded-publisher-logo-/)).toHaveLength(
      rawPublisherLogos.length
    );
  });

  it('should call mockRemovePublisherLogo when a logo is removed', function () {
    renderWithProviders(
      <EditorSettings />,
      createProviderValues({
        googleAnalyticsId: 'UA-098909-05',
        usingLegacyAnalytics: false,
        canUploadFiles: true,
        canManageSettings: true,
        isLoading: false,
        publisherLogos: rawPublisherLogos,
      })
    );

    const ContextMenuButton = screen.getByTestId(
      'publisher-logo-context-menu-button-1'
    );

    fireEvent.click(ContextMenuButton);

    const ContextMenu = screen.getByTestId('publisher-logo-context-menu-1');
    expect(ContextMenu).toBeInTheDocument();

    const DeleteFileButton = within(ContextMenu).getByText('Delete');
    expect(DeleteFileButton).toBeInTheDocument();

    fireEvent.click(DeleteFileButton);

    expect(mockRemovePublisherLogo).toHaveBeenCalledTimes(1);
  });

  it('should render settings page without file upload section when canUploadFiles is false', function () {
    const { container } = renderWithProviders(
      <EditorSettings />,
      createProviderValues({
        googleAnalyticsId: 'UA-098909-05',
        usingLegacyAnalytics: false,
        canUploadFiles: false,
        canManageSettings: true,
        isLoading: false,
        publisherLogos: [],
      })
    );
    setAppElement(container);

    expect(screen.queryByTestId('upload-file-input')).not.toBeInTheDocument();
  });

  it('should render settings page with AdSense', function () {
    const { container } = renderWithProviders(
      <EditorSettings />,
      createProviderValues({
        googleAnalyticsId: 'UA-098909-05',
        usingLegacyAnalytics: false,
        canUploadFiles: true,
        canManageSettings: true,
        isLoading: false,
        adSensePublisherId: '123',
        adSenseSlotId: '456',
        adManagerSlotId: '',
        adNetwork: AD_NETWORK_TYPE.ADSENSE,
        publisherLogos: [],
      })
    );
    setAppElement(container);

    const helperLink = screen.getByText(
      (_, node) => node.textContent === 'how to monetize your Web Stories',
      {
        selector: 'a',
      }
    );
    expect(helperLink).toBeInTheDocument();
  });
});
