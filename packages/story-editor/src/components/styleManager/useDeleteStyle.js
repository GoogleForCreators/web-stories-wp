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
import { useCallback } from '@googleforcreators/react';
/**
 * Internal dependencies
 */
import { useStory } from '../../app';

function useDeletePreset({ onEmpty }) {
  const { globalStoryStyles, updateStory } = useStory(
    ({
      state: {
        story: { globalStoryStyles },
      },
      actions: { updateStory },
    }) => {
      return {
        globalStoryStyles,
        updateStory,
      };
    }
  );

  const { textStyles } = globalStoryStyles || {};

  const deleteGlobalPreset = useCallback(
    (toDelete) => {
      const updatedStyles = textStyles.filter((style) => style !== toDelete);
      updateStory({
        properties: {
          globalStoryStyles: {
            ...globalStoryStyles,
            textStyles: updatedStyles,
          },
        },
      });
      // If no styles left, exit edit mode.
      if (updatedStyles.length === 0) {
        onEmpty();
      }
    },
    [textStyles, updateStory, globalStoryStyles, onEmpty]
  );

  return deleteGlobalPreset;
}

export default useDeletePreset;
