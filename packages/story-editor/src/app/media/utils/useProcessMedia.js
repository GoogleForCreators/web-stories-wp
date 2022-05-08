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
import {
  fetchRemoteBlob,
  fetchRemoteFile,
  isAnimatedGif,
} from '@googleforcreators/media';

/**
 * Internal dependencies
 */
import useAPI from '../../api/useAPI';
import useStory from '../../story/useStory';
import useMediaInfo from './useMediaInfo';

function useProcessMedia({
  uploadMedia,
  postProcessingResource,
  updateMedia,
  deleteMediaElement,
}) {
  const {
    actions: { getOptimizedMediaById, getMutedMediaById },
  } = useAPI();
  const { updateElementsByResourceId, updateElementById } = useStory(
    (state) => ({
      updateElementsByResourceId: state.actions.updateElementsByResourceId,
      updateElementById: state.actions.updateElementById,
    })
  );
  const { getFileInfo, isConsideredOptimized } = useMediaInfo();

  const copyResourceData = useCallback(
    ({ oldResource, resource }) => {
      const { id, alt } = oldResource;

      updateElementsByResourceId({
        id,
        properties: () => {
          return {
            type: resource.type,
            resource: {
              ...resource,
              alt,
            },
          };
        },
      });
    },
    [updateElementsByResourceId]
  );

  const copyResourceDataByElementId = useCallback(
    ({ elementId, oldResource, resource }) => {
      const { alt } = oldResource;

      updateElementById({
        elementId,
        properties: () => {
          return {
            type: resource.type,
            resource: {
              ...resource,
              alt,
            },
          };
        },
      });
    },
    [updateElementById]
  );

  const updateExistingElementById = useCallback(
    (elementId, resource) => {
      updateElementById({
        elementId,
        properties: (element) => {
          return {
            resource: {
              ...element.resource,
              ...resource,
            },
          };
        },
      });
    },
    [updateElementById]
  );

  const updateExistingElementsByResourceId = useCallback(
    (resourceId, resource) => {
      updateElementsByResourceId({
        id: resourceId,
        properties: (element) => {
          return {
            resource: {
              ...element.resource,
              ...resource,
            },
          };
        },
      });
    },
    [updateElementsByResourceId]
  );

  const updateOldTranscodedObject = useCallback(
    (oldId, newId, mediaSource) => {
      updateMedia(oldId, {
        mediaSource,
        optimizedId: newId,
      });
    },
    [updateMedia]
  );

  const updateOldMutedObject = useCallback(
    (oldId, newId) => {
      updateMedia(oldId, {
        mutedId: newId,
      });
    },
    [updateMedia]
  );

  /**
   * Optimize video existing video using FFmpeg.
   *
   * @param {import('@googleforcreators/media').Resource} resource Resource object.
   */
  const optimizeVideo = useCallback(
    ({ resource: oldResource }) => {
      const { id: resourceId, src: url, mimeType } = oldResource;

      const onUploadError = () =>
        updateExistingElementsByResourceId(resourceId, {
          isOptimized: false,
        });

      const onUploadSuccess = ({ resource }) => {
        copyResourceData({ oldResource, resource });
        updateOldTranscodedObject(resourceId, resource.id, 'source-video');
        deleteMediaElement({ id: resourceId });
        postProcessingResource(resource);
      };

      // TODO: Confirm which properties exactly need to be updated.
      const onUploadProgress = ({ resource }) => {
        const oldResourceWithId = { ...resource, id: oldResource.id };
        updateExistingElementsByResourceId(resourceId, {
          ...oldResourceWithId,
        });
      };

      (async () => {
        const optimizedResource = await getOptimizedMediaById(resourceId);

        // This video was optimized before, no need to optimize it again.
        if (optimizedResource) {
          updateExistingElementsByResourceId(resourceId, optimizedResource);
          return;
        }

        let file = false;
        try {
          file = await fetchRemoteFile(url, mimeType);
        } catch (e) {
          // Ignore for now.
          return;
        }

        const fileInfo = await getFileInfo(file);

        // Video meets criteria to be considered optimized,
        // just mark it as such and call it a day.
        if (isConsideredOptimized(fileInfo)) {
          updateExistingElementsByResourceId(resourceId, { isOptimized: true });
          updateMedia(resourceId, {
            mediaSource: 'video-optimization',
          });
          return;
        }

        await uploadMedia([file], {
          onUploadSuccess,
          onUploadError,
          onUploadProgress,
          additionalData: {
            originalId: oldResource.id,
            isMuted: oldResource.isMuted,
          },
          originalResourceId: oldResource.id,
        });
      })();
    },
    [
      updateExistingElementsByResourceId,
      copyResourceData,
      updateOldTranscodedObject,
      deleteMediaElement,
      postProcessingResource,
      getOptimizedMediaById,
      uploadMedia,
      getFileInfo,
      isConsideredOptimized,
      updateMedia,
    ]
  );

  /**
   * Trim existing video using FFmpeg.
   *
   * @param {import('@googleforcreators/media').Resource} resource Resource object.
   * @param {string} start Time stamp of start time of new video. Example '00:01:02.345'.
   * @param {string} end Time stamp of end time of new video. Example '00:02:00'.
   */
  const trimExistingVideo = useCallback(
    ({ resource: oldResource, canvasResourceId, elementId, start, end }) => {
      const { id: resourceId, ...oldResourceWithoutId } = oldResource;
      const { src: url, mimeType, poster, isMuted, isOptimized } = oldResource;

      const trimData = {
        original: resourceId,
        start,
        end,
      };

      const onUploadStart = () =>
        updateExistingElementById(elementId, {
          trimData,
        });

      const onUploadError = () =>
        updateExistingElementById(elementId, {
          trimData: oldResource.trimData || {},
        });

      const onUploadSuccess = ({ resource }) => {
        const oldCanvasResource = {
          alt: oldResource.alt,
          id: canvasResourceId,
        };
        copyResourceDataByElementId({
          elementId,
          oldResource: oldCanvasResource,
          resource,
        });
        postProcessingResource(resource);
      };

      const onUploadProgress = ({ resource }) => {
        const newResourceWithCanvasId = { ...resource, id: canvasResourceId };
        updateExistingElementById(elementId, {
          ...newResourceWithCanvasId,
        });
      };

      const process = async () => {
        let file = false;
        let posterFile = false;
        try {
          file = await fetchRemoteFile(url, mimeType);
        } catch (e) {
          // Ignore for now.
          return;
        }
        if (poster) {
          try {
            posterFile = await fetchRemoteBlob(poster);
          } catch (e) {
            // Ignore for now.
          }
        }

        await uploadMedia([file], {
          onUploadSuccess,
          onUploadStart,
          onUploadError,
          onUploadProgress,
          additionalData: {
            originalId: resourceId,
            isMuted,
            mediaSource: isOptimized ? 'video-optimization' : 'editor',
          },
          elementId,
          trimData,
          resource: {
            ...oldResourceWithoutId,
            trimData,
          },
          originalResourceId: canvasResourceId,
          posterFile,
        });
      };
      return process();
    },
    [
      updateExistingElementById,
      copyResourceDataByElementId,
      postProcessingResource,
      uploadMedia,
    ]
  );

  /**
   * Mute existing video using FFmpeg.
   *
   * @param {import('@googleforcreators/media').Resource} resource Resource object.
   */
  const muteExistingVideo = useCallback(
    ({ resource: oldResource }) => {
      const { id: resourceId, ...oldResourceWithoutId } = oldResource;
      const { src: url, mimeType, poster, isOptimized } = oldResource;

      const onUploadError = () => {
        updateExistingElementsByResourceId(resourceId, {
          isMuted: false,
        });
      };

      const onUploadSuccess = ({ resource }) => {
        copyResourceData({ oldResource, resource });
        updateOldMutedObject(oldResource.id, resource.id);
        postProcessingResource(resource);
      };

      // TODO: Confirm which properties exactly need to be updated.
      const onUploadProgress = ({ resource }) => {
        const oldResourceWithId = { ...resource, id: oldResource.id };
        updateExistingElementsByResourceId(resourceId, {
          ...oldResourceWithId,
        });
      };

      (async () => {
        const mutedResource = await getMutedMediaById(resourceId);

        // This video was muted before, no need to mute it again.
        if (mutedResource) {
          updateExistingElementsByResourceId(resourceId, mutedResource);
          return;
        }

        let file = false;
        let posterFile = false;
        try {
          file = await fetchRemoteFile(url, mimeType);
        } catch (e) {
          // Ignore for now.
          return;
        }
        if (poster) {
          try {
            posterFile = await fetchRemoteBlob(poster);
          } catch (e) {
            // Ignore for now.
          }
        }

        await uploadMedia([file], {
          onUploadSuccess,
          onUploadError,
          onUploadProgress,
          additionalData: {
            originalId: resourceId,
            mediaSource: isOptimized ? 'video-optimization' : 'editor',
          },
          muteVideo: true,
          resource: {
            ...oldResourceWithoutId,
            isMuted: true,
          },
          originalResourceId: resourceId,
          posterFile,
        });
      })();
    },
    [
      updateExistingElementsByResourceId,
      copyResourceData,
      updateOldMutedObject,
      postProcessingResource,
      getMutedMediaById,
      uploadMedia,
    ]
  );

  /**
   * Convert existing gif to a video using FFmpeg.
   *
   * @param {import('@googleforcreators/media').Resource} resource Resource object.
   */
  const optimizeGif = useCallback(
    ({ resource: oldResource }) => {
      const { id: resourceId, src: url, mimeType } = oldResource;

      const onUploadSuccess = ({ resource }) => {
        copyResourceData({ oldResource, resource });
        updateOldTranscodedObject(oldResource.id, resource.id, 'source-image');
        deleteMediaElement({ id: oldResource.id });
        postProcessingResource(resource);
      };

      // TODO: Confirm which properties exactly need to be updated.
      const onUploadProgress = ({ resource }) => {
        const oldResourceWithId = { ...resource, id: oldResource.id };
        updateExistingElementsByResourceId(resourceId, {
          ...oldResourceWithId,
        });
      };

      const process = async () => {
        let file = false;
        try {
          file = await fetchRemoteFile(url, mimeType);
        } catch (e) {
          // Ignore for now.
          return;
        }

        const buffer = await file.arrayBuffer();
        if (!isAnimatedGif(buffer)) {
          return;
        }

        await uploadMedia([file], {
          onUploadSuccess,
          onUploadProgress,
          additionalData: {
            original_id: resourceId,
          },
          originalResourceId: resourceId,
        });
      };
      return process();
    },
    [
      copyResourceData,
      updateOldTranscodedObject,
      deleteMediaElement,
      postProcessingResource,
      updateExistingElementsByResourceId,
      uploadMedia,
    ]
  );

  return {
    optimizeVideo,
    optimizeGif,
    muteExistingVideo,
    trimExistingVideo,
  };
}

export default useProcessMedia;
