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
import { rgba } from 'polished';
import PropTypes from 'prop-types';
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { BACKGROUND_TEXT_MODE } from '../../../../../constants';
import { generatePresetStyle } from '../utils';
import { Remove } from '../../../../../icons';
import stripHTML from '../../../../../utils/stripHTML';
import { useStory } from '../../../../../app/story';
import generatePatternStyles from '../../../../../utils/generatePatternStyles';

const REMOVE_ICON_SIZE = 16;

const PresetButton = styled.button`
  background-color: ${({ theme }) =>
    rgba(theme.DEPRECATED_THEME.colors.fg.white, 0.16)};
  display: inline-block;
  border-color: transparent;
  position: relative;
  cursor: pointer;
  border-width: 0;
  border-radius: 4px;
  padding: 3px;
  height: 100%;
  width: 100%;
  svg {
    width: ${REMOVE_ICON_SIZE}px;
    height: ${REMOVE_ICON_SIZE}px;
    position: absolute;
    top: calc(50% - ${REMOVE_ICON_SIZE / 2}px);
    left: calc(50% - ${REMOVE_ICON_SIZE / 2}px);
    color: ${({ theme }) => theme.DEPRECATED_THEME.colors.fg.primary};
  }
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
  ${({ background }) => (background ? generatePatternStyles(background) : null)}
`;

function StyleItem({ style, i, activeIndex, handleOnClick, isEditMode }) {
  const { selectedElements } = useStory(({ state: { selectedElements } }) => {
    return {
      selectedElements,
    };
  });
  if (!style) {
    return null;
  }

  const textContent =
    stripHTML(selectedElements[0].content) || __('Text', 'web-stories');

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
      aria-label={
        isEditMode
          ? __('Delete style', 'web-stories')
          : __('Apply style', 'web-stories')
      }
    >
      {getStylePresetText()}
      {isEditMode && <Remove />}
    </PresetButton>
  );
}

StyleItem.propTypes = {
  style: PropTypes.object.isRequired,
  i: PropTypes.number.isRequired,
  activeIndex: PropTypes.number,
  handleOnClick: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool.isRequired,
};

export default StyleItem;
