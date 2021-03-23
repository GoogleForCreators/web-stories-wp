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
 * Blob cache.
 *
 * @type {Object.<string, File>}
 */
const blobCache = {};

/**
 * Create a blob URL from a file.
 *
 * @param {File|Blob|MediaSource} file File object.
 * @return {string} Blob URL.
 */
export function createBlob(file) {
  const url = window.URL.createObjectURL(file);

  blobCache[url] = file;

  return url;
}

/**
 * Get file by blob URL if it exists.
 *
 * @param {string} url Blob URL.
 * @return {?File} File if exists.
 */
export function getBlob(url) {
  return blobCache[url];
}

/**
 * Remove blob from cache (and browser memory).
 *
 * @param {string} url Blob URL.
 * @return {void}
 */
export function revokeBlob(url) {
  if (getBlob(url)) {
    window.URL.revokeObjectURL(url);
  }

  delete blobCache[url];
}
