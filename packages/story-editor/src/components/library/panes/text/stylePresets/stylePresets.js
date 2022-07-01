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
  Headline,
  THEME_CONSTANTS,
  Text,
  BUTTON_TYPES,
  BUTTON_SIZES,
  BUTTON_VARIANTS,
  Icons,
  Button,
  PLACEMENT,
  Popup,
  Disclosure,
} from '@googleforcreators/design-system';
import { __ } from '@googleforcreators/i18n';
import styled from 'styled-components';
import { useCallback, useRef, useState, memo } from '@googleforcreators/react';
import { getHTMLFormatters } from '@googleforcreators/rich-text';

/**
 * Internal dependencies
 */
import { useStory } from '../../../../../app';
import { PRESET_TYPES } from '../../../../../constants';
import useAddPreset from '../../../../../utils/useAddPreset';
import { DEFAULT_PRESET } from '../textPresets';
import StyleGroup from '../../../../styleManager/styleGroup';
import StyleManager, {
  NoStylesWrapper,
  MoreButton,
} from '../../../../styleManager';
import useLibrary from '../../../useLibrary';
import { areAllType } from '../../../../../utils/presetUtils';
import useApplyStyle from '../../../../styleManager/useApplyStyle';
import updateProperties from '../../../../style/updateProperties';
import getUpdatedSizeAndPosition from '../../../../../utils/getUpdatedSizeAndPosition';
import InsertionOverlay from '../../shared/insertionOverlay';
import { Container } from '../../../common/section';

const SectionContainer = styled(Container)`
  padding: 16px 0;
  margin-bottom: -24px;
  border-top: 1px solid ${({ theme }) => theme.colors.divider.tertiary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.divider.tertiary};
`;

const TitleBar = styled.div`
  display: flex;
  padding-bottom: 16px;
  justify-content: space-between;
  align-items: center;
`;

const StylesWrapper = styled.div``;

const StyledButton = styled(Button)`
  margin-left: auto;
`;

const NoStylesText = styled(Text)`
  color: ${({ theme }) => theme.colors.fg.tertiary};
`;

const SPACING = { x: 40 };
const TYPE = 'text';
const STYLE_BUTTON_WIDTH = 150;

function PresetPanel() {
  const { textStyles, isText, updateSelectedElements } = useStory(
    ({ state, actions }) => ({
      isText: Boolean(
        state.selectedElements && areAllType(TYPE, state.selectedElements)
      ),
      textStyles: state.story?.globalStoryStyles?.textStyles || [],
      updateSelectedElements: actions.updateSelectedElements,
    })
  );

  const { insertElement } = useLibrary((state) => ({
    insertElement: state.actions.insertElement,
  }));

  const {
    setColor,
    setFontWeight,
    setLetterSpacing,
    toggleItalic,
    toggleUnderline,
  } = getHTMLFormatters();

  const buttonRef = useRef(null);
  const stylesRef = useRef(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const hasPresets = textStyles.length > 0;

  const pushUpdate = useCallback(
    (update) => {
      updateSelectedElements({
        properties: (element) => {
          const updates = updateProperties(element, update, true);
          const sizeUpdates = getUpdatedSizeAndPosition({
            ...element,
            ...updates,
          });
          return {
            ...updates,
            ...sizeUpdates,
          };
        },
      });
    },
    [updateSelectedElements]
  );

  const handleApplyStyle = useApplyStyle({ pushUpdate });
  const { addGlobalPreset } = useAddPreset({ presetType: PRESET_TYPES.STYLE });

  const addStyledText = (preset) => {
    // Get all the inline styles that saved styles support.
    const { color, fontWeight, isItalic, isUnderline, letterSpacing } = preset;
    let content = DEFAULT_PRESET.content;
    content = setColor(content, color);
    content = setFontWeight(content, fontWeight);
    content = toggleItalic(content, isItalic);
    content = toggleUnderline(content, isUnderline);
    content = setLetterSpacing(content, letterSpacing);

    insertElement(TYPE, {
      ...DEFAULT_PRESET,
      ...preset,
      content,
    });
  };

  const handlePresetClick = (preset) => {
    if (isText) {
      handleApplyStyle(preset);
    } else {
      addStyledText(preset);
      setIsPopupOpen(false);
    }
  };

  // If it's not text, we're displaying insertion overlay and label for adding a new text.
  const styleItemProps = isText
    ? {}
    : {
        activeItemOverlay: <InsertionOverlay />,
        applyLabel: __('Add new text', 'web-stories'),
      };

  return (
    <SectionContainer>
      <TitleBar>
        <Headline
          as="h2"
          size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.XXX_SMALL}
        >
          {__('Saved Styles', 'web-stories')}
        </Headline>
        <StyledButton
          type={BUTTON_TYPES.TERTIARY}
          size={BUTTON_SIZES.SMALL}
          variant={BUTTON_VARIANTS.SQUARE}
          onClick={addGlobalPreset}
          aria-label={__('Add style', 'web-stories')}
          disabled={!isText}
        >
          <Icons.Plus />
        </StyledButton>
      </TitleBar>
      {hasPresets && (
        <>
          <StylesWrapper ref={stylesRef}>
            {/* We only show the insertion overlay if we're inserting -> this means selected elements are not texts */}
            <StyleGroup
              styles={[...textStyles].reverse().slice(0, 2)}
              handleClick={handlePresetClick}
              buttonWidth={STYLE_BUTTON_WIDTH}
              {...styleItemProps}
            />
          </StylesWrapper>
          <MoreButton
            ref={buttonRef}
            onClick={() => setIsPopupOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={isPopupOpen}
          >
            {__('More styles', 'web-stories')}
            <Disclosure isOpen={isPopupOpen} />
          </MoreButton>
          <Popup
            anchor={buttonRef}
            isOpen={isPopupOpen}
            placement={PLACEMENT.RIGHT_START}
            spacing={SPACING}
            renderContents={() => (
              <StyleManager
                styles={textStyles}
                applyStyle={handlePresetClick}
                onClose={() => setIsPopupOpen(false)}
                {...styleItemProps}
              />
            )}
          />
        </>
      )}
      {!hasPresets && (
        <NoStylesWrapper>
          <NoStylesText size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
            {__('No Styles Saved', 'web-stories')}
          </NoStylesText>
        </NoStylesWrapper>
      )}
    </SectionContainer>
  );
}

export default memo(PresetPanel);
