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
import { getCanvasBlob } from '@googleforcreators/media';
import { useCallback } from '@googleforcreators/react';
import { getTimeTracker, trackError } from '@googleforcreators/tracking';

/**
 * Internal dependencies
 */
import type { QueueItemId } from '../../uploadQueue/types';

import HeicWorker from './heic.worker';
import type { HeicWorkerResponse } from './types';

async function bufferToBlob(
  buffer: ArrayBuffer,
  width: number,
  height: number,
  type = 'image/webp',
  quality = 0.82
) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get context');
  }

  const imageData = new ImageData(new Uint8ClampedArray(buffer), width, height);

  ctx.putImageData(imageData, 0, 0);

  return getCanvasBlob(canvas, type, quality);
}

const worker = new HeicWorker();

export default function useConvertHeic() {
  const convertHeic = useCallback(
    async (
      id: QueueItemId,
      file: File,
      type?: 'image/jpeg' | 'image/png' | 'image/webp',
      quality?: number
    ) => {
      const trackTiming = getTimeTracker('load_heic_conversion');

      const inputBuffer = await file.arrayBuffer();

      return new Promise<Blob>((resolve, reject) => {
        worker.addEventListener(
          'message',
          ({ data }: MessageEvent<HeicWorkerResponse>) => {
            void (async () => {
              const { action, id: itemId } = data;
              trackTiming();

              if (itemId !== id) {
                return;
              }

              switch (action) {
                case 'success':
                  if (data.blob) {
                    resolve(data.blob);
                  } else {
                    let fallbackBlob = await bufferToBlob(
                      data.buffer,
                      data.dimensions.width,
                      data.dimensions.height,
                      type,
                      quality
                    );

                    // Safari does not support WebP and falls back to PNG.
                    // Use JPEG instead of PNG in that case.
                    if (fallbackBlob && fallbackBlob.type !== type) {
                      fallbackBlob = await bufferToBlob(
                        data.buffer,
                        data.dimensions.width,
                        data.dimensions.height,
                        'image/jpeg',
                        quality
                      );
                    }

                    if (fallbackBlob) {
                      resolve(fallbackBlob);
                    } else {
                      reject(new Error('Unknown error'));
                    }
                  }
                  break;
                case 'error':
                  void trackError('heic_conversion', data.error);
                  reject(new Error(data.error));
                  break;
                default:
                  reject(new Error('Unknown error'));
              }
            })();
          }
        );

        worker.postMessage({
          action: 'convert',
          id,
          buffer: inputBuffer,
          type,
          quality,
        });

        worker.addEventListener('error', (e: ErrorEvent) => {
          trackTiming();
          void trackError('heic_conversion', e?.message);
          reject(e);
        });
      });
    },
    []
  );

  return { convertHeic };
}
