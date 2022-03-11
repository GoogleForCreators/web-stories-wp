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
import { useState, useCallback, useEffect } from '@googleforcreators/react';
import PropTypes from 'prop-types';
import { __, sprintf, TranslateWithMarkup } from '@googleforcreators/i18n';
import { trackClick } from '@googleforcreators/tracking';
import {
  BUTTON_SIZES,
  BUTTON_TYPES,
  THEME_CONSTANTS,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import {
  validateAdSensePublisherIdFormat,
  validateAdSenseSlotIdFormat,
} from '../../utils';
import {
  InlineForm,
  InlineLink,
  SaveButton,
  SettingsTextInput,
  TextInputHelperText,
  VisuallyHiddenLabel,
} from '../../components';

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
    __(
      'Example: %s. Copy the slot ID from <a>your ad unit’s code</a>. The same ad unit will be used for all of your Web Stories.',
      'web-stories'
    ),
    '1234567890'
  ),
  SLOT_ID_CONTEXT_LINK: __(
    'https://support.google.com/adsense/answer/9274019',
    'web-stories'
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
    (evt) => trackClick(evt, 'click_adsense_publisher_id_docs'),
    []
  );

  return (
    <>
      <InlineForm>
        <VisuallyHiddenLabel htmlFor="adSensePublisherId">
          {TEXT.PUBLISHER_ID_LABEL}
        </VisuallyHiddenLabel>
        <SettingsTextInput
          aria-label={TEXT.PUBLISHER_ID_LABEL}
          id="adSensePublisherId"
          name="adSensePublisherId"
          data-testid="adSensePublisherId"
          value={publisherId}
          onChange={onUpdatePublisherId}
          onKeyDown={onKeyDownPublisherId}
          placeholder={TEXT.PUBLISHER_ID_PLACEHOLDER}
          hasError={Boolean(publisherIdInputError)}
          hint={publisherIdInputError}
        />
        <SaveButton
          type={BUTTON_TYPES.SECONDARY}
          size={BUTTON_SIZES.SMALL}
          disabled={disablePublisherIdSaveButton}
          onClick={onSavePublisherId}
          data-testid="adSensePublisherIdButton"
        >
          {TEXT.SUBMIT_BUTTON}
        </SaveButton>
      </InlineForm>
      <TextInputHelperText size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
        <TranslateWithMarkup
          mapping={{
            a: (
              <InlineLink
                href={TEXT.PUBLISHER_ID_CONTEXT_LINK}
                target="_blank"
                onClick={handleClick}
                size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
              />
            ),
          }}
        >
          {TEXT.PUBLISHER_ID_CONTEXT}
        </TranslateWithMarkup>
      </TextInputHelperText>

      <InlineForm>
        <VisuallyHiddenLabel htmlFor="adSenseSlotId">
          {TEXT.SLOT_ID_LABEL}
        </VisuallyHiddenLabel>
        <SettingsTextInput
          id="adSenseSlotId"
          aria-label={TEXT.SLOT_ID_LABEL}
          name="adSenseSlotId"
          data-testid="adSenseSlotId"
          value={slotId}
          onChange={onUpdateSlotId}
          onKeyDown={onKeyDownSlotId}
          placeholder={TEXT.SLOT_ID_PLACEHOLDER}
          hasError={Boolean(slotIdInputError)}
          hint={slotIdInputError}
        />
        <SaveButton
          type={BUTTON_TYPES.SECONDARY}
          size={BUTTON_SIZES.SMALL}
          disabled={disableSlotIdSaveButton}
          onClick={onSaveSlotId}
          data-testid="adSenseSlotIdButton"
        >
          {TEXT.SUBMIT_BUTTON}
        </SaveButton>
      </InlineForm>
      <TextInputHelperText size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
        <TranslateWithMarkup
          mapping={{
            a: (
              <InlineLink
                href={TEXT.SLOT_ID_CONTEXT_LINK}
                target="_blank"
                size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
              />
            ),
          }}
        >
          {TEXT.SLOT_ID_CONTEXT}
        </TranslateWithMarkup>
      </TextInputHelperText>
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
