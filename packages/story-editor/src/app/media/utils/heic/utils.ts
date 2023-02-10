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
export function isHeic(buffer: ArrayBuffer) {
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
