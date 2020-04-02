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
import { findMatchingColor } from './utils';

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
// @todo Use custom title instead to use buttons directly.
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

// For max-height: Display 5 extra pixels to show there are more colors.
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

  const { fillColors, textColors } = stylePresets;

  const [isEditMode, setIsEditMode] = useState(false);

  const isType = (elType) => {
    return (
      selectedElements.length > 0 &&
      selectedElements.every(({ type }) => elType === type)
    );
  };

  const isText = isType('text');
  const isShape = isType('shape');

  const handleDeleteColor = useCallback(
    (toDelete) => {
      updateStory({
        properties: {
          stylePresets: {
            ...stylePresets,
            fillColors: isText
              ? fillColors
              : fillColors.filter((color) => color !== toDelete),
            textColors: !isText
              ? textColors
              : textColors.filter((color) => color !== toDelete),
          },
        },
      });
    },
    [fillColors, isText, stylePresets, textColors, updateStory]
  );

  const handleAddColorPreset = useCallback(
    (evt) => {
      evt.stopPropagation();
      let addedFillColors = [];
      let addedTextColors = [];
      if (isText) {
        addedTextColors = selectedElements
          .map(({ color }) => color)
          .filter((color) => !findMatchingColor(color, stylePresets, true));
      } else {
        addedFillColors = selectedElements
          .map(({ backgroundColor }) => {
            return backgroundColor ? backgroundColor : null;
          })
          .filter(
            (color) => color && !findMatchingColor(color, stylePresets, false)
          );
      }
      if (addedFillColors.length > 0 || addedTextColors.length > 0) {
        updateStory({
          properties: {
            stylePresets: {
              ...stylePresets,
              fillColors: [...fillColors, ...addedFillColors],
              textColors: [...textColors, ...addedTextColors],
            },
          },
        });
      }
    },
    [
      isText,
      selectedElements,
      updateStory,
      stylePresets,
      fillColors,
      textColors,
    ]
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

  const colorPresets = isText ? textColors : fillColors;
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

  // @todo This is temporary until the presets haven't been implemented fully with multi-selection.
  if (!isText && !isShape && selectedElements.length > 1) {
    return null;
  }

  const getSecondaryActions = () => {
    return !isEditMode ? (
      <>
        {hasColorPresets && (
          <EditModeButton
            onClick={(evt) => {
              evt.stopPropagation();
              setIsEditMode(true);
            }}
            aria-label={__('Edit presets', 'web-stories')}
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
        aria-label={__('Exit edit mode', 'web-stories')}
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
      <PanelContent isPrimary padding={hasColorPresets ? null : '0'}>
        {hasColorPresets && (
          <>
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
          </>
        )}
      </PanelContent>
    </Panel>
  );
}

export default StylePresetPanel;
