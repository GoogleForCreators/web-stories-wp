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
import { useCallback } from '@web-stories-wp/react';
/**
 * Internal dependencies
 */
import { useAPI } from '../../api';
import { useStory } from '../../story';
import { useConfig } from '../../config';
import { getResourceBaseColor } from '../../../utils/getMediaBaseColor';

function useDetectBaseColor({ updateMediaElement }) {
  const {
    actions: { updateMedia },
  } = useAPI();
  const { updateElementsByResourceId } = useStory((state) => ({
    updateElementsByResourceId: state.actions.updateElementsByResourceId,
  }));
  const {
    capabilities: { hasUploadMediaAction },
  } = useConfig();
  const setProperties = useCallback(
    (id, properties) => {
      updateElementsByResourceId({ id, properties });
    },
    [updateElementsByResourceId]
  );

  const saveBaseColor = useCallback(
    /**
     *
     * @param {number} id Video ID.
     * @param {string} baseColor Base Color.
     * @return {Promise<void>}
     */
    async (id, baseColor) => {
      if (!hasUploadMediaAction) {
        return;
      }
      try {
        const newState = ({ resource }) => ({
          resource: {
            ...resource,
            baseColor,
          },
        });
        setProperties(id, newState);
        updateMediaElement({
          id,
          data: { baseColor },
        });

        await updateMedia(id, {
          meta: { web_stories_base_color: baseColor },
        });
      } catch (error) {
        // Do nothing for now.
      }
    },
    [setProperties, updateMedia, updateMediaElement, hasUploadMediaAction]
  );

  const updateBaseColor = useCallback(
    async ({ resource }) => {
      const color = await getResourceBaseColor(resource);
      await saveBaseColor(resource.id, color);
    },
    [saveBaseColor]
  );

  return {
    updateBaseColor,
  };
}

export default useDetectBaseColor;
