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
import styled from 'styled-components';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import PresetPanel from '../presetPanel';
import { Remove } from '../../../../icons';
import generatePatternStyles from '../../../../utils/generatePatternStyles';
import { BACKGROUND_TEXT_MODE } from '../../../../constants';
import { useStory } from '../../../../app/story';
import stripHTML from '../../../../utils/stripHTML';
import { generatePresetStyle } from '../utils';

const REMOVE_ICON_SIZE = 18;

const Preset = styled.button`
  background-color: rgba(255, 255, 255, 0.04);
  display: inline-block;
  border-color: transparent;
  position: relative;
  cursor: pointer;
  border-width: 0;
  border-radius: 4px;
  padding: 0 3px;
  height: 100%;
  width: 100%;
  svg {
    width: ${REMOVE_ICON_SIZE}px;
    height: ${REMOVE_ICON_SIZE}px;
    position: absolute;
    top: calc(50% - ${REMOVE_ICON_SIZE / 2}px);
    left: calc(50% - ${REMOVE_ICON_SIZE / 2}px);
  }
`;

const HighLight = styled.span`
  padding: 0 2px;
  ${({ background }) => generatePatternStyles(background)}
  box-decoration-break: clone;
`;

const LINE_HEIGHT = 20;
const TextWrapper = styled.div`
  display: inline-block;
  text-align: left;
  line-height: ${LINE_HEIGHT}px;
  max-height: ${LINE_HEIGHT * 2 + 3}px;
  overflow: hidden;
  border-radius: 4px;
  padding: 3px;
  ${({ styles }) => styles}
  ${({ background }) => (background ? generatePatternStyles(background) : null)}
`;

function StylePresetPanel() {
  const { selectedElements } = useStory(({ state: { selectedElements } }) => {
    return {
      selectedElements,
    };
  });

  const textContent =
    stripHTML(selectedElements[0].content) || __('Text', 'web-stories');

  const stylePresetRenderer = (
    preset,
    i,
    activeIndex,
    handleOnClick,
    isEditMode
  ) => {
    if (!preset) {
      return null;
    }

    const getStylePresetText = () => {
      const isHighLight =
        preset.backgroundTextMode === BACKGROUND_TEXT_MODE.HIGHLIGHT;
      const isFill = preset.backgroundTextMode === BACKGROUND_TEXT_MODE.FILL;
      return (
        <TextWrapper
          styles={generatePresetStyle(preset, true)}
          background={isFill ? preset.backgroundColor : null}
        >
          {isHighLight ? (
            <HighLight background={preset.backgroundColor}>
              {textContent}
            </HighLight>
          ) : (
            textContent
          )}
        </TextWrapper>
      );
    };

    return (
      <Preset
        tabIndex={activeIndex === i ? 0 : -1}
        preset={preset}
        onClick={() => handleOnClick(preset)}
        aria-label={
          isEditMode
            ? __('Delete style preset', 'web-stories')
            : __('Apply style preset', 'web-stories')
        }
      >
        {getStylePresetText()}
        {isEditMode && <Remove />}
      </Preset>
    );
  };

  return (
    <PresetPanel
      presetType="style"
      title={__('Saved styles', 'web-stories')}
      itemRenderer={stylePresetRenderer}
    />
  );
}
export default StylePresetPanel;
