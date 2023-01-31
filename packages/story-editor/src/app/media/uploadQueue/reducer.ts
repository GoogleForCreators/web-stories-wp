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
import { v4 as uuidv4 } from 'uuid';
import type {
  AudioResource,
  GifResource,
  ImageResource,
  VideoResource,
} from '@googleforcreators/media';
import { ResourceType, revokeBlob } from '@googleforcreators/media';

/**
 * Internal dependencies
 */
import type {
  AdditionalData,
  QueueItem,
  QueueState,
  QueueItemId,
} from './types';
import { ItemStatus } from './types';

interface BaseReducerProps {
  payload: {
    id: QueueItemId;
  };
}

interface ReplacePlaceholderResourceProps {
  payload: {
    id: QueueItemId;
    resource: ImageResource | VideoResource | GifResource | AudioResource;
    posterFile: File | null;
  };
}

interface FinishTrimmingProps {
  payload: {
    id: QueueItemId;
    file: File;
    additionalData: AdditionalData;
  };
}

interface FinishCroppingProps {
  payload: {
    id: QueueItemId;
    file: File;
    posterFile?: File;
    additionalData: AdditionalData;
  };
}

interface FinishMutingProps {
  payload: {
    id: QueueItemId;
    file: File;
    additionalData: AdditionalData;
  };
}

interface FinishTranscodingProps {
  payload: {
    id: QueueItemId;
    file: File;
    additionalData: AdditionalData;
  };
}

interface FinishUploadingProps {
  payload: {
    id: QueueItemId;
    resource: ImageResource | VideoResource | GifResource | AudioResource;
  };
}

interface AddItemProps {
  payload: QueueItem;
}

interface CancelUploadingProps {
  payload: {
    id: QueueItemId;
    error?: Error;
  };
}

/**
 * Add an item to the upload queue.
 *
 * @param state Current state.
 * @param action Action object.
 * @param action.payload Action payload.
 * @param action.payload.file File object.
 * @param action.payload.resource Resource object.
 * @param action.payload.onUploadStart Callback for when upload starts.
 * @param action.payload.onUploadProgress Callback for when upload progresses.
 * @param action.payload.onUploadError Callback for when upload errors.
 * @param action.payload.onUploadSuccess Callback for when upload succeeds.
 * @param action.payload.additionalData Additional Data object.
 * @param action.payload.posterFile File object.
 * @param action.payload.muteVideo Whether the video being uploaded should be muted.
 * @param action.payload.cropVideo Whether the video being uploaded should be cropped.
 * @param action.payload.trimData Trim data.
 * @param action.payload.originalResourceId Original resource id.
 * @param action.payload.elementId ID of element on the canvas.
 * @param action.payload.isAnimatedGif Whether the item is an animated GIF.
 * @return New state
 */
export function addItem(
  state: QueueState,
  {
    payload: {
      file,
      resource,
      onUploadStart,
      onUploadProgress,
      onUploadError,
      onUploadSuccess,
      additionalData = {},
      posterFile,
      muteVideo,
      cropVideo,
      trimData,
      originalResourceId,
      elementId,
      isAnimatedGif,
    },
  }: AddItemProps
) {
  const id = uuidv4();

  if (!resource.id) {
    resource.id = uuidv4();
  }

  if (
    resource.type === ResourceType.Video &&
    resource.isMuted !== null &&
    additionalData?.isMuted === undefined
  ) {
    additionalData.isMuted = resource.isMuted;
  }

  if (resource?.baseColor) {
    additionalData.baseColor = resource.baseColor;
  }

  // Do not copy over BlurHash for new trimmed and cropped videos
  // since the poster (and thus the BlurHash) might be different.
  if (resource?.blurHash && !trimData && !cropVideo) {
    additionalData.blurHash = resource.blurHash;
  }

  const newItem = {
    id,
    file,
    state: ItemStatus.Pending,
    resource,
    onUploadStart,
    onUploadProgress,
    onUploadError,
    onUploadSuccess,
    additionalData,
    posterFile,
    muteVideo,
    cropVideo,
    trimData,
    originalResourceId,
    elementId,
    isAnimatedGif,
  };

  return {
    ...state,
    queue: [...state.queue, newItem],
  };
}

/**
 * Prepare a file for further processing.
 *
 * @param state Current state.
 * @param action Action object.
 * @param action.payload Action payload.
 * @param action.payload.id Item ID.
 * @return New state
 */
export function prepareItem(
  state: QueueState,
  { payload: { id } }: BaseReducerProps
) {
  return {
    ...state,
    queue: state.queue.map((item) =>
      item.id === id
        ? {
            ...item,
            state: ItemStatus.Preparing,
          }
        : item
    ),
  };
}

/**
 * Prepare a file for transcoding.
 *
 * @param state Current state.
 * @param action Action object.
 * @param action.payload Action payload.
 * @param action.payload.id Item ID.
 * @return New state
 */
