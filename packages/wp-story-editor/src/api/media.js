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
import { MEDIA_FIELDS } from './constants';

// Important: Keep in sync with REST API preloading definition.
export function getMedia(
  config,
  { mediaType, searchTerm, pagingNum, cacheBust }
) {
  let path = addQueryArgs(config.api.media, {
    context: 'edit',
    per_page: 50,
    page: pagingNum,
    _web_stories_envelope: true,
    _fields: MEDIA_FIELDS,
  });

  if (mediaType) {
    path = addQueryArgs(path, { media_type: mediaType });
  }

  if (searchTerm) {
    path = addQueryArgs(path, { search: searchTerm });
  }

  // cacheBusting is due to the preloading logic preloading and caching
  // some requests. (see preload_paths in Dashboard.php)
  // Adding cache_bust forces the path to look different from the preloaded
  // paths and hence skipping the cache. (cache_bust itself doesn't do
  // anything)
  if (cacheBust) {
    path = addQueryArgs(path, { cache_bust: true });
  }

  return apiFetch({ path }).then(({ body: attachments, headers }) => ({
    data: attachments.map(getResourceFromAttachment),
    headers: {
      ...headers,
      totalItems: headers['X-WP-Total'],
      totalPages: headers['X-WP-TotalPages'],
    },
  }));
}

/**
 * Get media by ID.
 *
 * @param {Object} config Configuration object.
 * @param {number} mediaId Media ID.
 * @return {Promise<import('@web-stories-wp/media').Resource>} Media object promise.
 */
export function getMediaById(config, mediaId) {
  const path = addQueryArgs(`${config.api.media}${mediaId}/`, {
    context: 'edit',
    _fields: MEDIA_FIELDS,
  });

  return apiFetch({ path }).then(getResourceFromAttachment);
}

/**
 * Get the muted variant of a given media resource.
 *
 * @param {Object} config Configuration object.
 * @param {number} mediaId Media ID.
 * @return {Promise<import('@web-stories-wp/media').Resource>} Media resource if found, null otherwise.
 */
export async function getMutedMediaById(config, mediaId) {
  const path = addQueryArgs(`${config.api.media}${mediaId}/`, {
    context: 'edit',
    _fields: 'meta.web_stories_muted_id',
  });

  const result = await apiFetch({ path });

  if (result?.meta?.web_stories_muted_id) {
    return getMediaById(config, result.meta.web_stories_muted_id);
  }

  return null;
}

/**
 * Get the optimized variant of a given media resource.
 *
 * @param {Object} config Configuration object.
 * @param {number} mediaId Media ID.
 * @return {Promise<import('@web-stories-wp/media').Resource>} Media resource if found, null otherwise.
 */
export async function getOptimizedMediaById(config, mediaId) {
  const path = addQueryArgs(`${config.api.media}${mediaId}/`, {
    context: 'edit',
    _fields: 'meta.web_stories_optimized_id',
  });

  const result = await apiFetch({ path });

  if (result?.meta?.web_stories_optimized_id) {
    return getMediaById(config, result.meta.web_stories_optimized_id);
  }

  return null;
}

/**
 * Get the poster of a given media resource.
 *
 * @param {Object} config Configuration object.
 * @param {number} mediaId Media ID.
 * @return {Promise<import('@web-stories-wp/media').Resource>} Media resource if found, null otherwise.
 */
export async function getPosterMediaById(config, mediaId) {
  const path = addQueryArgs(`${config.api.media}${mediaId}/`, {
    context: 'edit',
    _fields: 'featured_media',
  });

  const result = await apiFetch({ path });

  if (result?.featured_media) {
    return getMediaById(config, result.featured_media);
  }

  return null;
}

/**
 * Upload file to via REST API.
 *
 * @param {Object} config Configuration object.
 * @param {File} file Media File to Save.
 * @param {?Object} additionalData Additional data to include in the request.
 * @return {Promise<import('@web-stories-wp/media').Resource>} Media resource.
 */
export function uploadMedia(config, file, additionalData) {
  // Create upload payload
  const data = new window.FormData();
  data.append('file', file, file.name || file.type.replace('/', '.'));
  Object.entries(additionalData).forEach(([key, value]) =>
    flattenFormData(data, key, value)
  );

  // TODO: Intercept window.fetch here to support progressive upload indicator when uploading
  return apiFetch({
    path: config.api.media,
    body: data,
    method: 'POST',
  }).then((attachment) => getResourceFromAttachment(attachment));
}

/**
 * Update Existing media.
 *
 * @param  {Object} config API path.
 * @param  {number} mediaId Media id
 * @param  {Object} data Object of properties to update on attachment.
 * @return {Promise} Media Object Promise.
 */
export function updateMedia(config, mediaId, data) {
  return apiFetch({
    path: `${config.api.media}${mediaId}/`,
    data,
    method: 'POST',
  });
}

/**
 * Delete existing media.
 *
 * @param {Object} config Configuration object.
 * @param  {number} mediaId Media id
 * @return {Promise} Media Object Promise.
 */
export function deleteMedia(config, mediaId) {
  // `apiFetch` by default turns `DELETE` requests into `POST` requests
  // with `X-HTTP-Method-Override: DELETE` headers.
  // However, some Web Application Firewall (WAF) solutions prevent this.
  // `?_method=DELETE` is an alternative solution to override the request method.
  // See https://developer.wordpress.org/rest-api/using-the-rest-api/global-parameters/#_method-or-x-http-method-override-header
  return apiFetch({
    path: addQueryArgs(`${config.api.media}${mediaId}/`, { _method: 'DELETE' }),
    data: { force: true },
    method: 'POST',
  });
}
