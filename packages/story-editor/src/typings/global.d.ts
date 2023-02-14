/*
 * Copyright 2022 Google LLC
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

import type { HeifDecoder } from 'libheif-js';

declare global {
  var WEB_STORIES_ENV: string;
}

declare global {
  interface Array<T> {
    findLastIndex(
      predicate: (value: T, index: number, obj: T[]) => unknown,
      thisArg?: unknown
    ): number;
  }

  interface Window {
    // Made available by Editor.php
    // See https://github.com/GoogleForCreators/web-stories-wp/pull/13015
    libheif: {
      HeifDecoder: typeof HeifDecoder;
    };
  }
}

export {};