export function prepareForTranscoding(
  state: QueueState,
  { payload: { id } }: BaseReducerProps
) {
  return {
    ...state,
    queue: state.queue.map((item) =>
      item.id === id
        ? {
            ...item,
            state: ItemStatus.PendingTranscoding,
          }
        : item
    ),
  };
}

/**
 * Starts uploading a file.
 *
 * @param state Current state.
 * @param action Action object.
 * @param action.payload Action payload.
 * @param action.payload.id Item ID.
 * @return New state
 */
export function startUploading(
  state: QueueState,
  { payload: { id } }: BaseReducerProps
) {
  return {
    ...state,
    queue: state.queue.map((item) =>
      item.id === id
        ? {
            ...item,
            state: ItemStatus.Uploading,
          }
        : item
    ),
  };
}

/**
 * Finishes uploading a file.
 *
 * @param state Current state.
 * @param action Action object.
 * @param action.payload Action payload.
 * @param action.payload.id Item ID.
 * @param action.payload.resource Resource object.
 * @return New state
 */
export function finishUploading(
  state: QueueState,
  { payload: { id, resource } }: FinishUploadingProps
) {
  const queueItem = state.queue.find((item) => item.id === id);
  if (!queueItem) {
    return state;
  }

  if (queueItem.resource.src && queueItem.resource.src !== resource.src) {
    revokeBlob(queueItem.resource.src);
  }

  if (
    resource.type === ResourceType.Video &&
    queueItem.resource.type === ResourceType.Video &&
    resource.poster &&
    queueItem.resource.poster &&
    queueItem.resource.poster !== resource.poster
  ) {
    revokeBlob(queueItem.resource.poster);
  }

  return {
    ...state,
    queue: state.queue.map((item) => {
      if (item.id !== id) {
        return item;
      }

      let poster;
      if (resource.type === ResourceType.Video && resource.poster) {
        poster = resource.poster;
      } else if (
        item.resource.type === ResourceType.Video &&
        item.resource.poster
      ) {
        poster = item.resource.poster;
      }

      return {
        ...item,
        resource: {
          ...resource,
          // Ensure that we don't override
          poster,
        },
        previousResourceId: item.resource.id,
        posterFile: null,
        originalResourceId: null,
        state: ItemStatus.Uploaded,
      };
    }),
  };
}

/**
 * Cancels uploading a file.
 *
 * @param state Current state.
 * @param action Action object.
 * @param action.payload Action payload.
 * @param action.payload.id Item ID.
 * @return New state
 */
export function cancelUploading(
  state: QueueState,
  { payload: { id, error } }: CancelUploadingProps
) {
  return {
    ...state,
    queue: state.queue.map((item) =>
      item.id === id
        ? {
            ...item,
            state: ItemStatus.Cancelled,
            error,
          }
        : item
    ),
  };
}

/**
 * Starts transcoding a file.
 *
 * @param state Current state.
 * @param action Action object.
 * @param action.payload Action payload.
 * @param action.payload.id Item ID.
 * @return New state
 */
export function startTranscoding(
  state: QueueState,
  { payload: { id } }: BaseReducerProps
) {
  return {
    ...state,
    queue: state.queue.map((item) =>
      item.id === id
        ? {
            ...item,
            state: ItemStatus.Transcoding,
          }
        : item
    ),
  };
}

/**
 * Finishes transcoding a file.
 *
 * @param state Current state.
 * @param action Action object.
 * @param action.payload Action payload.
 * @param action.payload.id Item ID.
 * @param action.payload.file New file object.
 * @param action.payload.additionalData Additional data.
 * @return New state
 */
export function finishTranscoding(
  state: QueueState,
  { payload: { id, file, additionalData = {} } }: FinishTranscodingProps
) {
  return {
    ...state,
    queue: state.queue.map((item) =>
      item.id === id
        ? {
            ...item,
            file,
            state: ItemStatus.Transcoded,
            resource: {
              ...item.resource,
              isOptimized: true,
            },
            additionalData: {
              ...item.additionalData,
              ...additionalData,
            },
          }
        : item
    ),
  };
}

/**
 * Starts muting a file.
 *
 * @param state Current state.
 * @param action Action object.
 * @param action.payload Action payload.
 * @param action.payload.id Item ID.
 * @return New state
 */
export function startMuting(
  state: QueueState,
  { payload: { id } }: BaseReducerProps
) {
  return {
    ...state,
    queue: state.queue.map((item) =>
      item.id === id
        ? {
            ...item,
            state: ItemStatus.Muting,
          }
        : item
    ),
  };
}

/**
 * Finishes muting a file.
 *
 * @param state Current state.
 * @param action Action object.
 * @param action.payload Action payload.
 * @param action.payload.id Item ID.
 * @param action.payload.file New file object.
 * @param action.payload.additionalData Additional data.
 * @return New state
 */
