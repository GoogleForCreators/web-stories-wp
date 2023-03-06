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
  type Resource,
  type ResourceId,
  type VideoResource,
} from '@googleforcreators/media';
import { DANGER_ZONE_HEIGHT } from '@googleforcreators/units';
import { trackError } from '@googleforcreators/tracking';

/**
 * Internal dependencies
 */
import type {
  ElementId,
  ElementType,
  MediaElement,
} from '@googleforcreators/elements';
import useAPI from '../../api/useAPI';
import useStory from '../../story/useStory';
import type { CropParams, UpdateMediaProps, UploadMediaArgs } from '../types';
import useFFmpeg from './useFFmpeg';
import useMediaInfo from './useMediaInfo';

interface UseProcessMediaProps {
  uploadMedia: (files: File[], args: UploadMediaArgs) => Promise<string | null>;
  postProcessingResource: (resource: Resource) => void;
  updateMedia: (id: ResourceId, data: UpdateMediaProps) => void;
  deleteMediaElement: (args: { id: ResourceId }) => void;
}

function useProcessMedia({
  uploadMedia,
  postProcessingResource,
  updateMedia,
  deleteMediaElement,
}: UseProcessMediaProps) {
  const {
    actions: { getOptimizedMediaById, getMutedMediaById },
  } = useAPI();

  const { segmentVideo: ffSegmentVideo } = useFFmpeg();

  const { updateElementsByResourceId, updateElementById } = useStory(
    (state) => ({
      updateElementsByResourceId: state.actions.updateElementsByResourceId,
      updateElementById: state.actions.updateElementById,
    })
  );
  const { isConsideredOptimized } = useMediaInfo();

  const copyResourceData = useCallback(
    ({
      oldResource,
      resource,
    }: {
      oldResource: Resource;
      resource: Resource;
    }) => {
      const { id, alt } = oldResource;

      updateElementsByResourceId({
        id,
        properties: () => {
          return {
            type: resource.type as unknown as ElementType,
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
    ({
      elementId,
      oldResource,
      resource,
    }: {
      elementId: ElementId;
      oldResource: Pick<Resource, 'id' | 'alt'>;
      resource: Resource;
    }) => {
      const { alt } = oldResource;

      updateElementById<MediaElement>({
        elementId,
        properties: () => {
          return {
            type: resource.type as unknown as ElementType,
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
    <T extends Resource = Resource>(
      elementId: ElementId,
      resource: Partial<T>
    ) => {
      updateElementById<MediaElement>({
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
    <T extends Resource = Resource>(
      resourceId: ResourceId,
      resource: Partial<T>
    ) => {
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
    (oldId: ResourceId, newId: ResourceId, mediaSource: string) => {
      updateMedia(oldId, {
        mediaSource,
        optimizedId: newId,
      });
    },
    [updateMedia]
  );

  const updateOldMutedObject = useCallback(
    (oldId: ResourceId, newId: ResourceId) => {
      updateMedia(oldId, {
        mutedId: newId,
      });
    },
    [updateMedia]
  );

  /**
   * Optimize video existing video using FFmpeg.
   *
   * @param resource Resource object.
   */
  const optimizeVideo = useCallback(
    ({ resource: oldResource }: { resource: VideoResource }) => {
      const { id: resourceId, src: url, mimeType } = oldResource;

      const onUploadError = () =>
        updateExistingElementsByResourceId(resourceId, {
          isOptimized: false,
        });

      const onUploadSuccess = ({
        id,
        resource,
      }: {
        id: ResourceId;
        resource: Resource;
      }) => {
        copyResourceData({ oldResource, resource });
        updateOldTranscodedObject(resourceId, resource.id, 'source-video');
        deleteMediaElement({ id: resourceId });

        // onUploadSuccess is also called with previousResourceId,
        // for which we don't need to run this.
        if (id === resource.id) {
          postProcessingResource(resource);
        }
      };

      // TODO: Confirm which properties exactly need to be updated.
      const onUploadProgress = ({ resource }: { resource: Resource }) => {
        const oldResourceWithId = { ...resource, id: oldResource.id };
        updateExistingElementsByResourceId(resourceId, {
          ...oldResourceWithId,
        });
      };

      void (async () => {
        if (getOptimizedMediaById) {
          const optimizedResource = await getOptimizedMediaById(resourceId);

          // This video was optimized before, no need to optimize it again.
          if (optimizedResource) {
            updateExistingElementsByResourceId(resourceId, optimizedResource);
            return;
          }
        }

        let file = null;
        try {
          file = await fetchRemoteFile(url, mimeType);
        } catch (e) {
          // Ignore for now.
          return;
        }

        // Video meets criteria to be considered optimized,
        // just mark it as such and call it a day.
        if (await isConsideredOptimized(oldResource, file)) {
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
      isConsideredOptimized,
      updateMedia,
    ]
  );

  /**
   * Trim existing video using FFmpeg.
   *
   * @param resource Resource object.
   * @param {string} start Time stamp of start time of new video. Example '00:01:02.345'.
   * @param {string} end Time stamp of end time of new video. Example '00:02:00'.
   */
  const trimExistingVideo = useCallback(
    ({
      resource: oldResource,
      canvasResourceId,
      elementId,
      start,
      end,
    }: {
      resource: VideoResource;
      canvasResourceId: ResourceId;
      elementId: ElementId;
      start: string;
      end: string;
    }) => {
      const { id: resourceId, ...oldResourceWithoutId } = oldResource;
      const { src: url, mimeType, poster, isMuted, isOptimized } = oldResource;

      const trimData = {
        original: resourceId,
        start,
        end,
      };

      const onUploadStart = () =>
        updateExistingElementById<VideoResource>(elementId, {
          trimData,
        });

      const onUploadError = () =>
        updateExistingElementById<VideoResource>(elementId, {
          trimData: oldResource.trimData || undefined,
        });

      const onUploadSuccess = ({
        id,
        resource,
      }: {
        id: ResourceId;
        resource: Resource;
      }) => {
        const oldCanvasResource: Pick<Resource, 'id' | 'alt'> = {
          alt: oldResource.alt,
          id: canvasResourceId,
        };
        copyResourceDataByElementId({
          elementId,
          oldResource: oldCanvasResource,
          resource,
        });

        // onUploadSuccess is also called with previousResourceId,
        // for which we don't need to run this.
        if (id === resource.id) {
          postProcessingResource(resource);
        }
      };

      const onUploadProgress = ({ resource }: { resource: Resource }) => {
        const newResourceWithCanvasId = { ...resource, id: canvasResourceId };
        updateExistingElementById(elementId, {
          ...newResourceWithCanvasId,
        });
      };

      const process = async () => {
        let file = null;
        let posterFile = null;
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
            trimData,
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
   * @param resource Resource object.
   */
  const muteExistingVideo = useCallback(
    ({ resource: oldResource }: { resource: VideoResource }) => {
      const { id: resourceId, ...oldResourceWithoutId } = oldResource;
      const { src: url, mimeType, poster, isOptimized } = oldResource;

      const onUploadError = () => {
        updateExistingElementsByResourceId<VideoResource>(resourceId, {
          isMuted: false,
        });
      };

      const onUploadSuccess = ({
        id,
        resource,
      }: {
        id: ResourceId;
        resource: Resource;
      }) => {
        copyResourceData({ oldResource, resource });
        updateOldMutedObject(oldResource.id, resource.id);

        // onUploadSuccess is also called with previousResourceId,
        // for which we don't need to run this.
        if (id === resource.id) {
          postProcessingResource(resource);
        }
      };

      // TODO: Confirm which properties exactly need to be updated.
      const onUploadProgress = ({ resource }: { resource: Resource }) => {
        const oldResourceWithId = { ...resource, id: oldResource.id };
        updateExistingElementsByResourceId(resourceId, {
          ...oldResourceWithId,
        });
      };

      void (async () => {
        if (getMutedMediaById) {
          const mutedResource = await getMutedMediaById(resourceId);

          // This video was muted before, no need to mute it again.
          if (mutedResource) {
            updateExistingElementsByResourceId(resourceId, mutedResource);
            return;
          }
        }

        let file = null;
        let posterFile = null;
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
   * @param resource Resource object.
   */
  const optimizeGif = useCallback(
    ({ resource: oldResource }: { resource: Resource }) => {
      const { id: resourceId, src: url, mimeType } = oldResource;

      const onUploadSuccess = ({
        id,
        resource,
      }: {
        id: ResourceId;
        resource: Resource;
      }) => {
        copyResourceData({ oldResource, resource });
        updateOldTranscodedObject(oldResource.id, resource.id, 'source-image');
        deleteMediaElement({ id: oldResource.id });

        // onUploadSuccess is also called with previousResourceId,
        // for which we don't need to run this.
        if (id === resource.id) {
          postProcessingResource(resource);
        }
      };

      // TODO: Confirm which properties exactly need to be updated.
      const onUploadProgress = ({ resource }: { resource: Resource }) => {
        const oldResourceWithId = { ...resource, id: oldResource.id };
        updateExistingElementsByResourceId(resourceId, {
          ...oldResourceWithId,
        });
      };

      const process = async () => {
        let file = null;
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
            originalId: resourceId,
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

  /**
   * Crop video using FFmpeg.
   *
   * @param resource Resource object.
   * @param Crop params.
   */
  const cropExistingVideo = useCallback(
    (
      {
        id: elementId,
        resource: oldResource,
      }: { id: ElementId; resource: Resource },
      cropParams: CropParams
    ) => {
      const { id: resourceId, ...oldResourceWithoutId } = oldResource;
      const { src: url, mimeType, isOptimized } = oldResource;
      const { newWidth, newHeight, cropElement } = cropParams;

      const onUploadError = () => {
        updateExistingElementsByResourceId(resourceId, {
          height: oldResource.height,
          width: oldResource.width,
        });
      };

      // TODO: Confirm which properties exactly need to be updated.
      const onUploadProgress = ({ resource }: { resource: Resource }) => {
        const oldResourceWithId = { ...resource, id: oldResource.id };
        updateExistingElementsByResourceId(resourceId, {
          ...oldResourceWithId,
        });
      };

      const onUploadSuccess = ({
        id,
        resource,
      }: {
        id: ResourceId;
        resource: Resource;
      }) => {
        copyResourceData({ oldResource, resource });
        updateElementById<MediaElement>({
          elementId,
          properties: {
            x: cropElement.x < 0 ? 0 : cropElement.x,
            y:
              cropElement.y < DANGER_ZONE_HEIGHT
                ? -DANGER_ZONE_HEIGHT
                : cropElement.y,
            width: newWidth,
            height: newHeight,
            resource,
          },
        });

        // onUploadSuccess is also called with previousResourceId,
        // for which we don't need to run this.
        if (id === resource.id) {
          postProcessingResource(resource);
        }
      };

      const process = async () => {
        let file = null;
        try {
          file = await fetchRemoteFile(url, mimeType);
          await uploadMedia([file], {
            onUploadSuccess,
            onUploadProgress,
            onUploadError,
            cropVideo: true,
            additionalData: {
              originalId: resourceId,
              cropOriginId: resourceId,
              cropParams,
              mediaSource: isOptimized ? 'video-optimization' : 'editor',
            },
            originalResourceId: resourceId,
            resource: {
              ...oldResourceWithoutId,
              width: newWidth,
              height: newHeight,
            },
          });
        } catch (e) {
          if (e instanceof Error) {
            void trackError('crop_existing_video', e.message);
          }
          return;
        }
      };
      return process();
    },
    [
      updateElementById,
      copyResourceData,
      postProcessingResource,
      uploadMedia,
      updateExistingElementsByResourceId,
    ]
  );

  /**
   * Segment video using FFmpeg.
   *
   * @param resource Resource object.
   * @param {Function} onUploadSuccess Callback for when upload finishes.
   * @return {string|null} Batch ID of the uploaded files on success, null otherwise.
   */
  const segmentVideo = useCallback(
    async (
      {
        resource,
        segmentTime,
      }: { resource: VideoResource; segmentTime: number },
      onUploadSuccess: (args: { id: ResourceId; resource: Resource }) => void
    ) => {
      try {
        const { src: url, mimeType } = resource;
        const segmentedFiles = await ffSegmentVideo(
          await fetchRemoteFile(url, mimeType),
          segmentTime,
          resource.length
        );

        return await uploadMedia(segmentedFiles, {
          onUploadSuccess: onUploadSuccess,
        });
      } catch (err) {
        if (err instanceof Error) {
          // eslint-disable-next-line no-console -- surface this error
          console.log(err.message);
          void trackError('segment_video', err.message);
        }
        return null;
      }
    },
    [uploadMedia, ffSegmentVideo]
  );

  return {
    optimizeVideo,
    optimizeGif,
    muteExistingVideo,
    trimExistingVideo,
    cropExistingVideo,
    segmentVideo,
  };
}

export default useProcessMedia;
