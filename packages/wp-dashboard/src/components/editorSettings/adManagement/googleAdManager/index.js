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
import { __, sprintf } from '@googleforcreators/i18n';
import {
  BUTTON_SIZES,
  BUTTON_TYPES,
  THEME_CONSTANTS,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { validateAdManagerSlotIdFormat } from '../../utils';
import {
  InlineForm,
  SaveButton,
  SettingsTextInput,
  TextInputHelperText,
  VisuallyHiddenLabel,
} from '../../components';

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
    <>
      <InlineForm>
        <VisuallyHiddenLabel htmlFor="adManagerSlotId">
          {TEXT.SLOT_ID_LABEL}
        </VisuallyHiddenLabel>
        <SettingsTextInput
          id="adManagerSlotId"
          aria-label={TEXT.SLOT_ID_LABEL}
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
        >
          {TEXT.SUBMIT_BUTTON}
        </SaveButton>
      </InlineForm>
      <TextInputHelperText size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
        {TEXT.SLOT_ID_CONTEXT}
      </TextInputHelperText>
    </>
  );
}
GoogleAdManagerSettings.propTypes = {
  handleUpdate: PropTypes.func,
  slotId: PropTypes.string,
};

export default GoogleAdManagerSettings;
