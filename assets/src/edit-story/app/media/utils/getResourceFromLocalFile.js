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
import { FULLBLEED_HEIGHT, PAGE_WIDTH } from '../../../constants';
import { createBlob } from '../../../utils/blobs';
import getTypeFromMime from './getTypeFromMime';
import getFirstFrameOfVideo from './getFirstFrameOfVideo';
import createResource from './createResource';
import getFileName from './getFileName';
import getImageDimensions from './getImageDimensions';

/**
 * Create a local resource object.
 *
 * @param {Object} properties The resource properties.
 * @return {import('./createResource').Resource} The local resource object.
 */
const createLocalResource = (properties) => {
  return createResource({ ...properties, local: true });
};

/**
 * Creates the File Reader object.
 *
 * @param {File} file The File object from the DataTransfer API.
 * @return {Promise<FileReader>} The promise of the FileReader object.
 */
const createFileReader = (file) => {
  const reader = new window.FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = () => resolve(reader);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Generates a image resource object from a local File object.
 *
 * @param {File} file File object.
 * @return {Promise<import('./createResource').Resource>} Local image resource object.
 */
const getImageResource = async (file) => {
  const fileName = getFileName(file);
  const mimeType = file.type;

  const reader = await createFileReader(file);

  const src = createBlob(new window.Blob([reader.result], { type: mimeType }));
  const { width, height } = await getImageDimensions(src);

  return createLocalResource({
    type: 'image',
    mimeType,
    src,
    width,
    height,
    alt: fileName,
    title: fileName,
  });
};

/**
 * Generates a video resource object from a local File object.
 *
 * @param {File} file File object.
 * @return {Promise<import('./createResource').Resource>} Local video resource object.
 */
const getVideoResource = async (file) => {
  const fileName = getFileName(file);
  const mimeType = file.type;

  const reader = await createFileReader(file);

  const src = createBlob(new Blob([reader.result], { type: mimeType }));

  const videoEl = document.createElement('video');
  const canPlayVideo = '' !== videoEl.canPlayType(mimeType);

  const frame = await getFirstFrameOfVideo(src);

  const poster = createBlob(frame);
  const { width, height } = await getImageDimensions(poster);

  return createLocalResource({
    type: 'video',
    mimeType,
    src: canPlayVideo ? src : '',
    width,
    height,
    poster,
    alt: fileName,
    title: fileName,
  });
};

const createPlaceholderResource = (properties) => {
  return createLocalResource({ ...properties, isPlaceholder: true });
};

const getPlaceholderResource = (file) => {
  const fileName = getFileName(file);
  const type = getTypeFromMime(file.type);
  const mimeType = type === 'image' ? 'image/png' : 'video/mp4';

  // The media library requires resources with valid mimeType and dimensions.
  return createPlaceholderResource({
    type: type || 'image',
    mimeType: mimeType,
    src: '',
    width: PAGE_WIDTH,
    height: FULLBLEED_HEIGHT,
    alt: fileName,
    title: fileName,
  });
};

/**
 * Generates a resource object from a local File object.
 *
 * @param {File} file File object.
 * @return {Promise<import('./createResource').Resource>} Resource object.
 */
const getResourceFromLocalFile = async (file) => {
  const type = getTypeFromMime(file.type);

  let resource = getPlaceholderResource(file);

  try {
    if ('image' === type) {
      resource = await getImageResource(file);
    }

    if ('video' === type) {
      resource = await getVideoResource(file);
    }
  } catch {
    // Not interested in the error here.
  }

  return resource;
};

export default getResourceFromLocalFile;
