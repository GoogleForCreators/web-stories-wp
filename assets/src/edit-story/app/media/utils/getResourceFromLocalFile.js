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
import getTypeFromMime from './getTypeFromMime';
import getFirstFrameOfVideo from './getFirstFrameOfVideo';

/**
 * Generates a virtual image to pick metadata resource
 *
 * @param {Object} image File object
 * @return {Promise} Resource object
 */

const getImageResource = (image) => {
  const reader = new window.FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = function(e) {
      const src = e.target.result;
      const img = new window.Image();

      img.onload = function() {
        const width = img.naturalWidth;
        const height = img.naturalHeight;

        resolve({
          type: 'image',
          src,
          width,
          height,
          mimeType: image.type,
          posterId: undefined,
          poster: '',
          videoId: undefined,
          local: true,
          lengthFormatted: undefined,
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

const getVideoResource = (video) => {
  const reader = new window.FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = async () => {
      const src = window.URL.createObjectURL(
        new window.Blob([reader.result], { type: video.type })
      );
      const poster = window.URL.createObjectURL(
        await getFirstFrameOfVideo(src)
      );
      const img = new window.Image();

      img.onload = function() {
        const width = img.naturalWidth;
        const height = img.naturalHeight;

        resolve({
          type: 'video',
          src,
          width,
          height,
          mimeType: video.type,
          posterId: undefined,
          poster,
          videoId: undefined,
          local: true,
          lengthFormatted: undefined,
        });
      };

      img.src = poster;
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
    return getImageResource(file);
  }

  return getVideoResource(file);
};

export default getResourceFromLocalFile;
