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
 * Get image dimensions from an image
 *
 * @param {Image} Image source
 * @return {Promise} Image dimensions object
 */

const createFileReader = (file, onload) => {
  const reader = new window.FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = async () => {
      await onload({ reader, resolve, reject });
    };

    reader.onerror = reject;

    reader.readAsArrayBuffer(file);
  });
};

/**
 * Get image dimensions from an image
 *
 * @param {Image} Image source
 * @return {Promise} Image dimensions object
 */

const getImageDimensions = (src) => {
  return new Promise((resolve, reject) => {
    const img = new window.Image();

    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };

    img.onerror = reject;

    img.src = src;
  });
};

/**
 * Generates a image resource object from a local File object
 *
 * @param {File} image File object
 * @return {Promise} Local image resource object
 */

const getImageResource = (image) => {
  return createFileReader(image, async ({ reader, resolve, reject }) => {
    try {
      const src = window.URL.createObjectURL(
        new window.Blob([reader.result], { type: image.type })
      );
      const { width, height } = await getImageDimensions(src);

      resolve({
        type: 'image',
        src,
        width,
        height,
        mimeType: image.type,
        local: true,
      });
    } catch (e) {
      reject(e);
    }
  });
};

/**
 * Generates a video resource object from a local File object
 *
 * @param {File} video File object
 * @return {Promise} Local video resource object
 */

const getVideoResource = (video) => {
  return createFileReader(video, async ({ reader, resolve, reject }) => {
    try {
      const mimeType = video.type;
      const src = window.URL.createObjectURL(
        new window.Blob([reader.result], { type: mimeType })
      );
      const poster = window.URL.createObjectURL(
        await getFirstFrameOfVideo(src)
      );
      const { width, height } = await getImageDimensions(poster);

      resolve({
        type: 'video',
        src,
        width,
        height,
        mimeType,
        poster,
        local: true,
      });
    } catch (e) {
      reject(e);
    }
  });
};

/**
 * Generates a resource object from a local File object
 *
 * @param {File} file File object
 * @return {Promise<Object>|null} Resource object
 */
export const getResourceFromLocalFile = (file) => {
  const type = getTypeFromMime(file.type);

  if (type === 'image') {
    return getImageResource(file);
  } else if (type === 'video') {
    return getVideoResource(file);
  }

  return null;
};

export default getResourceFromLocalFile;
