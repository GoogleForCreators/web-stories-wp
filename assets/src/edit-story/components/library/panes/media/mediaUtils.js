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
 * Infer element type from mime type of its resource
 *
 * @param {string} mimeType Mime type.
 * @return {string} Element type.
 */
const getTypeFromMime = (mimeType) => {
  return mimeType.startsWith('image/') ? 'image' : 'video';
};

/**
 * Generates a resource object from a WordPress attachment
 *
 * @param {Object} attachment WP Attachment object
 * @return {Object} Resource object
 */
export const getResourceFromAttachment = (attachment) => {
  const {
    src,
    url,
    mimeType,
    oWidth,
    oHeight,
    id: videoId,
    posterId,
    poster,
    lengthFormatted,
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
    lengthFormatted,
  };
};

/**
 * Generates a resource object from a WordPress media picker object
 *
 * @param {Object} mediaPickerEl WP Media Picker object
 * @return {Object} Resource object
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
  return {
    type: getTypeFromMime(mimeType),
    src: url || src,
    width,
    height,
    mimeType,
    posterId,
    poster,
    videoId,
  };
};

/**
 * Generates a resource object from a local File object
 *
 * @param {Object} file FIle object
 * @return {Object} Resource object
 */
export const getResourceFromLocalFile = (file) => {
  return new Promise((resolve, reject) => {
    const mimeType = file.type;
    const reader = new window.FileReader();
    let src;
    let width;
    let height;
    reader.onload = function(e) {
      src = e.target.result;

      const img = new window.Image();

      img.onload = function() {
        width = img.width;
        height = img.height;

        resolve({
          type: getTypeFromMime(mimeType),
          src,
          width,
          height,
          mimeType,
          posterId: Math.floor(Date.now() / 1000),
          poster: '',
          videoId: undefined,
          local: true,
          lengthFormatted: undefined,
        });
      };

      img.src = src;
    };

    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
};
