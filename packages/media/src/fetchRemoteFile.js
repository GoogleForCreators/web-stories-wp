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
 * Internal dependencies
 */
import getFileNameFromUrl from './getFileNameFromUrl';

function generateFileName(url) {
  const currentFileName = getFileNameFromUrl(url);
  const currentFileExt = currentFileName
    .split(/[#?]/)[0]
    .split('.')
    .pop()
    .trim();

  return currentFileName.replace(
    `.${currentFileExt}`,
    `-optimized.${currentFileExt}`
  );
}

/**
 * Helper to get remote file using fetch.
 *
 * @param {string} url URL of file.
 * @param {string} mimeType Mime type of file.
 * @return {Promise<File>} File object.
 */
async function fetchRemoteFile(url, mimeType) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`An error has occured: ${response.status}`);
  }
  const data = await response.blob();
  const name = generateFileName(url);
  return new File([data], name, {
    type: mimeType,
  });
}

export default fetchRemoteFile;
