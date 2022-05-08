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
import { revokeBlob } from '@googleforcreators/media';

/**
 * Internal dependencies
 */
import { ITEM_STATUS } from './constants';

/**
 * Add an item to the upload queue.
 *
 * @param {Object} state Current state.
 * @param {Object} action Action object.
 * @param {Object} action.payload Action payload.
 * @param {File} action.payload.file File object.
 * @param {import('@googleforcreators/media').Resource} action.payload.resource Resource object.
 * @param {Function} action.payload.onUploadStart Callback for when upload starts.
 * @param {Function} action.payload.onUploadProgress Callback for when upload progresses.
 * @param {Function} action.payload.onUploadError Callback for when upload errors.
 * @param {Function} action.payload.onUploadSuccess Callback for when upload succeeds.
 * @param {Object}   action.payload.additionalData Additional Data object.
 * @param {File} action.payload.posterFile File object.
 * @param {boolean} action.payload.muteVideo Whether the video being uploaded should be muted.
 * @param {import('@googleforcreators/media').TrimData} action.payload.trimData Trim data.
 * @param {number} action.payload.originalResourceId Original resource id.
 * @param {string} action.payload.elementId ID of element on the canvas.
 * @return {Object} New state
 */
export function addItem(
  state,
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
      trimData,
      originalResourceId,
      elementId,
    },
  }
) {
  const id = uuidv4();

  if (!resource.id) {
    resource.id = uuidv4();
  }

  const newItem = {
    id,
    file,
    state: ITEM_STATUS.PENDING,
    resource,
    onUploadStart,
    onUploadProgress,
    onUploadError,
    onUploadSuccess,
    additionalData,
    posterFile,
    muteVideo,
    trimData,
    originalResourceId,
    elementId,
  };

  return {
    ...state,
    queue: [...state.queue, newItem],
  };
}

/**
 * Starts uploading a file.
 *
 * @param {Object} state Current state.
 * @param {Object} action Action object.
 * @param {Object} action.payload Action payload.
 * @param {string} action.payload.id Item ID.
 * @return {Object} New state
 */
export function startUploading(state, { payload: { id } }) {
  return {
    ...state,
    queue: state.queue.map((item) =>
      item.id === id
        ? {
            ...item,
            state: ITEM_STATUS.UPLOADING,
          }
        : item
    ),
  };
}

/**
 * Finishes uploading a file.
 *
 * @param {Object} state Current state.
 * @param {Object} action Action object.
 * @param {Object} action.payload Action payload.
 * @param {string} action.payload.id Item ID.
 * @param {import('@googleforcreators/media').Resource} action.payload.resource Resource object.
 * @return {Object} New state
 */
export function finishUploading(state, { payload: { id, resource } }) {
  const queueItem = state.queue.find((item) => item.id === id);
  if (!queueItem) {
    return state;
  }

  if (queueItem.resource.src && queueItem.resource.src !== resource.src) {
    revokeBlob(queueItem.resource.src);
  }

  if (
    resource.poster &&
    queueItem.resource.poster &&
    queueItem.resource.poster !== resource.poster
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
              // Ensure that we don't override
              poster: resource.poster || item.resource.poster,
            },
            previousResourceId: item.resource.id,
            posterFile: null,
            originalResourceId: null,
            state: ITEM_STATUS.UPLOADED,
          }
        : item
    ),
  };
}

/**
 * Cancels uploading a file.
 *
 * @param {Object} state Current state.
 * @param {Object} action Action object.
 * @param {Object} action.payload Action payload.
 * @param {string} action.payload.id Item ID.
 * @return {Object} New state
 */
export function cancelUploading(state, { payload: { id } }) {
  return {
    ...state,
    queue: state.queue.map((item) =>
      item.id === id
        ? {
            ...item,
            state: ITEM_STATUS.CANCELLED,
          }
        : item
    ),
  };
}

/**
 * Starts transcoding a file.
 *
 * @param {Object} state Current state.
 * @param {Object} action Action object.
 * @param {Object} action.payload Action payload.
 * @param {string} action.payload.id Item ID.
 * @return {Object} New state
 */
export function startTranscoding(state, { payload: { id } }) {
  return {
    ...state,
    queue: state.queue.map((item) =>
      item.id === id
        ? {
            ...item,
            state: ITEM_STATUS.TRANSCODING,
          }
        : item
    ),
  };
}

