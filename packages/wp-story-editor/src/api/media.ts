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
import type { Config } from '../types';
import { flattenFormData, getResourceFromAttachment } from './utils';
import { MEDIA_FIELDS } from './constants';

// Important: Keep in sync with REST API preloading definition.
export function getMedia(
  config: Config,
  { mediaType, searchTerm, pagingNum }
) {
  let path = addQueryArgs(config.api.media, {
    context: 'view',
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

  return apiFetch({ path }).then(({ body: attachments, headers }) => ({
    data: attachments.map(getResourceFromAttachment),
    headers: {
      ...headers,
      totalItems: headers['X-WP-Total'],
      totalPages: headers['X-WP-TotalPages'],
    },
  }));
}

// Important: Keep in sync with REST API preloading definition.
export function getMediaForCorsCheck(config: Config) {
  const path = addQueryArgs(config.api.media, {
    context: 'view',
    per_page: 10,
    _fields: 'source_url',
  });

  return apiFetch({ path }).then((attachments) =>
    attachments.map((attachment) => attachment.source_url)
  );
}

/**
 * Get media by ID.
 *
 * @param config Configuration object.
 * @param mediaId Media ID.
 * @return Media object promise.
 */
export function getMediaById(config: Config, mediaId: string) {
  const path = addQueryArgs(`${config.api.media}${mediaId}/`, {
    context: 'view',
    _fields: MEDIA_FIELDS,
  });

  return apiFetch({ path }).then(getResourceFromAttachment);
}

/**
 * Get the muted variant of a given media resource.
 *
 * @param config Configuration object.
 * @param mediaId Media ID.
 * @return Media resource if found, null otherwise.
 */
export async function getMutedMediaById(config: Config, mediaId: string) {
  const path = addQueryArgs(`${config.api.media}${mediaId}/`, {
    context: 'view',
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
 * @param config Configuration object.
 * @param mediaId Media ID.
 * @return Media resource if found, null otherwise.
 */
export async function getOptimizedMediaById(config: Config, mediaId: string) {
  const path = addQueryArgs(`${config.api.media}${mediaId}/`, {
    context: 'view',
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
 * @param config Configuration object.
 * @param mediaId Media ID.
 * @return Media resource if found, null otherwise.
 */
export async function getPosterMediaById(config: Config, mediaId: string) {
  const path = addQueryArgs(`${config.api.media}${mediaId}/`, {
    context: 'view',
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
 * @param config Configuration object.
 * @param file Media File to Save.
 * @param additionalData Additional data to include in the request.
 * @return Media resource.
 */
export function uploadMedia(config: Config, file, additionalData) {
  const {
    originalId,
    mediaId,
    storyId,
    templateId,
    optimizedId,
    cropOriginId,
    mutedId,
    posterId,
    isMuted,
    mediaSource,
    trimData,
    baseColor,
    blurHash,
    isGif,
    altText,
  } = additionalData;

  const wpKeysMapping = {
    web_stories_media_source: mediaSource,
    web_stories_is_muted: isMuted,
    post: templateId || storyId || mediaId,
    original_id: originalId,
    meta: {
      web_stories_base_color: baseColor,
      web_stories_blurhash: blurHash,
      web_stories_cropped_origin_id: cropOriginId,
      web_stories_optimized_id: optimizedId,
      web_stories_muted_id: mutedId,
      web_stories_poster_id: posterId,
      web_stories_trim_data: trimData,
      web_stories_is_gif: isGif,
    },
    alt_text: altText,
  };

  Object.entries(wpKeysMapping.meta).forEach(([key, value]) => {
    if (value === undefined) {
      delete wpKeysMapping.meta[key];
    }
  });

  Object.entries(wpKeysMapping).forEach(([key, value]) => {
    if (value === undefined) {
      delete wpKeysMapping[key];
    }
  });

  // Create upload payload
  const data = new window.FormData();
  data.append('file', file, file.name || file.type.replace('/', '.'));
  Object.entries(wpKeysMapping).forEach(([key, value]) =>
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
 * @param config API path.
 * @param mediaId Media id
 * @param data Object of properties to update on attachment.
 * @return Media Object Promise.
 */
export function updateMedia(config: Config, mediaId: string, data) {
  const {
    baseColor,
    blurHash,
    isMuted,
    mediaSource,
    optimizedId,
    cropOriginId,
    mutedId,
    posterId,
    storyId,
    altText,
  } = data;

  const wpKeysMapping = {
    meta: {
      web_stories_base_color: baseColor,
      web_stories_blurhash: blurHash,
      web_stories_optimized_id: optimizedId,
      web_stories_muted_id: mutedId,
      web_stories_cropped_origin_id: cropOriginId,
      web_stories_poster_id: posterId,
    },
    web_stories_is_muted: isMuted,
    web_stories_media_source: mediaSource,
    featured_media: posterId,
    post: storyId,
    alt_text: altText,
  };

  Object.entries(wpKeysMapping.meta).forEach(([key, value]) => {
    if (value === undefined) {
      delete wpKeysMapping.meta[key];
    }
  });

  Object.entries(wpKeysMapping).forEach(([key, value]) => {
    if (value === undefined) {
      delete wpKeysMapping[key];
    }
  });
  return apiFetch({
    path: `${config.api.media}${mediaId}/`,
    data: wpKeysMapping,
    method: 'POST',
  }).then(getResourceFromAttachment);
}

/**
 * Delete existing media.
 *
 * @param config Configuration object.
 * @param mediaId Media id
 * @return
 */
export function deleteMedia(config: Config, mediaId: string) {
  // `apiFetch` by default turns `DELETE` requests into `POST` requests
  // with `X-HTTP-Method-Override: DELETE` headers.
  // However, some Web Application Firewall (WAF) solutions prevent this.
  // `?_method=DELETE` is an alternative solution to override the request method.
  // See https://developer.wordpress.org/rest-api/using-the-rest-api/global-parameters/#_method-or-x-http-method-override-header
  void apiFetch({
    path: addQueryArgs(`${config.api.media}${mediaId}/`, { _method: 'DELETE' }),
    data: { force: true },
    method: 'POST',
  });
}
