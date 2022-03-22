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
 * Internal dependencies
 */
import { SEARCH_PAGES_FIELDS, GET_PAGE_FIELDS } from './constants';

/**
 * Search pages by search term.
 * Used for "Stories Archive" custom page selection on settings page.
 *
 * @param {string} apiPath API path.
 * @param {string} searchTerm Search term.
 * @return {Promise} Request promise.
 */
export function searchPages(apiPath, searchTerm) {
  const path = addQueryArgs(apiPath, {
    per_page: 100,
    search: searchTerm,
    _fields: SEARCH_PAGES_FIELDS,
  });

  return apiFetch({ path });
}

/**
 * Get page by id.
 * Used for getting the custom page by id after selection is saved on settings page
 *
 * @param {string} apiPath API path.
 * @param {number} id page id.
 * @return {Promise} Request promise.
 */
export function getPageById(apiPath, id) {
  const path = addQueryArgs(`${apiPath}${id}/`, {
    _fields: GET_PAGE_FIELDS,
  });

  return apiFetch({ path });
}
