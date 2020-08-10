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
import { validateGoogleAnalyticsIdFormat } from '../../../../utils';
import { InlineInputForm } from '../../../../components';
import {
  FormContainer,
  SettingForm,
  SettingHeading,
  TextInputHelperText,
} from '../components';

export const TEXT = {
  CONTEXT: __(
    "The story editor will append a default, configurable AMP analytics configuration to your story. If you're interested in going beyond what the default configuration is, read this article.",
    'web-stories'
  ), // TODO update this text to have link to article once confirmed what article is
  SECTION_HEADING: __('Google Analytics Tracking ID', 'web-stories'),
  PLACEHOLDER: __('Enter your Google Analtyics Tracking ID', 'web-stories'),
  ARIA_LABEL: __('Enter your Google Analtyics Tracking ID', 'web-stories'),
  INPUT_ERROR: __('Invalid ID format', 'web-stories'),
};

function GoogleAnalyticsSettings({
  googleAnalyticsId = '',
  handleUpdateSettings,
  canManageSettings,
}) {
  const [analyticsId, setAnalyticsId] = useState(googleAnalyticsId);
  const [inputError, setInputError] = useState('');

  const handleCancelUpdateId = useCallback(() => {
    setAnalyticsId(googleAnalyticsId);
  }, [googleAnalyticsId]);

  const handleUpdateId = useCallback(
    (value) => {
      if (value.length === 0 || validateGoogleAnalyticsIdFormat(value)) {
        setInputError('');
        return handleUpdateSettings({ newGoogleAnalyticsId: value });
      }
      return setInputError(TEXT.INPUT_ERROR);
    },
    [handleUpdateSettings, setInputError]
  );

  return (
    <SettingForm onSubmit={(e) => e.preventDefault()}>
      <SettingHeading htmlFor="gaTrackingID">
        {TEXT.SECTION_HEADING}
      </SettingHeading>
      <FormContainer>
        <InlineInputForm
          label={TEXT.ARIA_LABEL}
          id="gaTrackingId"
          value={analyticsId}
          onEditCancel={handleCancelUpdateId}
          onEditComplete={handleUpdateId}
          placeholder={TEXT.PLACEHOLDER}
          disabled={!canManageSettings}
          error={inputError}
        />
        <TextInputHelperText>{TEXT.CONTEXT}</TextInputHelperText>
      </FormContainer>
    </SettingForm>
  );
}
GoogleAnalyticsSettings.propTypes = {
  handleUpdateSettings: PropTypes.func,
  canManageSettings: PropTypes.bool,
  googleAnalyticsId: PropTypes.string,
};

export default GoogleAnalyticsSettings;
