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
import { useCallback, useEffect } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import useApi from '../../api/useApi';
import GoogleAnalyticsSettings from './googleAnalytics';
import { Wrapper, Header, Heading, Main } from './components';

function EditorSettings() {
  const { fetchSettings, updateSettings, googleAnalyticsId } = useApi(
    ({
      actions: {
        settingsApi: { fetchSettings, updateSettings },
      },
      state: {
        settings: { googleAnalyticsId },
      },
    }) => ({ fetchSettings, updateSettings, googleAnalyticsId })
  );

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleCompleteUpdateId = useCallback(
    ({ newGoogleAnalyticsId }) => {
      const updatedSettings = {
        googleAnalyticsId:
          typeof newGoogleAnalyticsId === 'string' && newGoogleAnalyticsId,
      };

      updateSettings(updatedSettings);
    },
    [updateSettings]
  );

  return (
    <Wrapper data-testid="editor-settings">
      <Header>
        <Heading>{__('Settings', 'web-stories')}</Heading>
      </Header>
      <Main>
        <GoogleAnalyticsSettings
          handleUpdateSettings={handleCompleteUpdateId}
          googleAnalyticsId={googleAnalyticsId}
        />
      </Main>
    </Wrapper>
  );
}

export default EditorSettings;
