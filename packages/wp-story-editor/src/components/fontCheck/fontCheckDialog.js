/*
 * Copyright 2022 Google LLC
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
import PropTypes from 'prop-types';
import { TranslateWithMarkup, __ } from '@googleforcreators/i18n';
import { trackClick } from '@googleforcreators/tracking';
import styled from 'styled-components';
import { useState, useCallback } from '@googleforcreators/react';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  Text,
  THEME_CONSTANTS,
  Icons,
  Link,
} from '@googleforcreators/design-system';

import {
  useStory,
  useConfig,
  Dialog,
  FontPicker,
  TEXT_ELEMENT_DEFAULT_FONT,
} from '@googleforcreators/story-editor';

const DialogContent = styled.div`
  display: grid;
  row-gap: 20px;
`;

const ChevronRight = styled(Icons.ChevronRightSmall)`
  width: 32px;
  height: 32px;
`;

const ChevronLeft = styled(ChevronRight)`
  transform: rotate(180deg);
`;

const StyledLink = styled(Link)`
  display: flex;
  color: ${({ theme }) => theme.colors.standard.black};
  align-items: center;
  font-weight: normal;
  margin: 0 auto 0 0; /* auto forces left-alignment */
`;

const StyledButton = styled(Button)`
  margin-left: 16px;
`;

// Override the DialogActions default styling
// so that the dashboard link aligns to the left,
// while the other actions align to the right.
const ActionsWrap = styled.div`
  display: flex;
  align-self: flex-end;
  width: 100%;
`;

export const FontCheckDialog = ({
  isOpen,
  defaultCloseAction,
  missingFont,
  closeDialog,
}) => {
  const { dashboardLink, dashboardSettingsLink, isRTL } = useConfig();
  const [suggestedFont, setSuggestedFont] = useState(TEXT_ELEMENT_DEFAULT_FONT);
  const { updateElementsByFontFamily } = useStory(({ actions }) => ({
    updateElementsByFontFamily: actions.updateElementsByFontFamily,
  }));

  const onSettingsClick = useCallback((evt) => {
    trackClick(evt, 'click_font_settings');
  }, []);

  const updateMissingFontWithDefault = useCallback(() => {
    updateElementsByFontFamily({
      family: missingFont,
      properties: { font: TEXT_ELEMENT_DEFAULT_FONT },
    });
    closeDialog();
  }, [closeDialog, missingFont, updateElementsByFontFamily]);

  const updateMissingFontWithSelected = useCallback(() => {
    updateElementsByFontFamily({
      family: missingFont,
      properties: { font: suggestedFont },
    });
    closeDialog();
  }, [suggestedFont, closeDialog, missingFont, updateElementsByFontFamily]);

  const Chevron = isRTL ? ChevronRight : ChevronLeft;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={defaultCloseAction}
      title={__('Missing Fonts', 'web-stories')}
      contentLabel={__('Missing Fonts', 'web-stories')}
      actions={
        <ActionsWrap>
          <StyledLink href={dashboardLink}>
            <Chevron />
            {__('Back to dashboard', 'web-stories')}
          </StyledLink>
          <StyledButton
            type={BUTTON_TYPES.SECONDARY}
            size={BUTTON_SIZES.SMALL}
            onClick={updateMissingFontWithDefault}
          >
            {__('Open anyway', 'web-stories')}
          </StyledButton>
          <StyledButton
            type={BUTTON_TYPES.PRIMARY}
            size={BUTTON_SIZES.SMALL}
            onClick={updateMissingFontWithSelected}
          >
            {__('Replace font', 'web-stories')}
          </StyledButton>
        </ActionsWrap>
      }
    >
      <DialogContent>
        <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
          {__(
            'This story contains the following font that is no longer available:',
            'web-stories'
          )}
        </Text>
        <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL} isBold>
          {missingFont}
        </Text>
        <div>
          <TranslateWithMarkup
            mapping={{
              a: (
                <Link
                  size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
                  onClick={onSettingsClick}
                  href={dashboardSettingsLink}
                  isBold
                />
              ),
            }}
          >
            {__(
              'To replace this font with your own or re-add it, go to <a>Settings</a>. To replace this font with a default, open the story.',
              'web-stories'
            )}
          </TranslateWithMarkup>
        </div>
        <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
          {__('Or, choose replacement font below:', 'web-stories')}
        </Text>
        <FontPicker
          zIndex={10}
          currentValue={suggestedFont.family}
          onChange={setSuggestedFont}
        />
      </DialogContent>
    </Dialog>
  );
};

FontCheckDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  defaultCloseAction: PropTypes.func,
  closeDialog: PropTypes.func.isRequired,
  missingFont: PropTypes.string.isRequired,
};
