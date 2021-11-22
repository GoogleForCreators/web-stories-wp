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
 * Determine whether a URL is valid and acceptable for hotlinking.
 *
 * Validates that a URL has a valid path segment.
 *
 * @param {string} url URL to validate.
 * @return {boolean} Whether the URL is valid for hotlinking.
 */
export function isValidUrlForHotlinking(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname !== '/';
  } catch {
    return false;
  }
}
