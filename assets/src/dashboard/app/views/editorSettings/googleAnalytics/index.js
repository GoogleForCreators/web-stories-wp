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
import { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { validateGoogleAnalyticsIdFormat } from '../../../../utils';
import {
  ErrorText,
  FormContainer,
  GoogleAnalyticsTextInput,
  InlineLink,
  InlineForm,
  SaveButton,
  SettingForm,
  SettingHeading,
  TextInputHelperText,
  VisuallyHiddenLabel,
} from '../components';

export const TEXT = {
  CONTEXT: __(
    "The story editor will append a default, configurable AMP analytics configuration to your story. If you're interested in going beyond what the default configuration is, read this article:",
    'web-stories'
  ),
  CONTEXT_ARTICLE_LINK:
    'https://blog.amp.dev/2019/08/28/analytics-for-your-amp-stories/',
  CONTEXT_ARTICLE: __('Analytics for your Web Stories', 'web-stories'),
  SECTION_HEADING: __('Google Analytics Tracking ID', 'web-stories'),
  PLACEHOLDER: __('Enter your Google Analytics Tracking ID', 'web-stories'),
  ARIA_LABEL: __('Enter your Google Analytics Tracking ID', 'web-stories'),
  INPUT_ERROR: __('Invalid ID format', 'web-stories'),
  SUBMIT_BUTTON: __('Save', 'web-stories'),
};

function GoogleAnalyticsSettings({ googleAnalyticsId, handleUpdate }) {
  const [analyticsId, setAnalyticsId] = useState(googleAnalyticsId);
  const [inputError, setInputError] = useState('');
  const canSave = analyticsId !== googleAnalyticsId && !inputError;
  const disableSaveButton = !canSave;

  useEffect(() => {
    setAnalyticsId(googleAnalyticsId);
  }, [googleAnalyticsId]);

  const handleUpdateId = useCallback((event) => {
    const { value } = event.target;
    setAnalyticsId(value);

    if (value.length === 0 || validateGoogleAnalyticsIdFormat(value)) {
      setInputError('');

      return;
    }

    setInputError(TEXT.INPUT_ERROR);
  }, []);

  const handleOnSave = useCallback(() => {
    if (canSave) {
      handleUpdate(analyticsId);
    }
  }, [canSave, analyticsId, handleUpdate]);

  const handleOnKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleOnSave();
      }
    },
    [handleOnSave]
  );

  return (
    <SettingForm onSubmit={(e) => e.preventDefault()}>
      <SettingHeading htmlFor="gaTrackingID">
        {TEXT.SECTION_HEADING}
      </SettingHeading>
      <FormContainer>
        <InlineForm>
          <VisuallyHiddenLabel for="gaTrackingId">
            {TEXT.ARIA_LABEL}
          </VisuallyHiddenLabel>
          <GoogleAnalyticsTextInput
            label={TEXT.ARIA_LABEL}
            id="gaTrackingId"
            value={analyticsId}
            onChange={handleUpdateId}
            onKeyDown={handleOnKeyDown}
            placeholder={TEXT.PLACEHOLDER}
            error={inputError}
          />
          <SaveButton isDisabled={disableSaveButton} onClick={handleOnSave}>
            {TEXT.SUBMIT_BUTTON}
          </SaveButton>
        </InlineForm>
        {inputError && <ErrorText>{inputError}</ErrorText>}
        <TextInputHelperText>
          {TEXT.CONTEXT}
          <InlineLink href={TEXT.CONTEXT_ARTICLE_LINK}>
            {TEXT.CONTEXT_ARTICLE}
          </InlineLink>
        </TextInputHelperText>
      </FormContainer>
    </SettingForm>
  );
}
GoogleAnalyticsSettings.propTypes = {
  handleUpdate: PropTypes.func,
  googleAnalyticsId: PropTypes.string,
};

export default GoogleAnalyticsSettings;