export function finishMuting(
  state: QueueState,
  { payload: { id, file, additionalData = {} } }: FinishMutingProps
) {
  return {
    ...state,
    queue: state.queue.map((item) =>
      item.id === id
        ? {
            ...item,
            file,
            state: ItemStatus.Muted,
            resource: {
              ...item.resource,
              isMuted: true,
            },
            additionalData: {
              ...item.additionalData,
              ...additionalData,
            },
          }
        : item
    ),
  };
}

/**
 * Starts cropping a file.
 *
 * @param state Current state.
 * @param action Action object.
 * @param action.payload Action payload.
 * @param action.payload.id Item ID.
 * @return New state
 */
export function startCropping(
  state: QueueState,
  { payload: { id } }: BaseReducerProps
) {
  return {
    ...state,
    queue: state.queue.map((item) =>
      item.id === id
        ? {
            ...item,
            state: ItemStatus.Cropping,
          }
        : item
    ),
  };
}

/**
 * Finishes cropping a file.
 *
 * @param state Current state.
 * @param action Action object.
 * @param action.payload Action payload.
 * @param action.payload.id Item ID.
 * @param action.payload.file New file object.
 * @param action.payload.posterFile New poster file object.
 * @param action.payload.additionalData Additional data.
 * @return New state
 */
export function finishCropping(
  state: QueueState,
  {
    payload: { id, file, posterFile, additionalData = {} },
  }: FinishCroppingProps
) {
  return {
    ...state,
    queue: state.queue.map((item) =>
      item.id === id
        ? {
            ...item,
            file,
            posterFile,
            state: ItemStatus.Cropped,
            additionalData: {
              ...item.additionalData,
              ...additionalData,
            },
          }
        : item
    ),
  };
}

/**
 * Starts trimming a file.
 *
 * @param state Current state.
 * @param action Action object.
 * @param action.payload Action payload.
 * @param action.payload.id Item ID.
 * @return New state
 */
export function startTrimming(
  state: QueueState,
  { payload: { id } }: BaseReducerProps
) {
  return {
    ...state,
    queue: state.queue.map((item) =>
      item.id === id
        ? {
            ...item,
            state: ItemStatus.Trimming,
          }
        : item
    ),
  };
}

/**
 * Finishes trimming a file.
 *
 * @param state Current state.
 * @param action Action object.
 * @param action.payload Action payload.
 * @param action.payload.id Item ID.
 * @param action.payload.file New file object.
 * @param action.payload.additionalData Additional data.
 * @return New state
 */
export function finishTrimming(
  state: QueueState,
  { payload: { id, file, additionalData = {} } }: FinishTrimmingProps
) {
  return {
    ...state,
    queue: state.queue.map((item) =>
      item.id === id
        ? {
            ...item,
            file,
            state: ItemStatus.Trimmed,
            additionalData: {
              ...item.additionalData,
              ...additionalData,
            },
          }
        : item
    ),
  };
}

/**
 * Replaces an item's placeholder resource.
 *
 * If the item's resource is not a placeholder, does nothing.
 *
 * @param state Current state.
 * @param action Action object.
 * @param action.payload Action payload.
 * @param action.payload.id Item ID.
 * @param action.payload.posterFile Poster file.
 * @param action.payload.resource Resource object.
 * @return New state
 */
export function replacePlaceholderResource(
  state: QueueState,
  { payload: { id, resource, posterFile } }: ReplacePlaceholderResourceProps
) {
  const queueItem = state.queue.find((item) => item.id === id);
  if (!queueItem || !queueItem.resource.isPlaceholder) {
    return state;
  }

  if (queueItem.resource.src !== resource.src) {
    revokeBlob(queueItem.resource.src);
  }
  if (
    queueItem.resource.type === ResourceType.Video &&
    queueItem.resource.poster
  ) {
    revokeBlob(queueItem.resource.poster);
  }

  return {
    ...state,
    queue: state.queue.map((item) =>
      item.id === id
        ? {
            ...item,
            resource: {
              ...resource,
              // Keep the existing resource's ID (which at this point is a random uuid)
              // instead of overriding it with another random uuid.
              id: item.resource.id,
              isPlaceholder: false,
            },
            posterFile,
          }
        : item
    ),
  };
}

/**
 * Mark an item upload as fully finished.
 *
 * @param state Current state.
 * @param action Action object.
 * @param action.payload Action payload.
 * @param action.payload.id Item ID.
 * @return New state
 */
export function finishItem(
  state: QueueState,
  { payload: { id } }: BaseReducerProps
) {
  return {
    ...state,
    queue: state.queue.map((item) =>
      item.id === id
        ? {
            ...item,
            state: ItemStatus.Finished,
          }
        : item
    ),
  };
}

/**
 * Removes an item from the queue.
 *
 * @param state Current state.
 * @param action Action object.
 * @param action.payload Action payload.
 * @param action.payload.id Item ID.
 * @return New state
 */
export function removeItem(
  state: QueueState,
  { payload: { id } }: BaseReducerProps
) {
  const newQueue = state.queue.filter((item: QueueItem) => item.id !== id);
  return {
    ...state,
    queue: newQueue,
  };
}