/**
 * Finishes transcoding a file.
 *
 * @param {Object} state Current state.
 * @param {Object} action Action object.
 * @param {Object} action.payload Action payload.
 * @param {string} action.payload.id Item ID.
 * @param {File} action.payload.file New file object.
 * @param {Object} action.payload.additionalData Additional data.
 * @return {Object} New state
 */
export function finishTranscoding(
  state,
  { payload: { id, file, additionalData = {} } }
) {
  return {
    ...state,
    queue: state.queue.map((item) =>
      item.id === id
        ? {
            ...item,
            file,
            state: ITEM_STATUS.TRANSCODED,
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
 * @param {Object} state Current state.
 * @param {Object} action Action object.
 * @param {Object} action.payload Action payload.
 * @param {string} action.payload.id Item ID.
 * @return {Object} New state
 */
export function startMuting(state, { payload: { id } }) {
  return {
    ...state,
    queue: state.queue.map((item) =>
      item.id === id
        ? {
            ...item,
            state: ITEM_STATUS.MUTING,
          }
        : item
    ),
  };
}

/**
 * Finishes muting a file.
 *
 * @param {Object} state Current state.
 * @param {Object} action Action object.
 * @param {Object} action.payload Action payload.
 * @param {string} action.payload.id Item ID.
 * @param {File} action.payload.file New file object.
 * @param {Object} action.payload.additionalData Additional data.
 * @return {Object} New state
 */
export function finishMuting(
  state,
  { payload: { id, file, additionalData = {} } }
) {
  return {
    ...state,
    queue: state.queue.map((item) =>
      item.id === id
        ? {
            ...item,
            file,
            state: ITEM_STATUS.MUTED,
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
 * Starts trimming a file.
 *
 * @param {Object} state Current state.
 * @param {Object} action Action object.
 * @param {Object} action.payload Action payload.
 * @param {string} action.payload.id Item ID.
 * @return {Object} New state
 */
export function startTrimming(state, { payload: { id } }) {
  return {
    ...state,
    queue: state.queue.map((item) =>
      item.id === id
        ? {
            ...item,
            state: ITEM_STATUS.TRIMMING,
          }
        : item
    ),
  };
}

/**
 * Finishes trimming a file.
 *
 * @param {Object} state Current state.
 * @param {Object} action Action object.
 * @param {Object} action.payload Action payload.
 * @param {string} action.payload.id Item ID.
 * @param {File} action.payload.file New file object.
 * @param {Object} action.payload.additionalData Additional data.
 * @return {Object} New state
 */
export function finishTrimming(
  state,
  { payload: { id, file, additionalData = {} } }
) {
  return {
    ...state,
    queue: state.queue.map((item) =>
      item.id === id
        ? {
            ...item,
            file,
            state: ITEM_STATUS.TRIMMED,
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
 * @param {Object} state Current state.
 * @param {Object} action Action object.
 * @param {Object} action.payload Action payload.
 * @param {string} action.payload.id Item ID.
 * @param {File} action.payload.posterFile Poster file.
 * @param {import('@googleforcreators/media').Resource} action.payload.resource Resource object.
 * @return {Object} New state
 */
export function replacePlaceholderResource(
  state,
  { payload: { id, resource, posterFile } }
) {
  const queueItem = state.queue.find((item) => item.id === id);
  if (!queueItem || !queueItem.resource.isPlaceholder) {
    return state;
  }

  if (queueItem.resource.src !== resource.src) {
    revokeBlob(queueItem.resource.src);
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
 * @param {Object} state Current state.
 * @param {Object} action Action object.
 * @param {Object} action.payload Action payload.
 * @param {string} action.payload.id Item ID.
 * @return {Object} New state
 */
export function finishItem(state, { payload: { id } }) {
  return {
    ...state,
    queue: state.queue.map((item) =>
      item.id === id
        ? {
            ...item,
            state: ITEM_STATUS.FINISHED,
          }
        : item
    ),
  };
}

/**
 * Removes an item from the queue.
 *
 * @param {Object} state Current state.
 * @param {Object} action Action object.
 * @param {Object} action.payload Action payload.
 * @param {string} action.payload.id Item ID.
 * @return {Object} New state
 */
export function removeItem(state, { payload: { id } }) {
  const newQueue = state.queue.filter((item) => item.id !== id);
  return {
    ...state,
    queue: newQueue,
  };
}
