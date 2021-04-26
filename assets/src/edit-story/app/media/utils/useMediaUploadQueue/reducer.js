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

/**
 * Internal dependencies
 */
import { revokeBlob } from '../../../../utils/blobs';

/**
 * Add an item to the upload queue.
 *
 * @param {Object} state Current state.
 * @param {Object} action Action object.
 * @param {Object} action.payload Action payload.
 * @param {File} action.payload.file File object.
 * @param {import('../createResource').Resource} action.payload.resource Resource object.
 * @param {Function} action.payload.onUploadStart Callback for when upload starts.
 * @param {Function} action.payload.onUploadProgress Callback for when upload progresses.
 * @param {Function} action.payload.onUploadError Callback for when upload errors.
 * @param {Function} action.payload.onUploadSuccess Callback for when upload succeeds.
 * @param {Object}   action.payload.additionalData Additional Data object.
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
      additionalData,
    },
  }
) {
  const id = uuidv4();
  const newItem = {
    id,
    file,
    state: 'PENDING',
    resource: {
      ...resource,
      id,
    },
    onUploadStart,
    onUploadProgress,
    onUploadError,
    onUploadSuccess,
    additionalData,
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
            state: 'UPLOADING',
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
 * @param {import('../createResource').Resource} action.payload.resource Resource object.
 * @return {Object} New state
 */
export function finishUploading(state, { payload: { id, resource } }) {
  const queueItem = state.queue.find((item) => item.id === id);
  if (!queueItem) {
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
            resource,
            state: 'UPLOADED',
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
            state: 'CANCELLED',
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
            state: 'TRANSCODING',
            resource: {
              ...item.resource,
              isTranscoding: true,
            },
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
 * @return {Object} New state
 */
export function finishTranscoding(state, { payload: { id, file } }) {
  return {
    ...state,
    queue: state.queue.map((item) =>
      item.id === id
        ? {
            ...item,
            file,
            state: 'TRANSCODED',
            resource: {
              ...item.resource,
              isTranscoding: false,
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
 * @param {import('../createResource').Resource} action.payload.resource Resource object.
 * @return {Object} New state
 */
export function replacePlaceholderResource(
  state,
  { payload: { id, resource } }
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
              id,
              isPlaceholder: false,
            },
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
