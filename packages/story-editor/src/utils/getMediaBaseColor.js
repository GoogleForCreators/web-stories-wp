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
 * External dependencies
 */
import { getTimeTracker, trackError } from '@web-stories-wp/tracking';
import { getHexFromSolidArray } from '@web-stories-wp/patterns';

export async function getMediaBaseColor(src) {
  if (!src) {
    return Promise.reject(new Error('No source to image'));
  }
  let color;
  const trackTiming = getTimeTracker('load_get_base_color');
  try {
    color = await setOrCreateImage({
      src,
      width: 10,
      height: 'auto',
    });
  } catch (error) {
    // Known error of color thief with white only images.
    if (error?.name !== 'TypeError') {
      throw error;
    }
    color = '#ffffff';
  } finally {
    trackTiming();
  }
  return color;
}

function getDefaultOnloadCallback(imageNode, resolve, reject) {
  return () => {
    import(
      /* webpackPrefetch: true, webpackChunkName: "chunk-colorthief" */ 'colorthief'
    )
      .then(({ default: ColorThief }) => {
        const thief = new ColorThief();
        const rgb = thief.getColor(imageNode);
        imageNode.remove();
        resolve(getHexFromSolidArray(rgb));
      })
      .catch((err) => {
        trackError('image_base_color', err.message);
        reject(err);
      });
  };
}

export function setOrCreateImage(
  imageData,
  getOnloadCallback = getDefaultOnloadCallback
) {
  const { src, height, width } = imageData;
  return new Promise((resolve, reject) => {
    const img = new Image();
    // Necessary to avoid tainting canvas with CORS image data.
    img.crossOrigin = 'anonymous';
    img.decoding = 'async';
    img.addEventListener('load', getOnloadCallback(img, resolve, reject));
    img.addEventListener('error', (e) => {
      reject(new Error('Set image error: ' + e.message));
    });
    img.width = width;
    img.height = height;
    img.src = src;
  });
}
