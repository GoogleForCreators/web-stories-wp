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
import type { PublisherLogo } from '../types';

/**
 * Fetch publisher logos.
 * Used for "Publisher Logo" field under editor settings page
 *
 * @param apiPath API path.
 * @return Request promise.
 */
export function fetchPublisherLogos(apiPath: string) {
  return apiFetch<PublisherLogo[]>({ path: apiPath });
}

/**
 * Remove publisher logo.
 *
 * @param apiPath API path.
 * @param logoId Logo id.
 * @return The deleted publisher logo.
 */
export function removePublisherLogo(apiPath: string, logoId: number) {
  const path = addQueryArgs(`${apiPath}${logoId}/`, {
    _method: 'DELETE',
  });

  return apiFetch<PublisherLogo>({
    path,
    method: 'POST',
  });
}

/**
 * Add publisher logo.
 *
 * @param apiPath API path.
 * @param logoId Single logo ID or array of logo IDs.
 * @return The added publisher logo.
 */
export function addPublisherLogo(apiPath: string, logoId: number) {
  return apiFetch<PublisherLogo>({
    path: apiPath,
    data: {
      id: logoId,
    },
    method: 'POST',
  });
}

/**
 * Set publisher logo as default.
 *
 * @param apiPath API path.
 * @param logoId Logo id.
 * @return The updated publisher logo.
 */
export function setPublisherLogoAsDefault(apiPath: string, logoId: number) {
  return apiFetch<PublisherLogo>({
    path: `${apiPath}${logoId}/`,
    data: {
      active: true,
    },
    method: 'POST',
  });
}
