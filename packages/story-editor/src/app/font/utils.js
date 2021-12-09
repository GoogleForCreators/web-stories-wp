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
import getFontCSS from '../../utils/getFontCSS';

/**
 * This is a utility ensure that Promise.all return ONLY when all promises are processed.
 *
 * @param {Promise} promise Promise to be processed
 * @return {Promise} Return a rejected or fulfilled Promise
 */
export const reflect = (promise) => {
  return promise.then(
    (v) => ({ v, status: 'fulfilled' }),
    (e) => ({ e, status: 'rejected' })
  );
};

export function loadInlineStylesheet(id, src, name) {
  const css = getFontCSS(name, src);

  if (!css) {
    return;
  }

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
}

export function ensureFontLoaded(fontFaceSet, content) {
  if (!document?.fonts) {
    return Promise.resolve();
  }

  return document.fonts
    .load(fontFaceSet, content || '')
    .then(() => document.fonts.check(fontFaceSet, content || ''));
}
