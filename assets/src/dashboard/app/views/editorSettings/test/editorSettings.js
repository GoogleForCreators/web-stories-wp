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

const mockFetchSettings = jest.fn();

const SettingsWrapper = ({ googleAnalyticsId }) => {
  return (
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
  );
};

SettingsWrapper.propTypes = {
  googleAnalyticsId: PropTypes.string,
};

describe('Editor Settings: <Editor Settings />', function () {
  it('should render settings page with google analytics section', function () {
    const { getByText, getByRole } = renderWithTheme(
      <SettingsWrapper googleAnalyticsId="UA-098909-05" />
    );

    const googleAnalyticsHeading = getByText(GA_TEXT.SECTION_HEADING);
    expect(googleAnalyticsHeading).toBeInTheDocument();

    const input = getByRole('textbox');
    expect(input).toBeDefined();

    expect(input.value).toBe('UA-098909-05');

    expect(mockFetchSettings).toHaveBeenCalledTimes(1);
  });
});
