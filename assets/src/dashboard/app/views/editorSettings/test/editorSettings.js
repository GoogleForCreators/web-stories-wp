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

/**
 * Internal dependencies
 */
import { renderWithTheme } from '../../../../testUtils';
import { ApiContext } from '../../../api/apiProvider';
import EditorSettings from '../';
import { TEXT as GA_TEXT } from '../googleAnalytics';
import { TEXT as PUBLISHER_LOGO_TEXT } from '../publisherLogo';
import { ConfigProvider } from '../../../config';

const mockFetchSettings = jest.fn();
const mockFetchMediaById = jest.fn();
const mockUploadMedia = jest.fn();

const SettingsWrapper = ({
  activePublisherLogoId,
  isLoading,
  googleAnalyticsId,
  publisherLogoIds,
  publisherLogos,
}) => {
  return (
    <ConfigProvider
      config={{ capabilities: { canUploadFiles: true }, maxUpload: 104857600 }}
    >
      <ApiContext.Provider
        value={{
          state: {
            settings: {
              googleAnalyticsId,
              activePublisherLogoId,
              publisherLogoIds,
            },
            media: {
              isLoading,
              uploadedMediaIds: [],
              publisherLogos,
            },
          },
          actions: {
            settingsApi: {
              fetchSettings: mockFetchSettings,
              updateSettings: jest.fn(),
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
  activePublisherLogoId: PropTypes.number,
  isLoading: PropTypes.bool,
  googleAnalyticsId: PropTypes.string,
  publisherLogoIds: PropTypes.array,
  publisherLogos: PropTypes.object,
};

describe('Editor Settings: <Editor Settings />', function () {
  it('should render settings page with google analytics and publisher logo sections', function () {
    const { getByText, getByRole, getByTestId } = renderWithTheme(
      <SettingsWrapper
        googleAnalyticsId="UA-098909-05"
        isLoading={false}
        publisherLogoIds={[]}
        publisherLogos={{}}
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
});
