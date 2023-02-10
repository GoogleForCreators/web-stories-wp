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
import libheif, { DecodeResult } from 'libheif-js';

/**
 * Internal dependencies
 */
import type { HeicWorkerRequest } from './types';
import { isHeic } from './utils';

const worker: Worker = self as unknown as Worker;

const getDimensions = (image: DecodeResult) => {
  const width = image.get_width();
  const height = image.get_height();

  return { width, height };
};

const decodeImage = async (image: DecodeResult) => {
  const dimensions = getDimensions(image);
  const { width, height } = dimensions;

  return new Promise<ArrayBuffer>((resolve, reject) => {
    image.display(
      {
        data: new Uint8ClampedArray(width * height * 4),
        width,
        height,
        colorSpace: 'srgb',
      },
      (result: ImageData | null) => {
        if (!result) {
          reject(new Error('HEIF processing error'));
        } else {
          resolve(result.data.buffer);
        }
      }
    );
  });
};

function bufferToBlob(
  buffer: ArrayBuffer,
  width: number,
  height: number,
  type = 'image/png',
  quality = 0.82
): Promise<Blob | null> {
  if (typeof OffscreenCanvas === 'undefined') {
    return Promise.resolve(null);
  }

  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return Promise.resolve(null);
  }

  const imageData = new ImageData(new Uint8ClampedArray(buffer), width, height);

  ctx.putImageData(imageData, 0, 0);

  return canvas.convertToBlob({
    type,
    quality,
  });
}

worker.addEventListener('message', (event: MessageEvent<HeicWorkerRequest>) => {
  void (async () => {
    const { action, buffer, id } = event.data;

    if (!['convert', 'dimensions'].includes(action)) {
      return;
    }

    try {
      if (!isHeic(buffer)) {
        throw new TypeError('Not a valid HEIF image');
      }

      const decoder = new libheif.HeifDecoder();

      // Image can have multiple frames, thus it's an array.
      // For now, only decode the first frame.

      const imagesArr = decoder.decode(buffer);

      if (!imagesArr.length) {
        throw new TypeError('Not a valid HEIF image');
      }

      if ('convert' === action) {
        const { type, quality } = event.data;

        const resultBuffer = await decodeImage(imagesArr[0]);
        const dimensions = getDimensions(imagesArr[0]);

        const blob = await bufferToBlob(
          resultBuffer,
          dimensions.width,
          dimensions.height,
          type,
          quality
        );

        self.postMessage({
          action: 'success',
          id,
          dimensions,
          buffer: resultBuffer,
          blob,
        });
      }
    } catch (err) {
      if (err instanceof Error) {
        self.postMessage({
          action: 'error',
          error: err.message,
          id,
        });
      }
    }
  })();
});

export default class WebpackWorker extends Worker {
  constructor() {
    super('');
  }
}
