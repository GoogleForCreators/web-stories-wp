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
 * Internal dependencies
 */
import { defaultAttributes as DefaultVideoAttributes } from '../../../../elements/video';
import { defaultAttributes as DefaultImageAttributes } from '../../../../elements/image';

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
 * Generates a virtual image to pick metadata resource
 *
 * @param {Object} image File object
 * @return {Promise} Resource object
 */

const getImageMetadata = (image) => {
  const reader = new window.FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = function(e) {
      const src = e.target.result;
      const randomId = Math.floor(Date.now() / 1000);

      const img = new window.Image();

      img.onload = function() {
        const width = img.width;
        const height = img.height;

        resolve({
          type: 'image',
          src,
          width,
          height,
          mimeType: image.type,
          posterId: randomId,
          poster: '',
          videoId: undefined,
          local: true,
          lengthFormatted: undefined,
          defaultAttributes: DefaultImageAttributes,
        });
      };

      img.src = src;
    };

    reader.onerror = reject;

    reader.readAsDataURL(image);
  });
};

/**
 * Generates a virtual video to pick metadata resource
 *
 * @param {Object} video File object
 * @return {Promise} Resource object
 */

const getVideoMetadata = (video) => {
  const reader = new window.FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = function() {
      const blob = new window.Blob([reader.result], { type: video.type });
      const src = URL.createObjectURL(blob);
      const v = document.createElement('video');
      const randomId = Math.floor(Date.now() / 1000);

      const snapshot = () => {
        const canvas = document.createElement('canvas');
        canvas.width = v.videoWidth;
        canvas.height = v.videoHeight;
        canvas.getContext('2d').drawImage(v, 0, 0, canvas.width, canvas.height);
        const poster = canvas.toDataURL();
        const success = poster.length > 100000;

        if (success) {
          const img = new window.Image();

          img.onload = function() {
            const width = img.width;
            const height = img.height;

            resolve({
              type: 'video',
              src,
              width,
              height,
              mimeType: video.type,
              posterId: randomId,
              poster,
              videoId: randomId,
              local: true,
              lengthFormatted: undefined,
              defaultAttributes: DefaultVideoAttributes,
            });
          };

          img.src = poster;
        }
        return success;
      };
      const timeupdate = () => {
        if (snapshot()) {
          v.removeEventListener('timeupdate', timeupdate);
          v.pause();
        }
      };
      v.addEventListener(
        'loadeddata',
        () => snapshot() && v.removeEventListener('timeupdate', timeupdate)
      );
      v.addEventListener('timeupdate', timeupdate);
      v.preload = 'metadata';
      v.src = src;
      v.muted = true;
      v.playsInline = true;
      v.play();
    };

    reader.onerror = reject;

    reader.readAsArrayBuffer(video);
  });
};

/**
 * Generates a resource object from a local File object
 *
 * @param {Object} file File object
 * @return {Object} Resource object
 */
export const getResourceFromLocalFile = (file) => {
  const type = getTypeFromMime(file.type);

  if (type === 'image') {
    return getImageMetadata(file);
  }

  return getVideoMetadata(file);
};

/**
 * Generates a resource object from the upload API response object
 *
 * @param {Object} file The uploaded file payload.
 * @return {Object} Resource object.
 */
export const getResourceFromUploadAPI = (file) => {
  const {
    guid: { rendered: src },
    mime_type: mimeType,
    media_details: { width, height, length_formatted: lengthFormatted },
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
    lengthFormatted,
    oWidth: width, // TODO: check why we are using this format `oWidth` on media library and improve it
    oHeight: height, // TODO: check why we are using this format `oHeight` on media library and improve it
    defaultAttributes:
      type === 'video' ? DefaultVideoAttributes : DefaultImageAttributes,
    ...(type === 'video' ? { posterId, poster, videoId } : {}),
  };
};
