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
import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { InlineInputForm } from '../../../../components';
import {
  FormContainer,
  SettingForm,
  SettingHeading,
  TextInputHelperText,
} from '../components';

const TEXT = {
  CONTEXT: __(
    "The story editor will append a default, configurable AMP analytics configuration to your story. If you're interested in going beyond what the default configuration is, read this article.",
    'web-stories'
  ), // TODO update this text to have link to article once confirmed what article is
  SECTION_HEADING: __('Google Analytics Tracking ID', 'web-stories'),
  PLACEHOLDER: __('Enter your Google Analtyics Tracking ID', 'web-stories'),
  ARIA_LABEL: __('Enter your Google Analtyics Tracking ID', 'web-stories'),
};

function GoogleAnalyticsSettings({
  googleAnalyticsId = '',
  onUpdateGoogleAnalyticsId,
}) {
  const [analyticsId, setAnalyticsId] = useState(googleAnalyticsId);

  const handleCancelUpdateId = useCallback(() => {
    setAnalyticsId(googleAnalyticsId);
  }, [googleAnalyticsId]);

  const handleCompleteUpdateId = useCallback(
    (newId) => {
      onUpdateGoogleAnalyticsId({ googleAnalyticsId: newId });
    },
    [onUpdateGoogleAnalyticsId]
  );

  return (
    <SettingForm>
      <SettingHeading htmlFor="gaTrackingID">
        {TEXT.SECTION_HEADING}
      </SettingHeading>
      <FormContainer>
        <InlineInputForm
          label={TEXT.ARIA_LABEL}
          id="gaTrackingId"
          value={analyticsId}
          onEditCancel={handleCancelUpdateId}
          onEditComplete={handleCompleteUpdateId}
          placeholder={TEXT.PLACEHOLDER}
        />
        <TextInputHelperText>{TEXT.CONTEXT}</TextInputHelperText>
      </FormContainer>
    </SettingForm>
  );
}
GoogleAnalyticsSettings.propTypes = {
  onUpdateGoogleAnalyticsId: PropTypes.func,
  googleAnalyticsId: PropTypes.string,
};

export default GoogleAnalyticsSettings;
