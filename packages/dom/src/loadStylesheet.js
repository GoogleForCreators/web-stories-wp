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

export function loadStylesheet(url, id) {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = url;
    link.crossOrigin = 'anonymous';
    link.addEventListener('load', resolve);
    link.addEventListener('error', reject);
    document.head.appendChild(link);
  });
}

/**
 * Enqueue an inline stylesheet for a given font family and URL.
 *
 * @param {string} id Element ID.
 * @param {string} css  Css to load inline
 */
export function loadInlineStylesheet(id, css) {
  if (!css) {
    return;
  }

  const style = document.createElement('style');
  style.textContent = css;
  style.id = id;
  document.head.appendChild(style);
}
