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
import { ReactComponent as Add } from '../../../icons/add_page.svg';
import { ReactComponent as Edit } from '../../../icons/edit_pencil.svg';
import { ReactComponent as Remove } from '../../../icons/remove.svg';
import { useStory } from '../../../app/story';
import generatePatternStyles from '../../../utils/generatePatternStyles';
import { getDefinitionForType } from '../../../elements';
import { Panel, PanelTitle, PanelContent } from './../panel';

const buttonCSS = css`
  background: transparent;
  width: 30px;
  height: 28px;
  border: none;
  color: ${({ theme }) => rgba(theme.colors.fg.v1, 0.84)};
  cursor: pointer;
  padding: 0;
`;

const AddColorPresetButton = styled.button`
  ${buttonCSS}
  svg {
    width: 26px;
    height: 28px;
  }
`;

const EditModeButton = styled.button`
  ${buttonCSS}
  svg {
    width: 16px;
    height: 20px;
  }
`;

const ExitEditMode = styled.a`
  ${buttonCSS}
  color: ${({ theme }) => theme.colors.fg.v1};
  font-size: 12px;
  line-height: 14px;
  padding: 7px;
  height: initial;
`;

const colorCSS = css`
  display: inline-block;
  width: 30px;
  height: 30px;
  border-radius: 15px;
  border: 0.5px solid ${({ theme }) => rgba(theme.colors.fg.v1, 0.3)};
  padding: 0;
  svg {
    width: 18px;
    height: 28px;
  }
`;

const textCSS = css`
  font-size: 16px;
  line-height: 20px;
  font-weight: 600;
`;

const BackgroundColor = styled.button`
  ${textCSS}
  ${colorCSS}
  color: ${({ theme }) => theme.colors.fg.v1};
  background: ${({ backgroundColor, backgroundImage }) =>
    backgroundColor ? backgroundColor : backgroundImage};
`;

const TextColor = styled.button`
  ${colorCSS}
  background: none;
  border-color: transparent;
  ${textCSS}
  color: ${({ color }) => color};
`;

const Colors = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  overflow: auto;
`;

const ButtonWrapper = styled.div`
  flex-basis: 16%;
  height: 35px;
`;

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

  const handleDeleteColor = useCallback(
    (toDelete) => {
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
    (color) => {
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
    },
    [selectedElementIds, updateElementsById]
  );

  const isText =
    selectedElements.length > 0 &&
    selectedElements.every(({ type }) => 'text' === type);

  const handleAddColorPreset = useCallback(() => {
    let addedColorPresets = [];
    if (isText) {
      addedColorPresets = selectedElements.map(({ color }) => color);
    } else {
      addedColorPresets = selectedElements
        .map(({ backgroundColor }) => {
          return backgroundColor ? backgroundColor : null;
        })
        .filter((color) => color);
    }
    if (addedColorPresets.length > 0) {
      updateStory({
        properties: {
          colorPresets: [...colorPresets, ...addedColorPresets],
        },
      });
    }
  }, [isText, colorPresets, selectedElements, updateStory]);

  const handleApplyTextColor = useCallback(
    (color) => () => {
      if (isText) {
        updateElementsById({
          elementIds: selectedElementIds,
          properties: { color },
        });
      }
    },
    [isText, selectedElementIds, updateElementsById]
  );

  const getSecondaryActions = () => {
    return !isEditMode ? (
      <>
        <EditModeButton
          onClick={(evt) => {
            evt.stopPropagation();
            setIsEditMode(true);
          }}
        >
          <Edit />
        </EditModeButton>
        <AddColorPresetButton ref={ref} onClick={handleAddColorPreset}>
          <Add />
        </AddColorPresetButton>
      </>
    ) : (
      <ExitEditMode
        onClick={(evt) => {
          evt.stopPropagation();
          setIsEditMode(false);
        }}
      >
        {__('Exit', 'web-stories')}
      </ExitEditMode>
    );
  };

  return (
    <Panel name="colorpreset">
      <PanelTitle
        isPrimary
        secondaryAction={getSecondaryActions()}
        canCollapse={!isEditMode}
      >
        {__('Color presets', 'web-stories')}
      </PanelTitle>
      {colorPresets && (
        <PanelContent isPrimary>
          <Colors>
            {colorPresets.map((color) => {
              const isSolid =
                'solid' === color.type || undefined === color.type;
              return (
                <>
                  <ButtonWrapper>
                    <BackgroundColor
                      {...generatePatternStyles(color)}
                      onClick={() => {
                        if (isEditMode) {
                          handleDeleteColor(color);
                        } else {
                          handleApplyBackgroundColor(color);
                        }
                      }}
                    >
                      {isEditMode && <Remove />}
                      {isText && __('A', 'web-stories')}
                    </BackgroundColor>
                  </ButtonWrapper>
                  {isText && !isEditMode && isSolid && (
                    <ButtonWrapper>
                      <TextColor
                        {...generatePatternStyles(color, 'color')}
                        onClick={handleApplyTextColor(color)}
                      >
                        {__('A', 'web-stories')}
                      </TextColor>
                    </ButtonWrapper>
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
