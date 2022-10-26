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
import type { Font } from '@googleforcreators/fonts';

/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies
 */
import type { WordPressFont } from '../types';

/**
 * Gets custom fonts added by the user.
 * Used for "Custom Fonts" list on settings page.
 *
 * @param apiPath API path.
 * @return Fonts
 */
export function getCustomFonts(apiPath: string) {
  const path = addQueryArgs(apiPath, {
    per_page: 100,
    service: 'custom',
  });

  return apiFetch<WordPressFont[]>({ path });
}

/**
 * Delete a font by ID.
 *
 * @param apiPath API path.
 * @param id Font Id.
 * @return Request promise.
 */
export function deleteCustomFont(apiPath: string, id: number) {
  const path = addQueryArgs(`${apiPath}${id}/`, {
    _method: 'DELETE',
  });

  return apiFetch<WordPressFont>({
    path,
    method: 'POST',
  });
}

/**
 * Add new custom font.
 *
 * @param apiPath API path.
 * @param font Font data.
 * @return Request promise.
 */
export function addCustomFont(apiPath: string, font: Font) {
  return apiFetch<WordPressFont>({
    path: apiPath,
    data: font,
    method: 'POST',
  });
}
