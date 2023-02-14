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
import type { DecodeResult } from 'libheif-js';
import { getCanvasBlob } from '@googleforcreators/media';

export function isHeif(buffer: ArrayBuffer) {
  const fourCC = String.fromCharCode(
    ...Array.from(new Uint8Array(buffer.slice(8, 12)))
  );

  const validFourCC = [
    'mif1', // .heic / image/heif
    'msf1', // .heic / image/heif-sequence
    'heic', // .heic / image/heic
    'heix', // .heic / image/heic
    'hevc', // .heic / image/heic-sequence
    'hevx', // .heic / image/heic-sequence
  ];

  return validFourCC.includes(fourCC);
}

export function getDimensions(image: DecodeResult) {
  const width = image.get_width();
  const height = image.get_height();

  return { width, height };
}

export async function decodeImage(image: DecodeResult) {
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
}

export async function bufferToBlob(
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
