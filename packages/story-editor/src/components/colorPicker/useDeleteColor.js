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
import { useCallback } from '@web-stories-wp/react';
/**
 * Internal dependencies
 */
import { useStory } from '../../app';

function useDeleteColor({ onEmpty = () => {} }) {
  const { currentStoryStyles, globalStoryStyles, updateStory } = useStory(
    ({
      state: {
        story: { globalStoryStyles, currentStoryStyles },
      },
      actions: { updateStory },
    }) => {
      return {
        currentStoryStyles,
        globalStoryStyles,
        updateStory,
      };
    }
  );

  const { colors: globalColors } = globalStoryStyles || {};
  const { colors: localColors } = currentStoryStyles || {};
  const hasLocalPresets = localColors?.length > 0;

  const deleteGlobalColor = useCallback(
    (toDelete) => {
      const updatedColors = globalColors.filter((color) => color !== toDelete);
      updateStory({
        properties: {
          globalStoryStyles: {
            ...(globalStoryStyles || {}),
            colors: updatedColors,
          },
        },
      });
      // If no colors left, exit edit mode.
      if (updatedColors.length === 0 && !hasLocalPresets) {
        onEmpty();
      }
    },
    [globalColors, updateStory, hasLocalPresets, globalStoryStyles, onEmpty]
  );

  const deleteLocalColor = useCallback(
    (toDelete) => {
      const updatedColors = localColors.filter((color) => color !== toDelete);
      updateStory({
        properties: {
          currentStoryStyles: { colors: updatedColors },
        },
      });
      // If no colors are left, exit edit mode.
      if (updatedColors.length === 0 && globalColors.length === 0) {
        onEmpty();
      }
    },
    [globalColors, localColors, updateStory, onEmpty]
  );

  return {
    deleteLocalColor,
    deleteGlobalColor,
  };
}

export default useDeleteColor;
