/*
 * Copyright 2021 Google LLC
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
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { __ } from '@googleforcreators/i18n';
import { generatePatternStyles } from '@googleforcreators/patterns';
import { Icons, BACKGROUND_TEXT_MODE } from '@googleforcreators/design-system';
import { useState } from '@googleforcreators/react';
import { stripHTML } from '@googleforcreators/dom';

/**
 * Internal dependencies
 */
import { generatePresetStyle } from '../../utils/presetUtils';
import { useStory } from '../../app/story';
import { focusStyle } from '../panels/shared';

const REMOVE_ICON_SIZE = 32;

const PresetButton = styled.button`
  background-color: ${({ theme }) =>
    theme.colors.interactiveBg.secondaryNormal};
  border-color: transparent;
  position: relative;
  cursor: pointer;
  border-width: 0;
  border-radius: 4px;
  padding: 3px;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  > svg {
    width: ${REMOVE_ICON_SIZE}px;
    height: ${REMOVE_ICON_SIZE}px;
    position: absolute;
    top: calc(50% - ${REMOVE_ICON_SIZE / 2}px);
    left: calc(50% - ${REMOVE_ICON_SIZE / 2}px);
    color: ${({ theme }) => theme.colors.fg.primary};
    filter: drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.4));
  }
  ${focusStyle}
`;

const HighLight = styled.span`
  padding: 0 2px;
  ${({ background }) => generatePatternStyles(background)}
  box-decoration-break: clone;
`;

const LINE_HEIGHT = 20;
const TextWrapper = styled.div`
  position: relative;
  display: inline-block;
  line-height: ${LINE_HEIGHT}px;
  max-height: ${LINE_HEIGHT * 2 + 3}px;
  overflow: hidden;
  border-radius: 4px;
  padding: 3px;
  max-width: 100%;
  ${({ styles }) => styles}
  font-size: 12px;
  ${({ background }) => (background ? generatePatternStyles(background) : null)}
`;

function StyleItem({
  style,
  i,
  activeIndex,
  handleOnClick,
  isEditMode,
  activeItemOverlay,
  applyLabel = __('Apply style', 'web-stories'),
}) {
  const selectedElements = useStory(({ state }) => state.selectedElements);
  const [isActive, setIsActive] = useState(false);
  // We only want to change this state if we have the active item overlay.
  const makeActive = () => {
    activeItemOverlay && setIsActive(true);
  };
  const makeInactive = () => {
    activeItemOverlay && setIsActive(false);
  };

  if (!style) {
    return null;
  }

  const textContent = selectedElements[0]?.content
    ? stripHTML(selectedElements[0].content)
    : __('Lorem ipsum dolor sit amet', 'web-stories');

  const getStylePresetText = () => {
    const isHighLight =
      style.backgroundTextMode === BACKGROUND_TEXT_MODE.HIGHLIGHT;
    const isFill = style.backgroundTextMode === BACKGROUND_TEXT_MODE.FILL;
    return (
      <TextWrapper
        styles={generatePresetStyle(style, true)}
        background={isFill ? style.backgroundColor : null}
      >
        {isHighLight ? (
          <HighLight background={style.backgroundColor}>
            {textContent}
          </HighLight>
        ) : (
          textContent
        )}
      </TextWrapper>
    );
  };

  return (
    <PresetButton
      tabIndex={activeIndex === i ? 0 : -1}
      style={style}
      onClick={() => handleOnClick(style)}
      onPointerEnter={makeActive}
      onFocus={makeActive}
      onPointerLeave={makeInactive}
      onBlur={makeInactive}
      aria-label={isEditMode ? __('Delete style', 'web-stories') : applyLabel}
    >
      {getStylePresetText()}
      {isEditMode && <Icons.Cross />}
      {!isEditMode && isActive && activeItemOverlay}
    </PresetButton>
  );
}

StyleItem.propTypes = {
  style: PropTypes.object.isRequired,
  i: PropTypes.number.isRequired,
  activeIndex: PropTypes.number,
  handleOnClick: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool.isRequired,
  activeItemOverlay: PropTypes.node,
  applyLabel: PropTypes.string,
};

export default StyleItem;
