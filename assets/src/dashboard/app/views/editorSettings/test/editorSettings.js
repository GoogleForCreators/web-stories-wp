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
import EditorSettings from '../';
import { ApiContext } from '../../../api/apiProvider';
import { ConfigProvider } from '../../../config';

const mockFetchSettings = jest.fn();

const SettingsWrapper = ({ canManageSettings, googleAnalyticsId }) => {
  return (
    <ConfigProvider config={{ capabilities: { canManageSettings } }}>
      <ApiContext.Provider
        value={{
          state: {
            settings: {
              googleAnalyticsId,
            },
          },
          actions: {
            settingsApi: {
              fetchSettings: mockFetchSettings,
              updateSettings: jest.fn(),
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
  googleAnalyticsId: PropTypes.string,
  canManageSettings: PropTypes.bool,
};

describe('Editor Settings: <Editor Settings />', function () {
  it('should render settings page with google analytics and publisher logo sections', function () {
    const { getByText, getByRole } = renderWithTheme(
      <SettingsWrapper googleAnalyticsId="123-45-98-not-an-id" />
    );

    const googleAnalyticsHeading = getByText('Google Analytics Tracking ID');
    expect(googleAnalyticsHeading).toBeInTheDocument();

    const publisherLogoHeading = getByText('Publisher Logo');
    expect(publisherLogoHeading).toBeInTheDocument();

    const input = getByRole('textbox');
    expect(input).toBeDefined();

    expect(input.value).toBe('123-45-98-not-an-id');

    expect(mockFetchSettings).toHaveBeenCalledTimes(1);
  });
});
