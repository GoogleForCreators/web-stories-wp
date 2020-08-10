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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
/**
 * External dependencies
 */
import { useCallback, useContext, useEffect } from 'react';

/**
 * Internal dependencies
 */
import { ApiContext } from '../../api/apiProvider';
import { useConfig } from '../../config';
import GoogleAnalyticsSettings from './googleAnalytics';
import { Wrapper, Header, Heading, Main } from './components';

function EditorSettings() {
  const { capabilities: { canManageSettings } = {} } = useConfig();

  const {
    actions: {
      settingsApi: { fetchSettings, updateSettings },
    },
    state: {
      settings: { googleAnalyticsId },
    },
  } = useContext(ApiContext);

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
          canManageSettings={canManageSettings}
        />
      </Main>
    </Wrapper>
  );
}

export default EditorSettings;
