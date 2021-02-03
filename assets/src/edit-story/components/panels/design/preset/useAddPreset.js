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

function useAddPreset({ presetType }) {
  const {
    currentPage,
    currentStoryStyles,
    selectedElements,
    globalStoryStyles,
    updateStory,
  } = useStory(
    ({
      state: {
        currentPage,
        selectedElements,
        story: { globalStoryStyles, currentStoryStyles },
      },
      actions: { updateStory },
    }) => {
      return {
        currentPage,
        currentStoryStyles,
        selectedElements,
        globalStoryStyles,
        updateStory,
      };
    }
  );
  const { colors, textStyles } = globalStoryStyles;
  const { colors: localColors } = currentStoryStyles;

  const isText = areAllType('text', selectedElements);
  const isBackground = selectedElements[0].id === currentPage.elements[0].id;

  const getPresets = useCallback(
    (addedPresets, currentPresets) => {
      if (isText) {
        return {
          ...addedPresets,
          ...getTextPresets(selectedElements, currentPresets, presetType),
        };
      } else if (isBackground) {
        return {
          ...addedPresets,
          ...getPagePreset(currentPage, currentPresets),
        };
      } else {
        return {
          ...addedPresets,
          ...getShapePresets(selectedElements, currentPresets),
        };
      }
    },
    [currentPage, isBackground, isText, presetType, selectedElements]
  );

  const updateLocalPresets = useCallback(
    (addedPresets) => {
      updateStory({
        properties: {
          currentStoryStyles: {
            colors: [...localColors, ...addedPresets.colors],
          },
        },
      });
    },
    [localColors, updateStory]
  );

  const updateGlobalPresets = useCallback(
    (addedPresets) => {
      updateStory({
        properties: {
          globalStoryStyles: {
            textStyles: [...textStyles, ...addedPresets.textStyles],
            colors: [...colors, ...addedPresets.colors],
          },
        },
      });
    },
    [colors, textStyles, updateStory]
  );

  const handleAddPreset = useCallback(
    (addedPresets, isLocal = false) => {
      const currentPresets = isLocal ? currentStoryStyles : globalStoryStyles;
      addedPresets = getPresets(addedPresets, currentPresets);
      if (
        addedPresets.colors?.length > 0 ||
        addedPresets.textStyles?.length > 0
      ) {
        if (isLocal) {
          updateLocalPresets(addedPresets, currentPresets);
        } else {
          updateGlobalPresets(addedPresets, currentPresets);
        }
      }
    },
    [
      getPresets,
      currentStoryStyles,
      globalStoryStyles,
      updateGlobalPresets,
      updateLocalPresets,
    ]
  );
  const addGlobalPreset = (evt) => {
    evt.stopPropagation();
    handleAddPreset({
      textStyles: [],
      colors: [],
    });
  };

  const addLocalPreset = (evt) => {
    evt.stopPropagation();
    handleAddPreset(
      {
        colors: [],
      },
      true /* isLocal */
    );
  };

  return {
    addGlobalPreset,
    addLocalPreset,
  };
}

export default useAddPreset;
