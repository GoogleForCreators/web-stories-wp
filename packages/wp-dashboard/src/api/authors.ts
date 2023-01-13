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
import type { Author } from '@googleforcreators/dashboard';

/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies
 */
import type { WPDashboardConfig, WordPressUser } from '../types';

export function getAuthors(
  config: WPDashboardConfig,
  search: string
): Promise<Author[]> {
  return apiFetch<WordPressUser[]>({
    path: addQueryArgs(config.api.users, {
      per_page: '100',
      capabilities: config.editPostsCapabilityName,
      search,
    }),
  }).then((response: WordPressUser[]) =>
    response.map(({ id, name }) => ({ id, name }))
  );
}
