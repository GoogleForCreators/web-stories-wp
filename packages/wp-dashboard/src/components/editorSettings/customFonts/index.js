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
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  Icons,
  Text,
  THEME_CONSTANTS,
  Tooltip,
} from '@web-stories-wp/design-system';
import styled from 'styled-components';
import getFontDataFromUrl from '@web-stories-wp/fonts/src/utils/getFontDataFromUrl';
import { trackEvent } from '@web-stories-wp/tracking';

/**
 * Internal dependencies
 */
import PropTypes from 'prop-types';
import isValidUrl from '../utils/isValidUrl';
import {
  InlineForm,
  SaveButton,
  SettingForm,
  SettingHeading,
  SettingsTextInput,
  SettingSubheading,
  TextInputHelperText,
} from '../components';
import ConfirmationDialog from './confirmationDialog';

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
  FONTS_HEADING: __('Current Fonts', 'web-stories'),
  FONTS_CONTEXT: __(
    'Deleting fonts will delete them from your in-editor font list and all previous stories.',
    'web-stories'
  ),
};

const AddButton = styled(SaveButton)`
  min-width: 90px;
  margin-top: 32px;
`;

const InputsWrapper = styled.div`
  margin-top: 8px;
`;

const FontsWrapper = styled.div`
  margin-top: 34px;
`;

const ListHeading = styled(Text)`
  margin-bottom: 10px;
  display: inline-block;
`;

const FontsList = styled.div`
  padding: 12px 0;
  border: ${({ theme }) => `1px solid ${theme.colors.divider.primary}`};
`;

const FontRow = styled.div`
  padding: 0 12px;
  display: flex;
  height: 32px;
  width: 100%;
  justify-content: space-between;
  &:hover,
  &:focus {
    background-color: ${({ theme }) => theme.colors.bg.secondary};
  }
`;

const FontData = styled.div`
  line-height: 32px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  font-size: 14px;
`;

const StyledText = styled(Text).attrs({
  as: 'span',
})``;

const FontUrl = styled(StyledText)`
  color: ${({ theme }) => theme.colors.fg.tertiary};
`;

const Divider = styled.div`
  width: 4px;
  height: 4px;
  background-color: ${({ theme }) => theme.colors.standard.black};
  border-radius: ${({ theme }) => theme.borders.radius.round};
  margin: 0 6px;
  align-self: center;
`;

function CustomFontsSettings({
  customFonts = [],
  addCustomFont,
  fetchCustomFonts,
  deleteCustomFont,
}) {
  const [fontUrl, setFontUrl] = useState('');
  const [inputError, setInputError] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [toDelete, setToDelete] = useState(null);
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

  const handleDelete = useCallback(() => {
    // @todo Delete font using API!
    // await deleteCustomFont(toDelete);
    // @todo Should we instead not make a fetch and just remove it from the state only?
    // await fetchCustomFonts();
    setToDelete(null);
    setShowDialog(false);
  }, [toDelete]);

  const handleOnSave = useCallback(async () => {
    if (canSave) {
      try {
        await fetch(fontUrl, {
          method: 'HEAD',
        });
      } catch (err) {
        setInputError(
          __('Please ensure correct CORS settings (Copy TODO!)', 'web-stories')
        );
      }
      try {
        trackEvent('add_custom_font', {
          url: fontUrl,
        });
        const fontData = await getFontDataFromUrl(fontUrl);
        if (!fontData.name) {
          setInputError(__('Something went wrong', 'web-stories'));
        } else {
          // @todo Use API to actually add the font as well with ID.
          // await addCustomFont(fontData);
          // await fetchCustomFonts();
          setFontUrl('');
        }
      } catch (err) {
        setInputError(
          __(
            'Getting font data failed, please ensure the URL points to a font file',
            'web-stories'
          )
        );
      }
    }
  }, [canSave, fontUrl]);

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
      <InputsWrapper>
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
            type={BUTTON_TYPES.PRIMARY}
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
        {customFonts?.length > 0 && (
          <FontsWrapper>
            <ListHeading forwardedAs="span">{TEXT.FONTS_HEADING}</ListHeading>
            <FontsList>
              {customFonts.map(({ id, name, url }) => (
                <FontRow key={name}>
                  <FontData>
                    <StyledText>{name}</StyledText>
                    <Divider />
                    <FontUrl>{url}</FontUrl>
                  </FontData>
                  <Tooltip hasTail title={__('Delete font', 'web-stories')}>
                    <Button
                      aria-label={__('Remove file', 'web-stories')}
                      type={BUTTON_TYPES.TERTIARY}
                      size={BUTTON_SIZES.SMALL}
                      variant={BUTTON_VARIANTS.SQUARE}
                      onClick={() => {
                        setToDelete(id);
                        setShowDialog(true);
                      }}
                    >
                      <Icons.Trash />
                    </Button>
                  </Tooltip>
                </FontRow>
              ))}
            </FontsList>
            <TextInputHelperText
              size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
            >
              {TEXT.FONTS_CONTEXT}
            </TextInputHelperText>
          </FontsWrapper>
        )}
      </InputsWrapper>
      {showDialog && (
        <ConfirmationDialog
          onClose={() => setShowDialog(false)}
          onPrimary={handleDelete}
        />
      )}
    </SettingForm>
  );
}

CustomFontsSettings.propTypes = {
  customFonts: PropTypes.array,
  addCustomFont: PropTypes.func.isRequired,
  fetchCustomFonts: PropTypes.func.isRequired,
  deleteCustomFont: PropTypes.func.isRequired,
};

export default CustomFontsSettings;
