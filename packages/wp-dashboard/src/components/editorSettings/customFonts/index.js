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
import {
  useState,
  useCallback,
  useRef,
  useEffect,
} from '@googleforcreators/react';
import { __, sprintf, translateToExclusiveList } from '@googleforcreators/i18n';
import { isValidUrl, withProtocol } from '@googleforcreators/url';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  Icons,
  Text,
  THEME_CONSTANTS,
  Tooltip,
  themeHelpers,
  useSnackbar,
  useLiveRegion,
} from '@googleforcreators/design-system';

import styled from 'styled-components';
import { trackEvent, trackError } from '@googleforcreators/tracking';

/**
 * Internal dependencies
 */
import PropTypes from 'prop-types';
import {
  InlineForm,
  SaveButton,
  SettingForm,
  SettingHeading,
  SettingsTextInput,
  SettingSubheading,
  TextInputHelperText,
} from '../components';
import { ERRORS } from '../../../constants';
import ConfirmationDialog from './confirmationDialog';
import getFontDataFromUrl from './utils/getFontDataFromUrl';

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
  :focus-within {
    ${({ theme }) => themeHelpers.focusCSS(theme.colors.border.focus)}
  }
`;

// Hidden by default.
const DeleteButton = styled(Button)`
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s, opacity ease-in-out 300ms;
  &:focus {
    ${({ theme }) => themeHelpers.focusCSS(theme.colors.border.focus)}
  }
`;

const FontRow = styled.div`
  padding: 0 12px;
  display: flex;
  height: 32px;
  width: 100%;
  justify-content: space-between;
  transition: background-color ease-in-out 300ms;
  &[aria-selected='true'],
  &:hover,
  &:focus {
    background-color: ${({ theme }) => theme.colors.bg.secondary};

    button {
      visibility: visible;
      opacity: 1;
    }
  }
`;

// 32px is the button width.
const FontData = styled.div`
  line-height: 32px;
  white-space: nowrap;
  display: flex;
  font-size: 14px;
  max-width: calc(100% - 32px);
