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

/**
 * Check whether a font has been loaded already.
 *
 * See https://developer.mozilla.org/en-US/docs/Web/API/FontFaceSet/check
 *
 * @param {string} fontFaceSet A font specification using the CSS value syntax, for example "italic bold 16px Roboto"
 * @param {string} content Limit the font faces to those whose Unicode range contains at least one of the characters in text.
 * @return {Promise<boolean>} True if the font is loaded.
 */
export default function ensureFontLoaded(fontFaceSet, content) {
  if (!document?.fonts) {
    return Promise.resolve(true);
  }

  return document.fonts
    .load(fontFaceSet, content || '')
    .then(() => document.fonts.check(fontFaceSet, content || ''));
}
