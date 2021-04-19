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
 * External dependencies
 */
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import getFileExtensionFromURL from './getFileExtensionFromURL';

/**
 * Helper to get remote file using fetch.
 *
 * @param {string} url URL of file.
 * @param {string} mimeType Mime type of file.
 * @return {Promise<File>} File object.
 */
async function fetchRemoteFile(url, mimeType) {
  const name = uuidv4() + '.' + getFileExtensionFromURL(url);
  const response = await fetch(url);
  const data = await response.blob();
  return new File([data], name, {
    type: mimeType,
  });
}

export default fetchRemoteFile;
