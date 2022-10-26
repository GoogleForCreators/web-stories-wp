/*
 * Copyright 2021 Google LLC
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
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies
 */
import type { WordPressMedia } from "../types";

/**
 * Upload media
 * Used on settings page for upload button.
 *
 * @param apiPath API path.
 * @param files Uploaded files.
 * @return The added media items.
 */
export function uploadMedia(apiPath: string, files: File[]) {
  return Promise.all(
    Object.values(files).map((file) => {
      const data = new window.FormData();

      data.append('file', file, file.name || file.type.replace('/', '.'));

      return apiFetch<WordPressMedia>({
        path: apiPath,
        body: data,
        method: 'POST',
      });
    })
  );
}
