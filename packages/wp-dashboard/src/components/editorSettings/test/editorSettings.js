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
import { setAppElement } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import EditorSettings from '../editorSettings';
import { rawPublisherLogos } from '../dataUtils/formattedPublisherLogos';
import { TEXT as AD_NETWORK_TEXT } from '../adManagement';
import { TEXT as GA_TEXT } from '../googleAnalytics';
import { TEXT as PUBLISHER_LOGO_TEXT } from '../publisherLogo';
import MockEditorProvider from '../../../testUtils/mockEditorProvider';
import { AD_NETWORK_TYPE } from '../../../constants';
import { renderWithProviders } from '../../../testUtils';

const mockedPromise = Promise.resolve({});

jest.mock('../../../api/settings', () => ({
  fetchSettings: () => mockedPromise,
  updateSettings: () => mockedPromise,
}));

jest.mock('../../../api/media', () => ({
  uploadMedia: () => mockedPromise,
}));

jest.mock('../../../api/pages', () => ({
  searchPages: () => mockedPromise,
  getPageById: () => mockedPromise,
}));

jest.mock('../../../api/publisherLogo', () => ({
  fetchPublisherLogos: () => mockedPromise,
  removePublisherLogo: () => mockedPromise,
  addPublisherLogo: () => mockedPromise,
  setPublisherLogoAsDefault: () => mockedPromise,
}));

jest.mock('../../../api/fonts', () => ({
  addCustomFont: () => mockedPromise,
  deleteCustomFont: () => mockedPromise,
}));

jest.mock('../../../api/user', () => ({
  getUser: () => {
    return Promise.resolve({
      id: 1,
      name: 'dev',
      url: 'https://www.story-link.com',
      description: '',
      link: 'https://www.story-link.com/author/dev/',
      slug: 'dev',
      avatar_urls: {},
      meta: {
        web_stories_tracking_optin: false,
        web_stories_media_optimization: true,
        web_stories_onboarding: {
          safeZone: true,
        },
      },
    });
  },
}));

const mockFetchSettings = jest.fn();
const mockUploadMedia = jest.fn();
const mockUpdateSettings = jest.fn();
const mockSearch = jest.fn();
const mockGetPageById = jest.fn();
const mockFetchPublisherLogos = jest.fn();
const mockAddPublisherLogo = jest.fn();
const mockRemovePublisherLogo = jest.fn();
const mockSetPublisherLogoAsDefault = jest.fn();
const mockAddCustomFont = jest.fn();
const mockDeleteCustomFont = jest.fn();

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
      archiveURL: 'https://example.com/custom-archive/',
      defaultArchiveURL: 'https://example.com/web-stories/',
      api: {
        currentUser: '/web-stories/v1/users/me/',
        fonts: 'web-stories/v1/fonts',
        users: '/web-stories/v1/users/',
        settings: '/web-stories/v1/settings/',
        pages: '/wp/v2/pages/',
        publisherLogos: '/web-stories/v1/publisher-logos/',
      },
      plugins: { siteKit: {}, woocommerce: {} },
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
        currentUser: {
          isUpdating: false,
          data: {
            id: 1,
            meta: {
              webStoriesTrackingOptin: true,
              webStoriesMediaOptimization: true,
            },
          },
        },
        publisherLogos: {
          publisherLogos,
        },
        customFonts: [],
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
        fontsApi: {
          addCustomFont: mockAddCustomFont,
          deleteCustomFont: mockDeleteCustomFont,
        },
      },
    },
  };
}

const renderEditorSettings = (values) => {
  return renderWithProviders(
    <EditorSettings />,
    createProviderValues(values),
    {},
    ({ children }) => children,
    MockEditorProvider
  );
};

describe('Editor Settings: <Editor Settings />', function () {
  afterEach(() => {
    mockFetchSettings.mockReset();
    mockRemovePublisherLogo.mockReset();
  });

  it('should render settings page with google analytics and publisher logo sections', function () {
    const { container } = renderEditorSettings({
      googleAnalyticsId: 'UA-098909-05',
      usingLegacyAnalytics: false,
      canUploadFiles: true,
      canManageSettings: true,
      isLoading: false,
      logoIds: [],
      publisherLogos: [],
    });

    setAppElement(container);

    const googleAnalyticsHeading = screen.getByText(GA_TEXT.SECTION_HEADING);
    expect(googleAnalyticsHeading).toBeInTheDocument();

    const input = screen.getByRole('textbox', {
      name: 'Enter your Google Analytics Tracking ID',
    });
    expect(input).toBeInTheDocument();

    expect(input).toHaveValue('UA-098909-05');

    expect(
      screen.getByText(PUBLISHER_LOGO_TEXT.SECTION_HEADING)
    ).toBeInTheDocument();
    expect(screen.getByTestId('upload-file-input')).toBeInTheDocument();
    expect(mockFetchSettings).toHaveBeenCalledTimes(1);

    expect(
      screen.getByText(AD_NETWORK_TEXT.SECTION_HEADING)
    ).toBeInTheDocument();
  });

  it('should render settings page with publisher logos', function () {
    const { container } = renderEditorSettings({
      googleAnalyticsId: 'UA-098909-05',
      usingLegacyAnalytics: false,
      canUploadFiles: true,
      canManageSettings: true,
      isLoading: false,
      publisherLogos: rawPublisherLogos,
    });

    setAppElement(container);

    expect(screen.queryAllByTestId(/^uploaded-publisher-logo-/)).toHaveLength(
      rawPublisherLogos.length
    );
  });

  it('should call mockRemovePublisherLogo when a logo is removed', function () {
    renderEditorSettings({
      googleAnalyticsId: 'UA-098909-05',
      usingLegacyAnalytics: false,
      canUploadFiles: true,
      canManageSettings: true,
      isLoading: false,
      publisherLogos: rawPublisherLogos,
    });

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
    const { container } = renderEditorSettings({
      googleAnalyticsId: 'UA-098909-05',
      usingLegacyAnalytics: false,
      canUploadFiles: false,
      canManageSettings: true,
      isLoading: false,
      publisherLogos: [],
    });
    setAppElement(container);

    expect(screen.queryByTestId('upload-file-input')).not.toBeInTheDocument();
  });

  it('should render settings page with AdSense', function () {
    const { container } = renderEditorSettings({
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
    });

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
