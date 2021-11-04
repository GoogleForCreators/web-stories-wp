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
import {
  fetchRemoteBlob,
  fetchRemoteFile,
  isAnimatedGif,
} from '@web-stories-wp/media';

/**
 * Internal dependencies
 */
import useAPI from '../../api/useAPI';
import useStory from '../../story/useStory';

function useProcessMedia({
  uploadMedia,
  uploadVideoPoster,
  updateVideoIsMuted,
  updateBaseColor,
  updateMedia,
  deleteMediaElement,
}) {
  const {
    actions: { getOptimizedMediaById, getMutedMediaById },
  } = useAPI();
  const { updateElementsByResourceId } = useStory((state) => ({
    updateElementsByResourceId: state.actions.updateElementsByResourceId,
  }));

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

  const updateExistingElements = useCallback(
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
        web_stories_media_source: mediaSource,
        meta: {
          web_stories_optimized_id: newId,
        },
      });
    },
    [updateMedia]
  );

  const updateOldMutedObject = useCallback(
    (oldId, newId) => {
      updateMedia(oldId, {
        meta: {
          web_stories_muted_id: newId,
        },
      });
    },
    [updateMedia]
  );

  /**
   * Optimize video existing video using FFmpeg.
   *
   * @param {import('@web-stories-wp/media').Resource} resource Resource object.
   */
  const optimizeVideo = useCallback(
    ({ resource: oldResource }) => {
      const { id: resourceId, src: url, mimeType } = oldResource;

      // TODO: Already covered by onUploadProgress?
      const onUploadStart = () =>
        updateExistingElements(resourceId, { isTranscoding: true });

      const onUploadError = () =>
        updateExistingElements(resourceId, {
          isTranscoding: false,
          isOptimized: false,
        });

      const onUploadSuccess = ({ resource }) => {
        copyResourceData({ oldResource, resource });
        updateOldTranscodedObject(resourceId, resource.id, 'source-video');
        deleteMediaElement({ id: resourceId });
        if (resource.local) {
          return;
        }
        if (['video', 'gif'].includes(resource.type) && !resource.posterId) {
          uploadVideoPoster(resource.id, resource.src);
        }
        if ('video' === resource.type && resource.isMuted === null) {
          updateVideoIsMuted(resource.id, resource.src);
        }

        if (
          !Array.isArray(resource?.baseColor) ||
          !resource?.baseColor.length
        ) {
          updateBaseColor({ resource });
        }
      };

      // TODO: Confirm which properties exactly need to be updated.
      const onUploadProgress = ({ resource }) => {
        const oldResourceWithId = { ...resource, id: oldResource.id };
        updateExistingElements(resourceId, {
          ...oldResourceWithId,
        });
      };

      (async () => {
        const optimizedResource = await getOptimizedMediaById(resourceId);

        // This video was optimized before, no need to optimize it again.
        if (optimizedResource) {
          updateExistingElements(resourceId, optimizedResource);
          return;
        }

        let file = false;
        try {
          file = await fetchRemoteFile(url, mimeType);
        } catch (e) {
          // Ignore for now.
          return;
        }
        await uploadMedia([file], {
          onUploadSuccess,
          onUploadStart,
          onUploadError,
          onUploadProgress,
          additionalData: {
            original_id: oldResource.id,
            web_stories_is_muted: oldResource.isMuted,
            meta: { web_stories_base_color: oldResource.baseColor },
          },
        });
      })();
    },
    [
      copyResourceData,
      getOptimizedMediaById,
      uploadMedia,
      uploadVideoPoster,
      updateVideoIsMuted,
      updateOldTranscodedObject,
      deleteMediaElement,
      updateExistingElements,
      updateBaseColor,
    ]
  );

  /**
   * Trim existing video using FFmpeg.
   *
   * @param {import('@web-stories-wp/media').Resource} resource Resource object.
   * @param {string} start Time stamp of start time of new video. Example '00:01:02.345'.
   * @param {string} end Time stamp of end time of new video. Example '00:02:00'.
   */
  const trimExistingVideo = useCallback(
    ({ resource: oldResource, canvasResourceId, start, end }) => {
      const { id: resourceId, src: url, mimeType, poster } = oldResource;

      const trimData = {
        original: resourceId,
        start,
        end,
      };

      const onUploadStart = () =>
        updateExistingElements(resourceId, {
          trimData,
          isTrimming: true,
        });

      const onUploadError = () =>
        updateExistingElements(resourceId, { isTrimming: false });

      const onUploadSuccess = ({ resource }) => {
        copyResourceData({ oldResource, resource });
        if (resource.local || 'video' !== resource.type) {
          return;
        }

        if (!resource.posterId) {
          uploadVideoPoster(resource.id, resource.src);
        }
        if (resource.isMuted === null) {
          updateVideoIsMuted(resource.id, resource.src);
        }
        if (
          !Array.isArray(resource?.baseColor) ||
          !resource?.baseColor.length
        ) {
          updateBaseColor({ resource });
        }
      };

      const onUploadProgress = ({ resource }) => {
        const newResourceWithCanvasId = { ...resource, id: canvasResourceId };
        updateExistingElements(resourceId, {
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
            web_stories_is_muted: oldResource.isMuted,
            original_id: oldResource.id,
            web_stories_media_source: oldResource?.isOptimized
              ? 'video-optimization'
              : 'editor',
          },
          trimData,
          resource: {
            ...oldResource,
            trimData,
          },
          posterFile,
        });
      };
      return process();
    },
    [
      copyResourceData,
      uploadMedia,
      uploadVideoPoster,
      updateExistingElements,
      updateVideoIsMuted,
      updateBaseColor,
    ]
  );

  /**
   * Mute existing video using FFmpeg.
   *
   * @param {import('@web-stories-wp/media').Resource} resource Resource object.
   */
  const muteExistingVideo = useCallback(
    ({ resource: oldResource }) => {
      const { id: resourceId, src: url, mimeType, poster } = oldResource;

      // TODO: Already covered by onUploadProgress?
      const onUploadStart = () => {
        updateExistingElements(resourceId, {
          isMuting: true,
        });
      };

      const onUploadError = () => {
        updateExistingElements(resourceId, {
          isMuting: false,
          isMuted: false,
        });
      };

      const onUploadSuccess = ({ resource }) => {
        copyResourceData({ oldResource, resource });
        updateOldMutedObject(oldResource.id, resource.id);
        if (resource.local) {
          return;
        }
        if (['video', 'gif'].includes(resource.type) && !resource.posterId) {
          uploadVideoPoster(resource.id, resource.src);
        }
        if (
          !Array.isArray(resource?.baseColor) ||
          !resource?.baseColor.length
        ) {
          updateBaseColor({ resource });
        }
      };

      // TODO: Confirm which properties exactly need to be updated.
      const onUploadProgress = ({ resource }) => {
        const oldResourceWithId = { ...resource, id: oldResource.id };
        updateExistingElements(resourceId, {
          ...oldResourceWithId,
        });
      };

      (async () => {
        const mutedResource = await getMutedMediaById(resourceId);

        // This video was muted before, no need to mute it again.
        if (mutedResource) {
          updateExistingElements(resourceId, mutedResource);
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
          onUploadStart,
          onUploadError,
          onUploadProgress,
          additionalData: {
            meta: { web_stories_base_color: oldResource.baseColor },
            original_id: oldResource.id,
            web_stories_media_source: oldResource?.isOptimized
              ? 'video-optimization'
              : 'editor',
          },
          muteVideo: true,
          resource: {
            ...oldResource,
            isMuted: true,
          },
          posterFile,
        });
      })();
    },
    [
      copyResourceData,
      getMutedMediaById,
      updateExistingElements,
      updateOldMutedObject,
      uploadMedia,
      uploadVideoPoster,
      updateBaseColor,
    ]
  );

  /**
   * Convert existing gif to a video using FFmpeg.
   *
   * @param {import('@web-stories-wp/media').Resource} resource Resource object.
   */
  const optimizeGif = useCallback(
    ({ resource: oldResource }) => {
      const { id: resourceId, src: url, mimeType } = oldResource;

      const onUploadSuccess = ({ resource }) => {
        copyResourceData({ oldResource, resource });
        updateOldTranscodedObject(oldResource.id, resource.id, 'source-image');
        deleteMediaElement({ id: oldResource.id });
        if (resource.local) {
          return;
        }
        if (['video', 'gif'].includes(resource.type) && !resource.posterId) {
          uploadVideoPoster(resource.id, resource.src);
        }
        if (
          !Array.isArray(resource?.baseColor) ||
          !resource?.baseColor.length
        ) {
          updateBaseColor({ resource });
        }
      };

      // TODO: Confirm which properties exactly need to be updated.
      const onUploadProgress = ({ resource }) => {
        const oldResourceWithId = { ...resource, id: oldResource.id };
        updateExistingElements(resourceId, {
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
            original_id: oldResource.id,
            meta: { web_stories_base_color: oldResource.baseColor },
          },
        });
      };
      return process();
    },
    [
      copyResourceData,
      updateOldTranscodedObject,
      deleteMediaElement,
      uploadVideoPoster,
      updateBaseColor,
      updateExistingElements,
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
