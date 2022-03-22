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
 * External dependencies
 */
import { addQueryArgs } from '@googleforcreators/url';

/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

/**
 * Assembles the `&include` query parameter.
 *
 * Works around a bug in WordPress.
 *
 * @see https://github.com/GoogleForCreators/web-stories-wp/issues/10710
 * @param {string} include Comma-separated list of fonts to include.
 * @return {string} include query parameter with bracket notation.
 */
function getIncludeQueryArgs(include = '') {
  return include
    .split(',')
    .filter(Boolean)
    .map((item) => `include[]=${encodeURI(item)}`)
    .join('&');
}

export function getFonts(config, { include: _include, search, service }) {
  let path = addQueryArgs(`${config.api.fonts}`, {
    search,
    service,
  });
  const include = getIncludeQueryArgs(_include);
  if (include.length > 0) {
    path += path.includes('?') ? `&${include}` : `?${include}`;
  }
  return apiFetch({
    path,
  });
}
