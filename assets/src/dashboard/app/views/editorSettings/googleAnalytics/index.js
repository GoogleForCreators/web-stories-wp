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
import { useContext, useState, useCallback, useEffect } from 'react';

/**
 * Internal dependencies
 */
import {
  SettingForm,
  SettingHeading,
  TextInput,
  TextInputHelperText,
} from '../components';
import { ApiContext } from '../../../api/apiProvider';

const TEXT = {
  CONTEXT: __(
    "The story editor will append a default, configurable AMP analytics configuration to your story. If you're interested in going beyond what the default configuration is, read this article.",
    'web-stories'
  ),
  SECTION_HEADING: __('Google Analytics Tracking ID', 'web-stories'),
  PLACEHOLDER: __('Enter your Google Analtyics Tracking ID', 'web-stories'),
  ARIA_LABEL: __('Enter your Google Analtyics Tracking ID', 'web-stories'),
};
// todo add link
function GoogleAnalyticsSettings() {
  const {
    actions: {
      settingsApi: { fetchGoogleAnalyticsId, updateGoogleAnalyticsId },
    },
    state: {
      settings: { googleAnalyticsId },
    },
  } = useContext(ApiContext);

  const [analyticsId, setAnalyticsId] = useState(googleAnalyticsId);

  useEffect(() => {
    fetchGoogleAnalyticsId();
  }, [fetchGoogleAnalyticsId]);

  const handleCancelUpdateId = useCallback(() => {
    setAnalyticsId(googleAnalyticsId);
  }, [googleAnalyticsId]);

  const handleCompleteUpdateId = useCallback(
    (newValue) => {
      updateGoogleAnalyticsId(newValue);
    },
    [updateGoogleAnalyticsId]
  );

  return (
    <SettingForm>
      <SettingHeading htmlFor="gaTrackingID">
        {TEXT.SECTION_HEADING}
      </SettingHeading>
      <div>
        <TextInput
          label={TEXT.ARIA_LABEL}
          id="gaTrackingId"
          value={analyticsId}
          onEditCancel={handleCancelUpdateId}
          onEditComplete={handleCompleteUpdateId}
          placeholder={TEXT.placeholder}
        />
        <TextInputHelperText>{TEXT.CONTEXT}</TextInputHelperText>
      </div>
    </SettingForm>
  );
}

export default GoogleAnalyticsSettings;
