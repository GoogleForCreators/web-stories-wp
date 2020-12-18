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
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { validateAdManagerSlotIdFormat } from '../../../../utils';
import {
  ErrorText,
  FormContainer,
  SettingsTextInput,
  InlineForm,
  SaveButton,
  SettingForm,
  SettingHeading,
  TextInputHelperText,
  VisuallyHiddenLabel,
} from '../components';

export const TEXT = {
  SLOT_ID_CONTEXT: sprintf(
    /* translators: %s: example value. */
    __('Example: %s', 'web-stories'),
    '/123456789/a4a/amp_story_dfp_example'
  ),
  SLOT_ID_PLACEHOLDER: __('Enter your Slot ID', 'web-stories'),
  SLOT_ID_LABEL: __('Google Ad Manager Slot ID', 'web-stories'),
  INPUT_ERROR: __('Invalid ID format', 'web-stories'),
  SUBMIT_BUTTON: __('Save', 'web-stories'),
};

function GoogleAdManagerSettings({ slotId: adManagerSlotId, handleUpdate }) {
  const [slotId, setSlotId] = useState(adManagerSlotId);
  const [slotIdInputError, setSlotIdInputError] = useState('');
  const canSaveSlotId = slotId !== adManagerSlotId && !slotIdInputError;
  const disableSlotIdSaveButton = !canSaveSlotId;

  useEffect(() => {
    setSlotId(adManagerSlotId);
  }, [adManagerSlotId]);

  const onUpdateSlotId = useCallback((event) => {
    const { value } = event.target;
    setSlotId(value);

    if (value.length === 0 || validateAdManagerSlotIdFormat(value)) {
      setSlotIdInputError('');

      return;
    }

    setSlotIdInputError(TEXT.INPUT_ERROR);
  }, []);

  const onSaveSlotId = useCallback(() => {
    if (canSaveSlotId) {
      handleUpdate(slotId);
    }
  }, [canSaveSlotId, slotId, handleUpdate]);

  const onKeyDownSlotId = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onSaveSlotId();
      }
    },
    [onSaveSlotId]
  );

  return (
    <SettingForm onSubmit={(e) => e.preventDefault()}>
      <SettingHeading />
      <FormContainer>
        <InlineForm>
          <VisuallyHiddenLabel htmlFor="adManagerSlotId">
            {TEXT.SLOT_ID_LABEL}
          </VisuallyHiddenLabel>
          <SettingsTextInput
            id="adManagerSlotId"
            value={slotId}
            onChange={onUpdateSlotId}
            onKeyDown={onKeyDownSlotId}
            placeholder={TEXT.SLOT_ID_PLACEHOLDER}
            error={slotIdInputError}
          />
          <SaveButton
            isDisabled={disableSlotIdSaveButton}
            onClick={onSaveSlotId}
          >
            {TEXT.SUBMIT_BUTTON}
          </SaveButton>
        </InlineForm>
        {slotIdInputError && <ErrorText>{slotIdInputError}</ErrorText>}
        <TextInputHelperText>{TEXT.SLOT_ID_CONTEXT}</TextInputHelperText>
      </FormContainer>
    </SettingForm>
  );
}
GoogleAdManagerSettings.propTypes = {
  handleUpdate: PropTypes.func,
  slotId: PropTypes.string,
};

export default GoogleAdManagerSettings;
