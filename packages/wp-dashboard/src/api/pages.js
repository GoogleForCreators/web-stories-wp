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
import { addQueryArgs } from '@web-stories-wp/design-system';
/**
 * Internal dependencies
 */
import { default as dataAdapter } from './utils/wpAdapter';

/**
 * Search pages by search term.
 * Used for "Stories Archive" custom page selection on settings page.
 *
 * @param {string} searchTerm Search term.
 * @param {string} apiPath API path.
 * @return {Promise}
 */
export function searchPages(searchTerm, apiPath) {
  return dataAdapter.get(
    addQueryArgs(apiPath, {
      per_page: 100,
      search: searchTerm,
      _fields: ['id', 'title'],
    })
  );
}

/**
 * Get page by id.
 * Used for getting the custom page by id after selection is saved on settings page
 *
 * @param {int} id page id.
 * @param {string} apiPath API Path.
 * @return {Promise}
 */
export function getPageById(id, apiPath) {
  return dataAdapter.get(
    addQueryArgs(`${apiPath}${id}/`, {
      _fields: ['title', 'link'],
    })
  );
}
