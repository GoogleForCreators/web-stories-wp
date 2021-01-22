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
import { useCallback } from 'react';
/**
 * Internal dependencies
 */
import { useStory } from '../../../../app/story';
import {
  areAllType,
  getPagePreset,
  getShapePresets,
  getTextPresets,
} from './utils';

function useAddPreset(presetType, isLocal = false) {
  const {
    currentPage,
    localColorPresets,
    selectedElements,
    stylePresets,
    updateStory,
  } = useStory(
    ({
      state: {
        currentPage,
        selectedElements,
        story: { stylePresets, localColorPresets },
      },
      actions: { updateStory },
    }) => {
      return {
        currentPage,
        localColorPresets,
        selectedElements,
        stylePresets,
        updateStory,
      };
    }
  );
  const { colors, textStyles } = stylePresets;
  const { colors: localColors } = localColorPresets;

  const isText = areAllType('text', selectedElements);
  const isBackground = selectedElements[0].id === currentPage.elements[0].id;
  const handleAddPreset = useCallback(
    (evt) => {
      evt.stopPropagation();
      let addedPresets = isLocal
        ? {
            colors: [],
          }
        : {
            textStyles: [],
            colors: [],
          };
      const currentPresets = isLocal ? localColorPresets : stylePresets;
      if (isText) {
        addedPresets = {
          ...addedPresets,
          ...getTextPresets(selectedElements, currentPresets, presetType),
        };
      } else if (isBackground) {
        addedPresets = {
          ...addedPresets,
          ...getPagePreset(currentPage, currentPresets),
        };
      } else {
        addedPresets = {
          ...addedPresets,
          ...getShapePresets(selectedElements, currentPresets),
        };
      }
      if (
        addedPresets.colors?.length > 0 ||
        addedPresets.textStyles?.length > 0
      ) {
        if (isLocal) {
          updateStory({
            properties: {
              localColorPresets: {
                colors: [...localColors, ...addedPresets.colors],
              },
            },
          });
        } else {
          updateStory({
            properties: {
              stylePresets: {
                textStyles: [...textStyles, ...addedPresets.textStyles],
                colors: [...colors, ...addedPresets.colors],
              },
            },
          });
        }
      }
    },
    [
      colors,
      currentPage,
      isBackground,
      isLocal,
      isText,
      localColors,
      localColorPresets,
      presetType,
      selectedElements,
      stylePresets,
      textStyles,
      updateStory,
    ]
  );
  return handleAddPreset;
}

export default useAddPreset;
