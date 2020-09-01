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
import PropTypes from 'prop-types';
import { fireEvent } from '@testing-library/react';

/**
 * Internal dependencies
 */
import {
  publisherLogoIds,
  rawPublisherLogos,
} from '../../../../dataUtils/formattedPublisherLogos';
import { renderWithTheme } from '../../../../testUtils';
import { ApiContext } from '../../../api/apiProvider';
import { ConfigProvider } from '../../../config';
import { TEXT as GA_TEXT } from '../googleAnalytics';
import { TEXT as PUBLISHER_LOGO_TEXT } from '../publisherLogo';
import EditorSettings from '../';

const mockFetchSettings = jest.fn();
const mockFetchMediaById = jest.fn();
const mockUploadMedia = jest.fn();
const mockUpdateSettings = jest.fn();

const SettingsWrapper = ({
  canUploadFiles,
  activeLogoId,
  isLoading,
  googleAnalyticsId,
  logoIds,
  logos,
}) => {
  return (
    <ConfigProvider
      config={{
        capabilities: { canUploadFiles: canUploadFiles },
        maxUpload: 104857600,
        maxUploadFormatted: '100 MB',
      }}
    >
      <ApiContext.Provider
        value={{
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
          },
        }}
      >
        <EditorSettings />
      </ApiContext.Provider>
    </ConfigProvider>
  );
};

SettingsWrapper.propTypes = {
  activeLogoId: PropTypes.number,
  canUploadFiles: PropTypes.bool,
  isLoading: PropTypes.bool,
  googleAnalyticsId: PropTypes.string,
  logoIds: PropTypes.array,
  logos: PropTypes.object,
};

describe('Editor Settings: <Editor Settings />', function () {
  it('should render settings page with google analytics and publisher logo sections', function () {
    const { getByText, getByRole, getByTestId } = renderWithTheme(
      <SettingsWrapper
        googleAnalyticsId="UA-098909-05"
        canUploadFiles={true}
        isLoading={false}
        logoIds={[]}
        logos={{}}
      />
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
    const { queryAllByTestId } = renderWithTheme(
      <SettingsWrapper
        googleAnalyticsId="UA-098909-05"
        canUploadFiles={true}
        isLoading={false}
        activeLogoId={publisherLogoIds[0]}
        logoIds={publisherLogoIds}
        logos={rawPublisherLogos}
      />
    );
    expect(queryAllByTestId(/^publisher-logo/)).toHaveLength(
      publisherLogoIds.length
    );

    expect(queryAllByTestId(/^remove-publisher-logo/)).toHaveLength(
      publisherLogoIds.length - 1
    );
  });

  it('should call mockUpdateSettings when a logo is removed', function () {
    const { getByTestId, getByText } = renderWithTheme(
      <SettingsWrapper
        googleAnalyticsId="UA-098909-05"
        canUploadFiles={true}
        isLoading={false}
        activeLogoId={publisherLogoIds[0]}
        logoIds={publisherLogoIds}
        logos={rawPublisherLogos}
      />
    );

    const RemoveLogoButton = getByTestId('remove-publisher-logo-2').lastChild;
    expect(RemoveLogoButton).toBeDefined();

    fireEvent.click(RemoveLogoButton);

    const ConfirmRemoveLogoButton = getByText('Remove Logo');

    fireEvent.click(ConfirmRemoveLogoButton);

    expect(mockUpdateSettings).toHaveBeenCalledTimes(1);
  });

  it('should render settings page without file upload section when canUploadFiles is false', function () {
    const { queryAllByTestId } = renderWithTheme(
      <SettingsWrapper
        googleAnalyticsId="UA-098909-05"
        canUploadFiles={false}
        isLoading={false}
        logoIds={[]}
        logos={{}}
      />
    );

    expect(queryAllByTestId('upload-file-input')).toHaveLength(0);
  });
});
