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

const getTypeFromMime = (mimeType) => {
  return mimeType.startsWith('image/') ? 'image' : 'video';
};

/**
 * Generates a resource object from a wordpress attachment
 *
 * @param {Object} attachment
 * @return {Object}
 */
export const getResourceFromAttachment = (attachment) => {
  const {
    src,
    url,
    mimeType,
    oWidth,
    oHeight,
    id: videoId,
    featured_media: posterId,
    featured_media_src: poster,
  } = attachment;
  return {
    type: getTypeFromMime(mimeType),
    src: url || src,
    width: oWidth,
    height: oHeight,
    mimeType,
    posterId,
    poster,
    videoId,
  };
};

/**
 * Generates a resource object from a wordpress media picker object
 *
 * @param {Object} mediaPickerEl
 * @return {Object}
 */
export const getResourceFromMediaPicker = (mediaPickerEl) => {
  const {
    src,
    url,
    mime: mimeType,
    width,
    height,
    id: videoId,
    featured_media: posterId,
    featured_media_src: poster,
  } = mediaPickerEl;
  const type = getTypeFromMime(mimeType);
  return {
    type,
    src: url || src,
    width,
    height,
    mimeType,
    ...(type === 'video' ? { posterId, poster, videoId } : {}),
  };
};

/**
 * Generates a resource object from the upload API response object
 *
 * @param {Object} file
 * @return {Object}
 */
export const getResourceFromUploadAPI = (file) => {
  const {
    guid: { rendered: src },
    mime_type: mimeType,
    media_details: { width, height },
    id: videoId,
    featured_media: posterId,
    featured_media_src: poster,
  } = file;
  const type = getTypeFromMime(mimeType);
  return {
    type,
    src,
    width,
    height,
    mimeType,
    ...(type === 'video' ? { posterId, poster, videoId } : {}),
  };
};
