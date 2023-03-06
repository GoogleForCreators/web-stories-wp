/*
 * Copyright 2023 Google LLC
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
import createURL from './createURL.js';

/**
 * Checks if current URL is a WordPress path.
 *
 * @param {string}  path  String to be serialized as pathname.
 * @param {?string} query String to be serialized as query portion of URL.
 * @return {boolean} Boolean represents whether current URL is or not a WordPress path.
 */
function isCurrentURL(path, query = '') {
  const currentURL = new URL(page.url());

  currentURL.search = query;

  return createURL(path, query) === currentURL.href;
}

export default isCurrentURL;
