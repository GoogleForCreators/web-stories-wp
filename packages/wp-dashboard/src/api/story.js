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
  STORY_STATUS,
} from '@web-stories-wp/dashboard';
import { createSolidFromString } from '@web-stories-wp/patterns';

/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies
 */
import { STORY_FIELDS, STORY_EMBED } from './constants';

/**
 * Fetch stories ( When dashboard link is clicked. )
 *
 * @param {Object} queryParams Query params.
 * @param {string} apiPath API path.
 * @return {Promise} Request promise.
 */
export function fetchStories(queryParams, apiPath) {
  const {
    status = STORY_STATUS.ALL,
    sortOption = STORY_SORT_OPTIONS.LAST_MODIFIED,
    sortDirection,
    searchTerm,
    page = 1,
    perPage = STORIES_PER_REQUEST,
  } = queryParams;

  // Important: Keep in sync with REST API preloading definition.
  const query = {
    _embed: STORY_EMBED,
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

/**
 * Trash stories.
 *
 * @param {number|string} storyId Story Id.
 * @param {string} apiPath API Path.
 * @return {Promise} Request promise.
 */
export function trashStory(storyId, apiPath) {
  const path = addQueryArgs(`${apiPath}${storyId}`, { _method: 'DELETE' });

  return apiFetch({
    path,
    method: 'POST',
  });
}

/**
 * Update story.
 *
 * @param {Object} story Story object.
 * @param {string} apiPath API Path.
 * @return {Promise} Request promise.
 */
export function updateStory(story, apiPath) {
  const path = addQueryArgs(`${apiPath}${story.id}/`, {
    _embed: STORY_EMBED,
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

/**
 * Create story from template
 *
 * @param {Object} template Template object.
 * @param {string} apiPath API Path.
 * @return {Promise} Request promise.
 */
export const createStoryFromTemplate = async (template, apiPath) => {
  const path = addQueryArgs(apiPath, {
    _fields: 'edit_link',
  });

  const { createdBy, pages, version, colors } = template;
  const { getStoryPropsToSave } = await import(
    /* webpackChunkName: "chunk-getStoryPropsToSave" */ '@web-stories-wp/story-editor'
  );
  const storyPropsToSave = await getStoryPropsToSave({
    story: {
      status: 'auto-draft',
      featuredMedia: {
        id: 0,
      },
    },
    pages,
    metadata: {
      publisher: createdBy,
    },
  });

  const convertedColors = colors.map(({ color }) =>
    createSolidFromString(color)
  );

  const storyData = {
    pages,
    version,
    autoAdvance: true,
    defaultPageDuration: 7,
    currentStoryStyles: {
      colors: convertedColors,
    },
  };

  return apiFetch({
    path,
    data: {
      ...storyPropsToSave,
      story_data: storyData,
    },
    method: 'POST',
  });
};

/**
 * Duplicate story.
 *
 * @param {Object} story Story object.
 * @param {string} apiPath API path.
 * @return {Promise} Request promise.
 */
export function duplicateStory(story, apiPath) {
  const {
    originalStoryData: { id },
  } = story;

  const path = addQueryArgs(apiPath, {
    _embed: STORY_EMBED,
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
