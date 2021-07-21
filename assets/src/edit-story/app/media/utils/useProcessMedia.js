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
import { useCallback } from 'react';
import {
  fetchRemoteBlob,
  fetchRemoteFile,
  isAnimatedGif,
} from '@web-stories-wp/media';

/**
 * Internal dependencies
 */
import useStory from '../../story/useStory';

function useProcessMedia({
  uploadMedia,
  uploadVideoPoster,
  updateVideoIsMuted,
  updateMedia,
  deleteMediaElement,
}) {
  const { updateElementsByResourceId } = useStory((state) => ({
    updateElementsByResourceId: state.actions.updateElementsByResourceId,
  }));

  const copyResourceData = useCallback(
    ({ oldResource, resource }) => {
      const { id, alt, title } = oldResource;
      updateElementsByResourceId({
        id,
        properties: () => {
          return {
            type: resource.type,
            resource: {
              ...resource,
              alt,
              title,
            },
          };
        },
      });
    },
    [updateElementsByResourceId]
  );

  const updateExistingElements = useCallback(
    ({ oldResource }) => {
      const { id } = oldResource;
      updateElementsByResourceId({
        id,
        properties: () => {
          return {
            resource: {
              ...oldResource,
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
        media_source: mediaSource,
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

  const optimizeVideo = useCallback(
    ({ resource: oldResource }) => {
      const { src: url, mimeType } = oldResource;

      const onUploadStart = () => {
        updateExistingElements({
          oldResource: { ...oldResource, isOptimized: true },
        });
      };

      const onUploadError = () => {
        updateExistingElements({
          oldResource: { ...oldResource, isOptimized: false },
        });
      };

      const onUploadSuccess = ({ resource }) => {
        copyResourceData({ oldResource, resource });
        updateOldTranscodedObject(oldResource.id, resource.id, 'source-video');
        deleteMediaElement({ id: oldResource.id });
        if (
          ['video', 'gif'].includes(resource.type) &&
          !resource.local &&
          !resource.posterId
        ) {
          uploadVideoPoster(resource.id, resource.src);
        }
        if ('video' === resource.type && !resource.local && !resource.isMuted) {
          updateVideoIsMuted(resource.id, resource.src);
        }
      };

      const onUploadProgress = ({ resource }) => {
        const oldResourceWithId = { ...resource, id: oldResource.id };
        updateExistingElements({
          oldResource: oldResourceWithId,
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
        await uploadMedia([file], {
          onUploadSuccess,
          onUploadStart,
          onUploadError,
          onUploadProgress,
          additionalData: {
            alt: oldResource.alt,
            title: oldResource.title,
          },
        });
      };
      return process();
    },
    [
      copyResourceData,
      uploadMedia,
      uploadVideoPoster,
      updateVideoIsMuted,
      updateOldTranscodedObject,
      deleteMediaElement,
      updateExistingElements,
    ]
  );

  const muteExistingVideo = useCallback(
    ({ resource: oldResource }) => {
      const { src: url, mimeType, poster } = oldResource;

      const onUploadStart = () => {
        updateExistingElements({
          oldResource: {
            ...oldResource,
            isMuted: true,
            isMuting: true,
          },
        });
      };

      const onUploadError = () => {
        updateExistingElements({
          oldResource: { ...oldResource, isMuting: false },
        });
      };

      const onUploadSuccess = ({ resource }) => {
        copyResourceData({ oldResource, resource });
        updateOldMutedObject(oldResource.id, resource.id);
        if (
          ['video', 'gif'].includes(resource.type) &&
          !resource.local &&
          !resource.posterId
        ) {
          uploadVideoPoster(resource.id, resource.src);
        }
      };

      const onUploadProgress = ({ resource }) => {
        const oldResourceWithId = { ...resource, id: oldResource.id };
        updateExistingElements({
          oldResource: oldResourceWithId,
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
            alt: oldResource.alt,
            title: oldResource.title,
            media_source: oldResource?.isOptimized
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
      };
      return process();
    },
    [
      copyResourceData,
      uploadMedia,
      uploadVideoPoster,
      updateExistingElements,
      updateOldMutedObject,
    ]
  );

  const optimizeGif = useCallback(
    ({ resource: oldResource }) => {
      const { src: url, mimeType } = oldResource;

      const onUploadSuccess = ({ resource }) => {
        copyResourceData({ oldResource, resource });
        updateOldTranscodedObject(oldResource.id, resource.id, 'source-image');
        deleteMediaElement({ id: oldResource.id });

        if (
          ['video', 'gif'].includes(resource.type) &&
          !resource.local &&
          !resource.posterId
        ) {
          uploadVideoPoster(resource.id, resource.src);
        }
      };

      const onUploadProgress = ({ resource }) => {
        const oldResourceWithId = { ...resource, id: oldResource.id };
        updateExistingElements({
          oldResource: oldResourceWithId,
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
          additionalData: { alt: oldResource.alt, title: oldResource.title },
        });
      };
      return process();
    },
    [
      copyResourceData,
      uploadMedia,
      uploadVideoPoster,
      updateOldTranscodedObject,
      deleteMediaElement,
      updateExistingElements,
    ]
  );

  return {
    optimizeVideo,
    optimizeGif,
    muteExistingVideo,
  };
}

export default useProcessMedia;
