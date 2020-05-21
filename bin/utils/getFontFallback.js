/*
 * Copyright 2020 Google LLC
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
 * Returns a valid CSS font fallback declaration for a given category.
 *
 * @param {string} category Font category as used on Google Fonts.
 * @return {string} Font fallback.
 */
function getFontFallback(category) {
  switch (category) {
    case 'handwriting':
    case 'display':
      return 'cursive';
    case 'sans-serif':
    case 'monospace':
      return category;
    default:
      return 'serif';
  }
}

export default getFontFallback;
