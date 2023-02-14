/*
 * Copyright 2023 Google LLC
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
import { useCallback } from '@googleforcreators/react';
import { getTimeTracker, trackError } from '@googleforcreators/tracking';

/**
 * Internal dependencies
 */
import { bufferToBlob, decodeImage, getDimensions, isHeif } from './utils';

export default function useConvertHeif() {
  const convertHeif = useCallback(
    async (
      file: File,
      type?: 'image/jpeg' | 'image/png' | 'image/webp',
      quality?: number
    ) => {
      //eslint-disable-next-line @wordpress/no-unused-vars-before-return -- False positive because of the finally().
      const trackTiming = getTimeTracker('load_heic_conversion');

      try {
        const inputBuffer = await file.arrayBuffer();

        if (!isHeif(inputBuffer)) {
          throw new TypeError('Not a valid HEIF image');
        }

        const decoder = new window.libheif.HeifDecoder();

        // Image can have multiple frames, thus it's an array.
        // For now, only decode the first frame.

        const imagesArr = decoder.decode(inputBuffer);

        if (!imagesArr.length) {
          throw new TypeError('Not a valid HEIF image');
        }

        const resultBuffer = await decodeImage(imagesArr[0]);
        const dimensions = getDimensions(imagesArr[0]);

        let blob = await bufferToBlob(
          resultBuffer,
          dimensions.width,
          dimensions.height,
          type,
          quality
        );

        // Safari does not support WebP and falls back to PNG.
        // Use JPEG instead of PNG in that case.
        if (blob && blob.type !== type) {
          blob = await bufferToBlob(
            resultBuffer,
            dimensions.width,
            dimensions.height,
            'image/jpeg',
            quality
          );
        }

        if (!blob) {
          throw new Error('HEIF processing error');
        }

        return blob;
      } catch (err) {
        // eslint-disable-next-line no-console -- We want to surface this error.
        console.error(err);

        if (err instanceof Error) {
          void trackError('heif_conversion', err.message);
        }

        throw err;
      } finally {
        trackTiming();
      }
    },
    []
  );

  return { convertHeif };
}
