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
declare module 'libheif-js' {
  interface DecodeResult {
    img: {
      is_primary: boolean;
      thumbnails: number;
      width: number;
      height: number;
    } | null;
    get_width: () => number;
    get_height: () => number;
    is_primary: () => boolean;
    display: (
      base: ImageData,
      callback: (result: ImageData | null) => void
    ) => void;
  }

  type DecodeResultType = DecodeResult[];

  class HeifDecoder implements HeifDecoder {
    constructor();
    decode(buffer: ArrayBuffer): DecodeResultType;
  }
}
