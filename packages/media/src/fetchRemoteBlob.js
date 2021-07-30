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
 * Helper to get remote file using fetch and return blob.
 *
 * @param {string} url URL of file.
 * @return {Promise<Blob>} Blob object.
 */
async function fetchRemoteBlob(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`An error has occured: ${response.status}`);
  }
  const data = await response.blob();

  return data;
}

export default fetchRemoteBlob;
