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
import { useCallback, useEffect, useState } from 'react';

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

const COLOR_HEIGHT = 35;

const buttonCSS = css`
  background: transparent;
  width: 30px;
  height: 28px;
  border: none;
  color: ${({ theme }) => rgba(theme.colors.fg.v1, 0.84)};
  cursor: pointer;
  padding: 0;
`;

// Since the whole wrapper title is already a button, can't use button directly here.
const AddColorPresetButton = styled.div.attrs({
  role: 'button',
})`
  ${buttonCSS}
  svg {
    width: 26px;
    height: 28px;
  }
`;

const EditModeButton = styled.div.attrs({
  role: 'button',
})`
  ${buttonCSS}
  height: 20px;
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

const Color = styled.button`
  ${colorCSS}
  background: ${({ backgroundColor, backgroundImage }) =>
    backgroundColor ? backgroundColor : backgroundImage};
`;

const Colors = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  max-height: ${6 * COLOR_HEIGHT + 5}px;
  overflow-y: scroll;
`;

const ButtonWrapper = styled.div`
  flex-basis: 16%;
  height: ${COLOR_HEIGHT}px;
`;

const ColorGroupLabel = styled.div`
  color: ${({ theme }) => theme.colors.fg.v1};
  font-size: 10px;
  line-height: 12px;
  text-transform: uppercase;
  padding: 6px 0;
`;

function StylePresetPanel() {
  const {
    state: {
      selectedElementIds,
      selectedElements,
      story: { stylePresets },
    },
    actions: { updateStory, updateElementsById },
  } = useStory();

  const { colors, textColors } = stylePresets;

  const [isEditMode, setIsEditMode] = useState(false);

  const isText =
    selectedElements.length > 0 &&
    selectedElements.every(({ type }) => 'text' === type);

  const handleDeleteColor = useCallback(
    (toDelete) => {
      updateStory({
        properties: {
          stylePresets: {
            ...stylePresets,
            colors: isText
              ? colors
              : colors.filter((color) => color !== toDelete),
            textColors: !isText
              ? textColors
              : textColors.filter((color) => color !== toDelete),
          },
        },
      });
    },
    [colors, isText, stylePresets, textColors, updateStory]
  );

  const handleAddColorPreset = useCallback(
    (evt) => {
      evt.stopPropagation();
      let addedColors = [];
      let addedTextColors = [];
      if (isText) {
        addedTextColors = selectedElements.map(({ color }) => color);
      } else {
        addedColors = selectedElements
          .map(({ backgroundColor }) => {
            return backgroundColor ? backgroundColor : null;
          })
          .filter((color) => color);
      }
      if (addedColors.length > 0 || addedTextColors.length > 0) {
        updateStory({
          properties: {
            stylePresets: {
              ...stylePresets,
              colors: [...colors, ...addedColors],
              textColors: [...textColors, ...addedTextColors],
            },
          },
        });
      }
    },
    [isText, selectedElements, updateStory, stylePresets, colors, textColors]
  );

  const handleApplyColor = useCallback(
    (color) => {
      if (isText) {
        updateElementsById({
          elementIds: selectedElementIds,
          properties: { color },
        });
      } else {
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
    [isText, selectedElementIds, updateElementsById]
  );

  const colorPresets = isText ? textColors : colors;
  const groupLabel = isText
    ? __('Text colors', 'web-stories')
    : __('Colors', 'web-stories');
  const hasColorPresets = colorPresets.length > 0;

  useEffect(() => {
    // If there are no colors left, exit edit mode.
    if (isEditMode && !hasColorPresets) {
      setIsEditMode(false);
    }
  }, [hasColorPresets, isEditMode]);

  const getSecondaryActions = () => {
    return !isEditMode ? (
      <>
        {hasColorPresets && (
          <EditModeButton
            onClick={(evt) => {
              evt.stopPropagation();
              setIsEditMode(true);
            }}
            aria-label={__('Enter preset edit mode', 'web-stories')}
          >
            <Edit />
          </EditModeButton>
        )}
        <AddColorPresetButton
          onClick={handleAddColorPreset}
          aria-label={__('Add preset', 'web-stories')}
        >
          <Add />
        </AddColorPresetButton>
      </>
    ) : (
      <ExitEditMode
        onClick={(evt) => {
          evt.stopPropagation();
          setIsEditMode(false);
        }}
        aria-label={__('Exit preset edit mode', 'web-stories')}
      >
        {__('Exit', 'web-stories')}
      </ExitEditMode>
    );
  };

  return (
    <Panel name="stylepreset">
      <PanelTitle
        isPrimary
        secondaryAction={getSecondaryActions()}
        canCollapse={!isEditMode && hasColorPresets}
      >
        {__('Style presets', 'web-stories')}
      </PanelTitle>
      {hasColorPresets && (
        <PanelContent isPrimary>
          <ColorGroupLabel>{groupLabel}</ColorGroupLabel>
          <Colors>
            {colorPresets.map((color, i) => {
              return (
                <ButtonWrapper key={`color-${i}`}>
                  <Color
                    {...generatePatternStyles(color)}
                    onClick={() => {
                      if (isEditMode) {
                        handleDeleteColor(color);
                      } else {
                        handleApplyColor(color);
                      }
                    }}
                    aria-label={
                      isEditMode
                        ? __('Delete preset', 'web-stories')
                        : __('Apply preset', 'web-stories')
                    }
                  >
                    {isEditMode && <Remove />}
                  </Color>
                </ButtonWrapper>
              );
            })}
          </Colors>
        </PanelContent>
      )}
    </Panel>
  );
}

export default StylePresetPanel;
