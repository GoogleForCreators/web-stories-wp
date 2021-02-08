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
import { __, sprintf, TranslateWithMarkup } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import {
  validateAdSensePublisherIdFormat,
  validateAdSenseSlotIdFormat,
} from '../../../../utils';
import {
  ErrorText,
  FormContainer,
  SettingsTextInput,
  InlineForm,
  InlineLink,
  SaveButton,
  SettingForm,
  SettingHeading,
  TextInputHelperText,
  VisuallyHiddenLabel,
} from '../components';
import { trackClick } from '../../../../../tracking';

export const TEXT = {
  PUBLISHER_ID_CONTEXT: sprintf(
    /* translators: 1: first example. 2: second example. */
    __(
      'Example: %1$s or %2$s. <a>Find your AdSense Publisher ID</a>.',
      'web-stories'
    ),
    'pub-1234567891234567',
    'ca-pub-1234567891234567'
  ),
  PUBLISHER_ID_CONTEXT_LINK: __(
    'https://support.google.com/adsense/answer/105516',
    'web-stories'
  ),
  PUBLISHER_ID_PLACEHOLDER: __('Enter your Publisher ID', 'web-stories'),
  PUBLISHER_ID_LABEL: __('Google AdSense Publisher ID', 'web-stories'),
  SLOT_ID_CONTEXT: sprintf(
    /* translators: %s: example value. */
    __('Example: %s', 'web-stories'),
    '1234567890'
  ),
  SLOT_ID_PLACEHOLDER: __('Enter your Slot ID', 'web-stories'),
  SLOT_ID_LABEL: __('Google AdSense Slot ID', 'web-stories'),
  INPUT_ERROR: __('Invalid ID format', 'web-stories'),
  SUBMIT_BUTTON: __('Save', 'web-stories'),
};

function GoogleAdSenseSettings({
  publisherId: adSensePublisherId,
  slotId: adSenseSlotId,
  handleUpdatePublisherId,
  handleUpdateSlotId,
}) {
  const [publisherId, setPublisherId] = useState(adSensePublisherId);
  const [publisherIdInputError, setPublisherIdInputError] = useState('');
  const canSavePublisherId =
    publisherId !== adSensePublisherId && !publisherIdInputError;
  const disablePublisherIdSaveButton = !canSavePublisherId;

  const [slotId, setSlotId] = useState(adSenseSlotId);
  const [slotIdInputError, setSlotIdInputError] = useState('');
  const canSaveSlotId = slotId !== adSenseSlotId && !slotIdInputError;
  const disableSlotIdSaveButton = !canSaveSlotId;

  useEffect(() => {
    setPublisherId(adSensePublisherId);
  }, [adSensePublisherId]);

  const onUpdatePublisherId = useCallback((event) => {
    const { value } = event.target;
    setPublisherId(value);

    if (value.length === 0 || validateAdSensePublisherIdFormat(value)) {
      setPublisherIdInputError('');

      return;
    }

    setPublisherIdInputError(TEXT.INPUT_ERROR);
  }, []);

  const onSavePublisherId = useCallback(() => {
    if (canSavePublisherId) {
      handleUpdatePublisherId(publisherId);
    }
  }, [canSavePublisherId, publisherId, handleUpdatePublisherId]);

  const onKeyDownPublisherId = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onSavePublisherId();
      }
    },
    [onSavePublisherId]
  );

  useEffect(() => {
    setSlotId(adSenseSlotId);
  }, [adSenseSlotId]);

  const onUpdateSlotId = useCallback((event) => {
    const { value } = event.target;
    setSlotId(value);

    if (value.length === 0 || validateAdSenseSlotIdFormat(value)) {
      setSlotIdInputError('');

      return;
    }

    setSlotIdInputError(TEXT.INPUT_ERROR);
  }, []);

  const onSaveSlotId = useCallback(() => {
    if (canSaveSlotId) {
      handleUpdateSlotId(slotId);
    }
  }, [canSaveSlotId, slotId, handleUpdateSlotId]);

  const onKeyDownSlotId = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onSaveSlotId();
      }
    },
    [onSaveSlotId]
  );

  const handleClick = useCallback(
    (evt) =>
      trackClick(
        evt,
        'monetization',
        'dashboard',
        TEXT.PUBLISHER_ID_CONTEXT_LINK
      ),
    []
  );

  return (
    <>
      <SettingForm onSubmit={(e) => e.preventDefault()}>
        <SettingHeading />
        <FormContainer>
          <InlineForm>
            <VisuallyHiddenLabel htmlFor="adSensePublisherId">
              {TEXT.PUBLISHER_ID_LABEL}
            </VisuallyHiddenLabel>
            <SettingsTextInput
              id="adSensePublisherId"
              name="adSensePublisherId"
              data-testid="adSensePublisherId"
              value={publisherId}
              onChange={onUpdatePublisherId}
              onKeyDown={onKeyDownPublisherId}
              placeholder={TEXT.PUBLISHER_ID_PLACEHOLDER}
              error={publisherIdInputError}
            />
            <SaveButton
              isDisabled={disablePublisherIdSaveButton}
              onClick={onSavePublisherId}
              data-testid="adSensePublisherIdButton"
            >
              {TEXT.SUBMIT_BUTTON}
            </SaveButton>
          </InlineForm>
          {publisherIdInputError && (
            <ErrorText>{publisherIdInputError}</ErrorText>
          )}
          <TextInputHelperText>
            <TranslateWithMarkup
              mapping={{
                a: (
                  <InlineLink
                    href={TEXT.PUBLISHER_ID_CONTEXT_LINK}
                    rel="noreferrer"
                    target="_blank"
                    onClick={handleClick}
                  />
                ),
              }}
            >
              {TEXT.PUBLISHER_ID_CONTEXT}
            </TranslateWithMarkup>
          </TextInputHelperText>
        </FormContainer>
      </SettingForm>
      <SettingForm onSubmit={(e) => e.preventDefault()}>
        <SettingHeading />
        <FormContainer>
          <InlineForm>
            <VisuallyHiddenLabel htmlFor="adSenseSlotId">
              {TEXT.SLOT_ID_LABEL}
            </VisuallyHiddenLabel>
            <SettingsTextInput
              id="adSenseSlotId"
              name="adSenseSlotId"
              data-testid="adSenseSlotId"
              value={slotId}
              onChange={onUpdateSlotId}
              onKeyDown={onKeyDownSlotId}
              placeholder={TEXT.SLOT_ID_PLACEHOLDER}
              error={slotIdInputError}
            />
            <SaveButton
              isDisabled={disableSlotIdSaveButton}
              onClick={onSaveSlotId}
              data-testid="adSenseSlotIdButton"
            >
              {TEXT.SUBMIT_BUTTON}
            </SaveButton>
          </InlineForm>
          {slotIdInputError && <ErrorText>{slotIdInputError}</ErrorText>}
          <TextInputHelperText>{TEXT.SLOT_ID_CONTEXT}</TextInputHelperText>
        </FormContainer>
      </SettingForm>
    </>
  );
}
GoogleAdSenseSettings.propTypes = {
  handleUpdatePublisherId: PropTypes.func,
  handleUpdateSlotId: PropTypes.func,
  publisherId: PropTypes.string,
  slotId: PropTypes.string,
};

export default GoogleAdSenseSettings;
