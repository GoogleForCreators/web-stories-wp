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
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies
 */
import { flattenFormData, getResourceFromAttachment } from './utils';
import { MEDIA_FIELD } from './constants';

// Important: Keep in sync with REST API preloading definition.
export function getMedia(
  { mediaType, searchTerm, pagingNum, cacheBust },
  media
) {
  let apiPath = addQueryArgs(media, {
    context: 'edit',
    per_page: 10,
    page: pagingNum,
    _web_stories_envelope: true,
    _fields: MEDIA_FIELD,
  });

  if (mediaType) {
    apiPath = addQueryArgs(apiPath, { media_type: mediaType });
  }

  if (searchTerm) {
    apiPath = addQueryArgs(apiPath, { search: searchTerm });
  }

  // cacheBusting is due to the preloading logic preloading and caching
  // some requests. (see preload_paths in Dashboard.php)
  // Adding cache_bust forces the path to look different from the preloaded
  // paths and hence skipping the cache. (cache_bust itself doesn't do
  // anything)
  if (cacheBust) {
    apiPath = addQueryArgs(apiPath, { cache_bust: true });
  }

  return apiFetch({ path: apiPath }).then(({ body: attachments, headers }) => ({
    data: attachments.map(getResourceFromAttachment),
    headers: {
      ...headers,
      totalItems: headers['X-WP-Total'],
      totalPages: headers['X-WP-TotalPages'],
    },
  }));
}

/**
 * Upload file to via REST API.
 *
 * @param {File}    file           Media File to Save.
 * @param {?Object} additionalData Additional data to include in the request.
 * @param {Object}  media          Media object
 * @return {Promise} Media Object Promise.
 */
export function uploadMedia(file, additionalData, media) {
  // Create upload payload
  const data = new window.FormData();
  data.append('file', file, file.name || file.type.replace('/', '.'));
  Object.entries(additionalData).forEach(([key, value]) =>
    flattenFormData(data, key, value)
  );

  // TODO: Intercept window.fetch here to support progressive upload indicator when uploading
  return apiFetch({
    path: media,
    body: data,
    method: 'POST',
  }).then((attachment) => getResourceFromAttachment(attachment));
}
/**
 * Update Existing media.
 *
 * @param  {number} mediaId Media id
 * @param  {Object} data Object of properties to update on attachment.
 * @param  {Object} media Media object
 * @return {Promise} Media Object Promise.
 */
export function updateMedia(mediaId, data, media) {
  return apiFetch({
    path: `${media}${mediaId}/`,
    data,
    method: 'POST',
  });
}

/**
 * Delete existing media.
 *
 * @param  {number} mediaId Media id
 * @param  {Object} media Media object
 * @return {Promise} Media Object Promise.
 */
export function deleteMedia(mediaId, media) {
  // `apiFetch` by default turns `DELETE` requests into `POST` requests
  // with `X-HTTP-Method-Override: DELETE` headers.
  // However, some Web Application Firewall (WAF) solutions prevent this.
  // `?_method=DELETE` is an alternative solution to override the request method.
  // See https://developer.wordpress.org/rest-api/using-the-rest-api/global-parameters/#_method-or-x-http-method-override-header
  return apiFetch({
    path: addQueryArgs(`${media}${mediaId}/`, { _method: 'DELETE' }),
    data: { force: true },
    method: 'POST',
  });
}
