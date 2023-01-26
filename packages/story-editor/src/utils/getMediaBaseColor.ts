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
import { getTimeTracker, trackError } from '@googleforcreators/tracking';
import { getHexFromSolidArray } from '@googleforcreators/patterns';
import { preloadImage } from '@googleforcreators/media';

/**
 * Extracts the base color from an image element.
 *
 * @param img Image.
 * @return Hex color.
 */
async function extractColorFromImage(img: HTMLImageElement): Promise<string> {
  const { default: ColorThief } = await import(
    /* webpackChunkName: "chunk-colorthief" */ '@pioug/colorthief'
  );

  return new Promise((resolve, reject) => {
    try {
      const thief = new ColorThief();
      const rgb = thief.getColor(img);
      resolve(getHexFromSolidArray(rgb));
    } catch (err) {
      if (err instanceof Error) {
        void trackError('image_base_color', err.message);
      }
      reject(err);
    }
  });
}

/**
 * Returns an images media base color as a hex string.
 *
 * @param src Image src.
 * @param [width] Image width.
 * @param [height] Image height.
 * @return Hex color.
 */
async function getMediaBaseColor(src: string, width = 10, height = 'auto') {
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
    if (!(error instanceof TypeError)) {
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
