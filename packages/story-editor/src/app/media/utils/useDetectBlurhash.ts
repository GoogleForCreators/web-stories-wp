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
import { useCallback, useReduction } from '@googleforcreators/react';
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

const reducer = {
  addProcessing: (state, { payload }) => {
    if (!payload || state.processing.includes(payload)) {
      return state;
    }
    return {
      ...state,
      processing: [...state.processing, payload],
    };
  },
  removeProcessing: (state, { payload }) => {
    if (!payload || !state.processing.includes(payload)) {
      return state;
    }
    const currentProcessing = [...state.processing];
    const processing = currentProcessing.filter((e) => e !== payload);

    return {
      ...state,
      processing,
      processed: [...state.processed, payload],
    };
  },
};

const INITIAL_STATE = {
  processed: [],
  processing: [],
};

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

  const [state, actions] = useReduction(INITIAL_STATE, reducer);
  const { processed, processing } = state;
  const { addProcessing, removeProcessing } = actions;

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
        // This might happen as an author when trying to updateMedia() that
        // was uploaded by someone else.
        // Do nothing with the error for now.
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
    async (resource) => {
      const { type, poster, id, isExternal } = resource;
      let imageSrc = poster;

      if (type === 'image') {
        imageSrc = getSmallestUrlForWidth(300, resource);
      } else if (!isExternal) {
        try {
          const posterResource = getPosterMediaById
            ? await getPosterMediaById(id)
            : null;
          if (posterResource) {
            imageSrc = getSmallestUrlForWidth(300, posterResource);
          }
        } catch (error) {
          // The user might not have the permission to access the video with context=edit.
          // This might happen as an author when the video
          // was uploaded by someone else.
          // Do nothing with the error for now.
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

  const maybeUpdateBlurHash = useCallback(
    async (resource) => {
      const { id } = resource;

      // Simple way to prevent double-uploading.
      if (processed.includes(id) || processing.includes(id)) {
        return;
      }

      addProcessing(id);
      await updateBlurHash(resource);
      removeProcessing(id);
    },
    [addProcessing, processed, processing, removeProcessing, updateBlurHash]
  );

  return {
    updateBlurHash: maybeUpdateBlurHash,
  };
}

export default useDetectBlurHash;
