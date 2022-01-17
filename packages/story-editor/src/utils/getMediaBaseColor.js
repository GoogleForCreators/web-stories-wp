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
import { preloadImage } from '@web-stories-wp/media';

/**
 * Extracts the base color from an image element.
 *
 * @param {Image} img Image.
 * @return {Promise<string>} Hex color.
 */
async function extractColorFromImage(img) {
  const { default: ColorThief } = await import(
    /* webpackPrefetch: true, webpackChunkName: "chunk-colorthief" */ 'colorthief'
  );

  return new Promise((resolve, reject) => {
    try {
      const thief = new ColorThief();
      const rgb = thief.getColor(img);
      resolve(getHexFromSolidArray(rgb));
    } catch (err) {
      trackError('image_base_color', err.message);
      reject(err);
    }
  });
}

/**
 * Returns an images media base color as a hex string.
 *
 * @param {string} src Image src.
 * @param {number|string} [width] Image width.
 * @param {number|string} [height] Image height.
 * @return {Promise<string>} Hex color.
 */
async function getMediaBaseColor(src, width = 10, height = 'auto') {
  if (!src) {
    throw new Error('No source to image');
  }

  let color, image;
  const trackTiming = getTimeTracker('load_get_base_color');
  try {
    image = await preloadImage({ src, width, height });
    color = await extractColorFromImage(image);
  } catch (error) {
    // Known error of color thief with white only images.
    if (error?.name !== 'TypeError') {
      throw error;
    }
    color = '#ffffff';
  } finally {
    image?.remove();
    trackTiming();
  }
  return color;
}

export default getMediaBaseColor;
