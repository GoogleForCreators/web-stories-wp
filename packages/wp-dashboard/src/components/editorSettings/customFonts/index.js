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
import { useState, useCallback } from '@web-stories-wp/react';
import { __ } from '@web-stories-wp/i18n';
import {
  BUTTON_SIZES,
  BUTTON_TYPES,
  THEME_CONSTANTS,
} from '@web-stories-wp/design-system';
// @todo Replace?
import { isValidUrl } from '@web-stories-wp/story-editor/src/utils/url';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import {
  InlineForm,
  SaveButton,
  SettingForm,
  SettingHeading,
  SettingsTextInput,
  SettingSubheading,
  TextInputHelperText,
} from '../components';

export const TEXT = {
  ADD_CONTEXT: __(
    'Add and manage your custom and brand fonts via link here. They’ll appear in your font list in the editor.',
    'web-stories'
  ),
  REMOVAL: __(
    'Removing a font from this settings page will remove it from your font list in all stories.',
    'web-stories'
  ),
  SECTION_HEADING: __('Custom Fonts', 'web-stories'),
  LABEL: __('Insert Font URL', 'web-stories'),
  INPUT_CONTEXT: __(
    'Insert a public URL to a font file. Allowed formats are .otf, .ttf, .woff.',
    'web-stories'
  ),
  INPUT_ERROR: __('Invalid URL format', 'web-stories'),
  SUBMIT_BUTTON: __('Add Font', 'web-stories'),
};

const AddButton = styled(SaveButton)`
  min-width: 90px;
  margin-top: 32px;
`;

const InputWrapper = styled.div`
  margin-top: 8px;
`;

function CustomFontsSettings() {
  const [fontUrl, setFontUrl] = useState('');
  const [inputError, setInputError] = useState('');
  const canSave = !inputError;

  const handleUpdateFontUrl = useCallback((event) => {
    const { value } = event.target;
    setFontUrl(value);

    if (value.length === 0 || isValidUrl(value)) {
      setInputError('');

      return;
    }

    setInputError(TEXT.INPUT_ERROR);
  }, []);

  const handleOnSave = useCallback(() => {
    if (canSave) {
      // @todo Head fetch + display message + add font metrics.
    }
  }, [canSave]);

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
      <div>
        <SettingHeading as="h3">{TEXT.SECTION_HEADING}</SettingHeading>
        <SettingSubheading size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
          {TEXT.ADD_CONTEXT}
        </SettingSubheading>
        <SettingSubheading size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
          {TEXT.REMOVAL}
        </SettingSubheading>
      </div>
      <InputWrapper>
        <InlineForm>
          <SettingsTextInput
            id="insertFontUrl"
            value={fontUrl}
            onChange={handleUpdateFontUrl}
            onKeyDown={handleOnKeyDown}
            hasError={Boolean(inputError)}
            hint={inputError}
            label={TEXT.LABEL}
          />
          <AddButton
            type={BUTTON_TYPES.SECONDARY}
            size={BUTTON_SIZES.SMALL}
            disabled={inputError}
            onClick={handleOnSave}
          >
            {TEXT.SUBMIT_BUTTON}
          </AddButton>
        </InlineForm>
        <TextInputHelperText
          size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
        >
          {TEXT.INPUT_CONTEXT}
        </TextInputHelperText>
      </InputWrapper>
    </SettingForm>
  );
}

CustomFontsSettings.propTypes = {};

export default CustomFontsSettings;
