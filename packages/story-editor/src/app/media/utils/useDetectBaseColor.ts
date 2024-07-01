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
import {
  getSmallestUrlForWidth,
  type Resource,
  type ResourceId,
  ResourceType,
  type VideoResource,
} from '@googleforcreators/media';

/**
 * Internal dependencies
 */
import { useAPI } from '../../api';
import { useStory } from '../../story';
import { useConfig } from '../../config';
import getMediaBaseColor from '../../../utils/getMediaBaseColor';
import useCORSProxy from '../../../utils/useCORSProxy';

interface BaseColorState {
  processed: ResourceId[];
  processing: ResourceId[];
}

const reducer = {
  addProcessing: (
    state: BaseColorState,
    { payload }: { payload: ResourceId }
  ) => {
    if (!payload || state.processing.includes(payload)) {
      return state;
    }
    return {
      ...state,
      processing: [...state.processing, payload],
    };
  },
  removeProcessing: (
    state: BaseColorState,
    { payload }: { payload: ResourceId }
  ) => {
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

const INITIAL_STATE: BaseColorState = {
  processed: [],
  processing: [],
};

function useDetectBaseColor({
  updateMediaElement,
}: {
  updateMediaElement: ({
    id,
    data,
  }: {
    id: string | number;
    data: Record<string, unknown>;
  }) => void;
}) {
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

  const saveBaseColor = useCallback(
    /**
     *
     * @param resource Resource object.
     * @param baseColor Base Color.
     */
    async ({ id, isExternal }: Resource, baseColor: string) => {
      try {
        updateElementsByResourceId({
          id,
          properties: ({ resource }) => ({
            resource: {
              ...resource,
              baseColor,
            },
          }),
        });
        if (!isExternal) {
          updateMediaElement({
            id,
            data: { baseColor },
          });
          if (hasUploadMediaAction && updateMedia) {
            await updateMedia(id, {
              baseColor,
            });
          }
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

  const updateBaseColor = useCallback(
    async (resource: Resource | VideoResource) => {
      const { type, id, isExternal } = resource;
      let imageSrc;

      if ('poster' in resource) {
        imageSrc = resource.poster;
      }

      if (type === ResourceType.Image) {
        imageSrc = getSmallestUrlForWidth(0, resource);
      } else if (!isExternal) {
        try {
          const posterResource = getPosterMediaById
            ? await getPosterMediaById(id)
            : null;
          if (posterResource) {
            imageSrc = getSmallestUrlForWidth(0, posterResource);
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
      if (!imageSrcProxied) {
        return;
      }
      try {
        const color = await getMediaBaseColor(imageSrcProxied);
        await saveBaseColor(resource, color);
      } catch (error) {
        // Do nothing for now.
      }
    },
    [getProxiedUrl, getPosterMediaById, saveBaseColor]
  );

  const maybeUpdateBaseColor = useCallback(
    async (resource: Resource) => {
      const { id } = resource;

      // Simple way to prevent double-uploading.
      if (processed.includes(id) || processing.includes(id)) {
        return;
      }

      addProcessing(id);
      await updateBaseColor(resource);
      removeProcessing(id);
    },
    [addProcessing, processed, processing, removeProcessing, updateBaseColor]
  );

  return {
    updateBaseColor: maybeUpdateBaseColor,
  };
}

export default useDetectBaseColor;
