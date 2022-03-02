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

const TEMPLATE_FIELDS = [
  'id',
  'story_data',
  // _web_stories_envelope will add these fields, we need them too.
  'body',
  'headers',
];

const TEMPLATE_EMBED = 'wp:featuredmedia';

function transformResponse(template) {
  const { _embedded: embedded = {}, id: templateId, story_data } = template;
  const image = {
    id: embedded?.['wp:featuredmedia']?.[0].id || 0,
    height: embedded?.['wp:featuredmedia']?.[0]?.media_details?.height || 0,
    width: embedded?.['wp:featuredmedia']?.[0]?.media_details?.width || 0,
    url: embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
  };

  return { ...story_data, templateId, image };
}

export function getCustomPageTemplates(config, page = 1) {
  const perPage = 100;
  const path = addQueryArgs(config.api.pageTemplates, {
    context: 'edit',
    per_page: perPage,
    page,
    _web_stories_envelope: true,
    _fields: TEMPLATE_FIELDS,
    _embed: TEMPLATE_EMBED,
  });
  return apiFetch({ path }).then(({ headers, body }) => {
    const totalPages = parseInt(headers['X-WP-TotalPages']);
    const templates = body.map(transformResponse);
    return {
      templates,
      hasMore: totalPages > page,
    };
  });
}

/**
 * Add a new page template.
 *
 * @param {Object} config Config object.
 * @param {Object} data Page template data.
 * @return {Promise<*>} Saved page template.
 */
export function addPageTemplate(config, data) {
  return apiFetch({
    path: `${config.api.pageTemplates}/`,
    data: {
      ...data,
      status: 'publish',
    },
    method: 'POST',
  }).then(transformResponse);
}

/**
 * Update an existing page template.
 *
 * @param {Object} config Config object.
 * @param {number} id Page template ID.
 * @param {Object} data Page template data.
 * @return {Promise<*>} Saved page template.
 */
export function updatePageTemplate(config, id, data) {
  return apiFetch({
    path: `${config.api.pageTemplates}${id}/`,
    data: {
      ...data,
    },
    method: 'POST',
  }).then(transformResponse);
}

export function deletePageTemplate(config, id) {
  // `?_method=DELETE` is an alternative solution to override the request method.
  // See https://developer.wordpress.org/rest-api/using-the-rest-api/global-parameters/#_method-or-x-http-method-override-header
  return apiFetch({
    path: addQueryArgs(`${config.api.pageTemplates}${id}/`, {
      _method: 'DELETE',
    }),
    data: { force: true },
    method: 'POST',
  }); // Response is not being used in core editor.
}
