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
import { useCallback } from 'react';
/**
 * Internal dependencies
 */
import { useStory } from '../../../../app/story';

function useDeletePreset({ presetType, setIsEditMode }) {
  const { storyPresets, stylePresets, updateStory } = useStory(
    ({
      state: {
        story: { stylePresets, storyPresets },
      },
      actions: { updateStory },
    }) => {
      return {
        storyPresets,
        stylePresets,
        updateStory,
      };
    }
  );

  const isColor = 'color' === presetType;
  const isStyle = 'style' === presetType;

  const { colors, textStyles } = stylePresets;
  const globalPresets = isColor ? colors : textStyles;
  const { colors: localColors } = storyPresets;
  const hasLocalPresets = localColors.length > 0;

  const deleteGlobalPreset = useCallback(
    (toDelete) => {
      const updatedStyles = isColor
        ? colors.filter((color) => color !== toDelete)
        : textStyles.filter((style) => style !== toDelete);
      updateStory({
        properties: {
          stylePresets: {
            textStyles: isColor ? textStyles : updatedStyles,
            colors: isColor ? updatedStyles : colors,
          },
        },
      });
      // If no styles left, exit edit mode.
      if (
        updatedStyles.length === 0 &&
        ((isColor && !hasLocalPresets) || isStyle)
      ) {
        setIsEditMode(false);
      }
    },
    [
      colors,
      isColor,
      textStyles,
      updateStory,
      hasLocalPresets,
      isStyle,
      setIsEditMode,
    ]
  );

  const deleteLocalPreset = useCallback(
    (toDelete) => {
      const updatedColors = localColors.filter((color) => color !== toDelete);
      updateStory({
        properties: {
          storyPresets: { colors: updatedColors },
        },
      });
      // If no colors are left, exit edit mode.
      if (updatedColors.length === 0 && globalPresets.length === 0) {
        setIsEditMode(false);
      }
    },
    [globalPresets.length, localColors, updateStory, setIsEditMode]
  );

  return {
    deleteLocalPreset,
    deleteGlobalPreset,
  };
}

export default useDeletePreset;
