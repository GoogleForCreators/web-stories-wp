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
 * External dependencies
 */
import { join } from 'path';

/**
 * Internal dependencies
 */
import { WP_BASE_URL } from './config';

/**
 * Creates new URL by parsing base URL, path and query string.
 *
 * @param {string}  path String to be serialized as pathname.
 * @param {?string} query  String to be serialized as query portion of URL.
 * @return {string} String which represents full URL.
 */
function createURL(path, query = '') {
  const url = new URL(WP_BASE_URL);

  url.pathname = join(url.pathname, path);
  url.search = query;

  return url.href;
}

export default createURL;
