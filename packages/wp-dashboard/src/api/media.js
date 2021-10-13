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
 * Upload media
 * Used on settings page for upload button.
 *
 * @param {Object} config Configuration object.
 * @param {Object} files Uploaded files.
 * @return {Promise} Request promise.
 */
export function uploadMedia(config, files) {
  return Promise.all(
    Object.values(files).map((file) => {
      const data = new window.FormData();

      data.append('file', file, file.name || file.type.replace('/', '.'));

      return apiFetch({
        path: config.api.media,
        body: data,
        method: 'POST',
      });
    })
  );
}
