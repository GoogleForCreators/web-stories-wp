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
import { trackError } from '@googleforcreators/tracking';
/**
 * Internal dependencies
 */
import { useAPI } from '../../api';
import { useStory } from '../../story';
import { useConfig } from '../../config';
import useCORSProxy from '../../../utils/useCORSProxy';
import getBlurHashFromImage from '../../../utils/getBlurHashFromImage';

function useDetectBlurHash({ updateMediaElement }) {
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

  const saveBlurHash = useCallback(
    /**
     *
     * @param {number} id Video ID.
     * @param {string} blurHash Base Color.
     * @return {Promise<void>}
     */
    async (id, blurHash) => {
      try {
        const properties = ({ resource }) => ({
          resource: {
            ...resource,
            blurHash,
          },
        });
        updateElementsByResourceId({ id, properties });
        updateMediaElement({
          id,
          data: { blurHash },
        });
        if (hasUploadMediaAction) {
          await updateMedia(id, {
            blurHash,
          });
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

  const updateBlurHash = useCallback(
    async ({ resource }) => {
      const { type, poster, id, isExternal } = resource;
      let imageSrc = poster;

      if (type === 'image') {
        imageSrc = getSmallestUrlForWidth(300, resource);
      } else if (!isExternal) {
        const posterResource = getPosterMediaById
          ? await getPosterMediaById(id)
          : null;
        if (posterResource) {
          imageSrc = getSmallestUrlForWidth(300, posterResource);
        }
      }

      if (!imageSrc) {
        return;
      }
      const imageSrcProxied = getProxiedUrl(resource, imageSrc);
      try {
        const blurHash = await getBlurHashFromImage(imageSrcProxied);
        await saveBlurHash(resource.id, blurHash);
      } catch (error) {
        trackError('blurhash_generation', error?.message);
      }
    },
    [getProxiedUrl, getPosterMediaById, saveBlurHash]
  );

  return {
    updateBlurHash,
  };
}

export default useDetectBlurHash;
