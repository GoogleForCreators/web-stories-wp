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
import {
  ORDER_BY_SORT,
  STORIES_PER_REQUEST,
  STORY_SORT_OPTIONS,
  STORY_STATUSES,
} from '@web-stories-wp/dashboard';

/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies
 */
import { STORY_FIELDS } from './constants';

export function fetchStories(queryParams, apiPath) {
  const {
    status = STORY_STATUSES[0].value,
    sortOption = STORY_SORT_OPTIONS.LAST_MODIFIED,
    sortDirection,
    searchTerm,
    page = 1,
    perPage = STORIES_PER_REQUEST,
  } = queryParams;

  // Important: Keep in sync with REST API preloading definition.
  const query = {
    _embed: 'wp:lock,wp:lockuser,author,wp:featuredmedia',
    context: 'edit',
    _web_stories_envelope: true,
    search: searchTerm || undefined,
    orderby: sortOption,
    page,
    per_page: perPage,
    order: sortDirection || ORDER_BY_SORT[sortOption],
    status,
    _fields: STORY_FIELDS,
  };

  return apiFetch({
    path: addQueryArgs(apiPath, query),
  }).then(({ body, headers }) => ({
    body,
    headers: {
      totalPages: headers['X-WP-TotalPages'],
      totalByStatus: headers['X-WP-TotalByStatus'],
    },
  }));
}

export function trashStory(storyId, apiPath) {
  const path = addQueryArgs(`${apiPath}${storyId}`, { _method: 'DELETE' });

  return apiFetch({
    path,
    method: 'POST',
  });
}

export function updateStory(story, apiPath) {
  const path = addQueryArgs(`${apiPath}${story.id}/`, {
    _embed: 'wp:lock,wp:lockuser,author,wp:featuredmedia',
  });

  const data = {
    id: story.id,
    author: story.originalStoryData.author,
    title: story.title?.raw || story.title,
  };

  return apiFetch({
    path,
    data,
    method: 'POST',
  });
}

export function createStoryFromTemplate(storyData, storyPropsToSave, apiPath) {
  const path = addQueryArgs(apiPath, {
    _fields: 'edit_link',
  });

  return apiFetch({
    path,
    data: {
      ...storyPropsToSave,
      story_data: storyData,
    },
    method: 'POST',
  });
}

export function duplicateStory(story, apiPath) {
  const {
    originalStoryData: { id },
  } = story;

  const path = addQueryArgs(apiPath, {
    _embed: 'wp:lock,wp:lockuser,author,wp:featuredmedia',
    _fields: STORY_FIELDS,
  });

  return apiFetch({
    path,
    data: {
      original_id: id,
      status: 'draft',
    },
    method: 'POST',
  });
}
