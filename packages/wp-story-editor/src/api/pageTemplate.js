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

export function getCustomPageTemplates(config, page = 1) {
  const perPage = 100;
  const path = addQueryArgs(config.api.pageTemplates, {
    context: 'edit',
    per_page: perPage,
    page,
    _web_stories_envelope: true,
  });
  return apiFetch({ path }).then(({ headers, body }) => {
    const totalPages = parseInt(headers['X-WP-TotalPages']);
    const templates = body.map((template) => {
      return { ...template['story_data'], templateId: template.id };
    });
    return {
      templates,
      hasMore: totalPages > page,
    };
  });
}

export function addPageTemplate(config, page) {
  return apiFetch({
    path: `${config.api.pageTemplates}/`,
    data: {
      story_data: page,
      status: 'publish',
    },
    method: 'POST',
  }).then((response) => {
    return { ...response['story_data'], templateId: response.id };
  });
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
  });
}
