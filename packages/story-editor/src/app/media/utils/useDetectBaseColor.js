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
import { getSmallestUrlForWidth } from '@web-stories-wp/media';
/**
 * Internal dependencies
 */
import { useAPI } from '../../api';
import { useStory } from '../../story';
import { useConfig } from '../../config';
import { getMediaBaseColor } from '../../../utils/getMediaBaseColor';
import useCORSProxy from '../../../utils/useCORSProxy';

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
  const { getProxiedUrl } = useCORSProxy();
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
        if (hasUploadMediaAction) {
          await updateMedia(id, {
            meta: { web_stories_base_color: baseColor },
          });
        }
      } catch (error) {
        // Do nothing for now.
      }
    },
    [setProperties, updateMedia, updateMediaElement, hasUploadMediaAction]
  );

  const updateBaseColor = useCallback(
    async ({ resource }) => {
      const { type, poster } = resource;
      const imageSrc =
        type === 'image' ? getSmallestUrlForWidth(0, resource) : poster;
      if (!imageSrc) {
        return;
      }
      const imageSrcProxied = getProxiedUrl(resource, imageSrc);
      try {
        const color = await getMediaBaseColor(imageSrcProxied);
        await saveBaseColor(resource.id, color);
      } catch (error) {
        // Do nothing for now.
      }
    },
    [getProxiedUrl, saveBaseColor]
  );

  return {
    updateBaseColor,
  };
}

export default useDetectBaseColor;
