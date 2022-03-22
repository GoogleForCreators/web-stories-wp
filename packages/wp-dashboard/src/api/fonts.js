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
 * Gets custom fonts added by the user.
 * Used for "Custom Fonts" list on settings page.
 *
 * @param {string} apiPath API path.
 * @return {Promise} Request promise.
 */
export function getCustomFonts(apiPath) {
  const path = addQueryArgs(apiPath, {
    per_page: 100,
    service: 'custom',
  });

  return apiFetch({ path });
}

/**
 * Delete a font by ID.
 *
 * @param {string} apiPath API path.
 * @param {number|string} id Font Id.
 * @return {Promise} Request promise.
 */
export function deleteCustomFont(apiPath, id) {
  const path = addQueryArgs(`${apiPath}${id}/`, {
    _method: 'DELETE',
  });

  return apiFetch({
    path,
    method: 'POST',
  });
}

/**
 * Add new custom font.
 *
 * @param {string} apiPath API path.
 * @param {Object} font Font data.
 * @return {Promise} Request promise.
 */
export function addCustomFont(apiPath, font) {
  return apiFetch({
    path: apiPath,
    data: font,
    method: 'POST',
  });
}
