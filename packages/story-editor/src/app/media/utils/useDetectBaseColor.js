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
import { useCallback } from '@googleforcreators/react';
import { getSmallestUrlForWidth } from '@googleforcreators/media';
/**
 * Internal dependencies
 */
import { useAPI } from '../../api';
import { useStory } from '../../story';
import { useConfig } from '../../config';
import getMediaBaseColor from '../../../utils/getMediaBaseColor';
import useCORSProxy from '../../../utils/useCORSProxy';

function useDetectBaseColor({ updateMediaElement }) {
  const {
    actions: { updateMedia, getPosterMediaById },
  } = useAPI();
  const { updateElementsByResourceId } = useStory((state) => ({
    updateElementsByResourceId: state.actions.updateElementsByResourceId,
  }));
  const {
    capabilities: { hasUploadMediaAction },
  } = useConfig();
  const { getProxiedUrl } = useCORSProxy();

  const saveBaseColor = useCallback(
    /**
     *
     * @param {import('@googleforcreators/media').Resource} resource Resource object.
     * @param {string} baseColor Base Color.
     * @return {Promise<void>}
     */
    async ({ id, isExternal }, baseColor) => {
      try {
        const properties = ({ resource }) => ({
          resource: {
            ...resource,
            baseColor,
          },
        });
        updateElementsByResourceId({ id, properties });
        if (!isExternal) {
          updateMediaElement({
            id,
            data: { baseColor },
          });
          if (hasUploadMediaAction) {
            await updateMedia(id, {
              baseColor,
            });
          }
        }
      } catch (error) {
        // Do nothing for now.
      }
    },
    [
      updateElementsByResourceId,
      updateMediaElement,
      hasUploadMediaAction,
      updateMedia,
    ]
  );

  const updateBaseColor = useCallback(
    async (resource) => {
      const { type, poster, id, isExternal } = resource;
      let imageSrc = poster;

      if (type === 'image') {
        imageSrc = getSmallestUrlForWidth(0, resource);
      } else if (!isExternal) {
        const posterResource = getPosterMediaById
          ? await getPosterMediaById(id)
          : null;
        if (posterResource) {
          imageSrc = getSmallestUrlForWidth(0, posterResource);
        }
      }

      if (!imageSrc) {
        return;
      }
      const imageSrcProxied = getProxiedUrl(resource, imageSrc);
      try {
        const color = await getMediaBaseColor(imageSrcProxied);
        await saveBaseColor(resource, color);
      } catch (error) {
        // Do nothing for now.
      }
    },
    [getProxiedUrl, getPosterMediaById, saveBaseColor]
  );

  return {
    updateBaseColor,
  };
}

export default useDetectBaseColor;
