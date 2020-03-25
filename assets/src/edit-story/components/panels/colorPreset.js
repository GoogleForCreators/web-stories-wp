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
import styled, { css } from 'styled-components';
import { rgba } from 'polished';
import { useCallback, useRef, useState } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { ReactComponent as Add } from '../../icons/add_page.svg';
import { ReactComponent as Edit } from '../../icons/edit_pencil.svg';
import { useSidebar } from '../sidebar';
import { useStory } from '../../app/story';
import generatePatternStyles from '../../utils/generatePatternStyles';
import { getDefinitionForType } from '../../elements';
import { Panel, PanelTitle, PanelContent } from './panel';

const buttonCSS = css`
  background: transparent;
  width: 28px;
  height: 26px;
  border: 0;
  color: ${({ theme }) => rgba(theme.colors.fg.v1, 0.84)};
  cursor: pointer;
`;
const AddColorPresetButton = styled.div`
  ${buttonCSS}
  margin-right: 9px;
  svg {
    width: 26px;
    height: 28px;
  }
`;

const EditModeButton = styled.div`
  ${buttonCSS}
  svg {
    width: 16px;
    height: 16px;
  }
`;

const ExitEditMode = styled.button``;

const colorCSS = css`
  display: inline-block;
  width: 30px;
  height: 30px;
  border-radius: 15px;
  margin-right: 12px;
  border: 0.5px solid ${({ theme }) => rgba(theme.colors.fg.v1, 0.3)};
`;

const BackgroundColor = styled.div`
  ${colorCSS}
  background: ${({ backgroundColor }) => backgroundColor};
`;

const TextColor = styled.div`
  ${colorCSS}
  color: ${({ color }) => color};
`;

const Colors = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  overflow: auto;

  ${BackgroundColor}:nth-child (6n),
  ${TextColor}:nth-child (6n) {
    margin-right: 0;
  }
`;

// @todo Actual style :)
const RemoveColor = styled.button`
  width: 15px;
  height: 15px;
  background-color: black;
  color: white;
`;

{
  /* TODO: <Panel /> should be refactored for a better accessibility, "secondaryAction" should be a <button /> */
}
function ColorPresetPanel() {
  const {
    state: {
      selectedElementIds,
      selectedElements,
      story: { colorPresets },
    },
    actions: { updateStory, updateElementsById },
  } = useStory();

  const [isEditMode, setIsEditMode] = useState(false);

  const ref = useRef();

  const {
    actions: { showColorPickerAt, hideSidebar },
  } = useSidebar();

  const openColorPicker = useCallback(
    (evt) => {
      evt.preventDefault();
      showColorPickerAt(ref.current, {
        onChange: () => null,
        hasGradient: true,
        hasOpacity: true,
        onClose: hideSidebar,
      });
    },
    [showColorPickerAt, hideSidebar]
  );

  const handleDeleteColor = useCallback(
    (toDelete) => () => {
      const colors = colorPresets.filter((color) => color !== toDelete);
      updateStory({
        properties: {
          colorPresets: colors,
        },
      });
    },
    [colorPresets, updateStory]
  );

  const handleApplyBackgroundColor = useCallback(
    (color) => () => {
      if (!isEditMode) {
        updateElementsById({
          elementIds: selectedElementIds,
          properties: (currentProperties) => {
            const { type } = currentProperties;
            // @todo Is this necessary?
            const { isMedia } = getDefinitionForType(type);
            return isMedia
              ? {}
              : {
                  backgroundColor: color,
                };
          },
        });
      }
    },
    [isEditMode, selectedElementIds, updateElementsById]
  );

  const isText =
    selectedElements.length > 0 &&
    selectedElements.every(({ type }) => 'text' === type);

  const handleApplyTextColor = useCallback(
    (color) => () => {
      if (!isEditMode && isText) {
        updateElementsById({
          elementIds: selectedElementIds,
          properties: { color },
        });
      }
    },
    [isEditMode, isText, selectedElementIds, updateElementsById]
  );

  return (
    <Panel name="colorpreset">
      <PanelTitle
        isPrimary
        secondaryAction={
          !isEditMode ? (
            <>
              <EditModeButton onClick={() => setIsEditMode(true)}>
                <Edit />
              </EditModeButton>
              <AddColorPresetButton ref={ref} onClick={openColorPicker}>
                <Add />
              </AddColorPresetButton>
            </>
          ) : (
            <ExitEditMode onClick={() => setIsEditMode(false)}>
              {__('Exit', 'web-stories')}
            </ExitEditMode>
          )
        }
      >
        {__('Color presets', 'web-stories')}
      </PanelTitle>
      {colorPresets && (
        <PanelContent isPrimary>
          <Colors>
            {colorPresets.map((color) => {
              return (
                <>
                  <BackgroundColor
                    {...generatePatternStyles(color)}
                    onClick={handleApplyBackgroundColor(color)}
                  >
                    {isEditMode && (
                      <RemoveColor onClick={handleDeleteColor(color)}>
                        {__('X', 'web-stories')}
                      </RemoveColor>
                    )}
                  </BackgroundColor>
                  {isText && (
                    <TextColor
                      {...generatePatternStyles(color, 'color')}
                      onClick={handleApplyTextColor(color)}
                    >
                      {isEditMode && (
                        <RemoveColor onClick={handleDeleteColor(color)}>
                          {__('X', 'web-stories')}
                        </RemoveColor>
                      )}
                      {!isEditMode && __('A', 'web-stories')}
                    </TextColor>
                  )}
                </>
              );
            })}
          </Colors>
        </PanelContent>
      )}
    </Panel>
  );
}

export default ColorPresetPanel;