`;

const StyledText = styled(Text).attrs({
  as: 'span',
})``;

const FontUrl = styled(StyledText)`
  color: ${({ theme }) => theme.colors.fg.tertiary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Divider = styled.div`
  width: 4px;
  height: 4px;
  background-color: ${({ theme }) => theme.colors.standard.black};
  border-radius: ${({ theme }) => theme.borders.radius.round};
  margin: 0 6px;
  align-self: center;
`;

const ALLOWED_FONT_TYPES = ['.otf', '.ttf', '.woff'];
function CustomFontsSettings({
  customFonts = [],
  addCustomFont,
  deleteCustomFont,
}) {
  const speak = useLiveRegion();
  const [fontUrl, setFontUrl] = useState('');
  const [inputError, setInputError] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const canSave = !inputError && fontUrl;
  const currentFontsContainerRef = useRef(null);
  const currentFontsRowsRef = useRef([]);
  const [currentFontsFocusIndex, setCurrentFontsFocusIndex] = useState(0);
  const [currentFontsActiveId, setCurrentFontsActiveId] = useState();
  const { showSnackbar } = useSnackbar();

  const handleUpdateFontUrl = useCallback((event) => {
    const { value } = event.target;
    setFontUrl(value);

    if (value.length === 0 || isValidUrl(withProtocol(value))) {
      setInputError('');

      return;
    }

    setInputError(TEXT.INPUT_ERROR);
  }, []);

  const handleDelete = useCallback(async () => {
    try {
      await deleteCustomFont(toDelete);
      speak(__('Font deleted', 'web-stories'));
    } catch (err) {
      trackError('remove_custom_font', err?.message);
      showSnackbar({
        'aria-label': ERRORS.REMOVE_FONT.MESSAGE,
        message: ERRORS.REMOVE_FONT.MESSAGE,
        dismissible: true,
      });
    } finally {
      setToDelete(null);
      setShowDialog(false);
      setInputError('');
    }
  }, [deleteCustomFont, toDelete, showSnackbar, speak]);

  const handleOnSave = useCallback(async () => {
    if (canSave) {
      const urlWithProtocol = withProtocol(fontUrl);
      try {
        await fetch(urlWithProtocol, {
          method: 'HEAD',
        });
      } catch (err) {
        trackError('add_custom_font', err?.message);
        setInputError(
          __(
            'Please ensure correct CORS settings for allowing font usage on this site.',
            'web-stories'
          )
        );
        return;
      }
      let fontData;
      try {
        trackEvent('add_custom_font', {
          url: urlWithProtocol,
        });
        fontData = await getFontDataFromUrl(urlWithProtocol);
        if (!fontData.family) {
          setInputError(
            __('Something went wrong, please try again.', 'web-stories')
          );
          return;
        }
      } catch (err) {
        trackError('add_custom_font', err?.message);
        setInputError(
          sprintf(
            /* translators: %s: list of allowed font types. */
            __(
              'Getting font data failed, please ensure the URL points directly to a %s file.',
              'web-stories'
            ),
            translateToExclusiveList(ALLOWED_FONT_TYPES)
          )
        );
        return;
      }

      try {
        await addCustomFont({ ...fontData, url: urlWithProtocol });
        setFontUrl('');
      } catch (err) {
        trackError('add_custom_font', err?.message);
        setInputError(
          sprintf(
            /* translators: %s: font name. */
            __('A font with the name %s already exists.', 'web-stories'),
            fontData.family
          )
        );
      }
    }
  }, [addCustomFont, canSave, fontUrl]);

  const handleOnKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleOnSave();
      }
    },
    [handleOnSave]
  );

  useEffect(() => {
    const el = currentFontsRowsRef.current[`row-${currentFontsFocusIndex}`];
    if (el) {
      el.focus();
      setCurrentFontsActiveId(el.id);
    }
  }, [currentFontsFocusIndex]);

  const isListBoxActiveRow = (index) => currentFontsFocusIndex === index;

  // Handles managing the which `font row` index has focus
  // Arrows move the index up or down by 1
  // unless we're at the start or the end
  // after we update the index using setCurrentFontsFocusIndex
  // the element will get focus via the useEffect above el.focus();
  const handleListBoxNav = useCallback(
    (evt) => {
      const { key } = evt;
      if (key === 'ArrowUp') {
        evt.preventDefault();
        setCurrentFontsFocusIndex((index) => Math.max(0, index - 1));
      } else if (key === 'ArrowDown') {
        evt.preventDefault();
        setCurrentFontsFocusIndex((index) =>
          Math.min(customFonts.length - 1, index + 1)
        );
      }
    },
    [customFonts]
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
            disabled={!canSave}
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
            <FontsList
              ref={currentFontsContainerRef}
              role="listbox"
              tabIndex={0}
              onKeyDown={handleListBoxNav}
              aria-activedescendant={
                // sets the active descendant for the listbox to font-${id}
                // if a font "row" is selected
                // defaults to the 1st font in the array which 'will' get focus by default
                currentFontsActiveId ? currentFontsActiveId : customFonts[0]?.id
              }
            >
              {customFonts.map(({ id, family, url }, index) => (
                <FontRow
                  id={`font-${id}`}
                  ref={
                    (el) => (currentFontsRowsRef.current[`row-${index}`] = el) // track the active font row
                  }
                  key={family}
                  role="option"
                  aria-selected={isListBoxActiveRow(index)}
                >
                  <FontData>
                    <StyledText>{family}</StyledText>
                    <Divider />
                    <FontUrl>{url}</FontUrl>
                  </FontData>
                  <Tooltip
                    ignoreMaxOffsetY
                    hasTail
                    title={__('Delete font', 'web-stories')}
                  >
                    <DeleteButton
                      aria-label={sprintf(
                        /*translators: %s: font family. */
                        __('Delete %s', 'web-stories'),
                        family
                      )}
                      type={BUTTON_TYPES.TERTIARY}
                      size={BUTTON_SIZES.SMALL}
                      variant={BUTTON_VARIANTS.SQUARE}
                      onClick={() => {
                        setToDelete(id);
                        setShowDialog(true);
                      }}
                    >
                      <Icons.Trash />
                    </DeleteButton>
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
  deleteCustomFont: PropTypes.func.isRequired,
};

export default CustomFontsSettings;
