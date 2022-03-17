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
import {
  ORDER_BY_SORT,
  STORIES_PER_REQUEST,
  STORY_SORT_OPTIONS,
  STORY_STATUS,
} from '@googleforcreators/dashboard';
import { createSolidFromString } from '@googleforcreators/patterns';
import { snakeToCamelCaseObjectKeys } from '@web-stories-wp/wp-utils';

/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies
 */
import { STORY_FIELDS, STORY_EMBED } from './constants';
import { reshapeStoryObject } from './utils';

/**
 * Fetch stories ( When dashboard link is clicked. )
 *
 * @param {Object} config Configuration object.
 * @param {Object} queryParams Query params.
 * @return {Promise} Request promise.
 */
export function fetchStories(config, queryParams) {
  const {
    status = STORY_STATUS.ALL,
    sortOption = STORY_SORT_OPTIONS.LAST_MODIFIED,
    sortDirection,
    searchTerm,
    page = 1,
    perPage = STORIES_PER_REQUEST,
    author,
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
    author,
  };

  return apiFetch({
    path: addQueryArgs(config.api.stories, query),
  }).then(({ body: stories, headers }) => {
    const totalPages = headers && parseInt(headers['X-WP-TotalPages']);
    const totalStoriesByStatus =
      headers && JSON.parse(headers['X-WP-TotalByStatus']);

    const fetchedStoryIds = [];
    const reshapedStories = stories.reduce((acc, current) => {
      if (!current) {
        return acc;
      }
      fetchedStoryIds.push(current.id);
      acc[current.id] = reshapeStoryObject(current);
      return acc;
    }, {});

    return {
      stories: reshapedStories,
      fetchedStoryIds,
      totalPages,
      totalStoriesByStatus,
    };
  });
}

/**
 * Trash stories.
 *
 * @param {Object} config Configuration object.
 * @param {number|string} storyId Story Id.
 * @return {Promise} Request promise.
 */
export function trashStory(config, storyId) {
  const path = addQueryArgs(`${config.api.stories}${storyId}`, {
    _method: 'DELETE',
  });

  return apiFetch({
    path,
    method: 'POST',
  });
}

/**
 * Update story.
 *
 * @param {Object} config Configuration object.
 * @param {Object} story Story object.
 * @return {Promise} Request promise.
 */
export function updateStory(config, story) {
  const path = addQueryArgs(`${config.api.stories}${story.id}/`, {
    _embed: STORY_EMBED,
  });

  const data = {
    id: story.id,
    author: story.author.id,
    title: story.title?.raw || story.title,
  };

  return apiFetch({
    path,
    data,
    method: 'POST',
  }).then(reshapeStoryObject);
}

/**
 * Create story from template
 *
 * @param {Object} config Configuration object.
 * @param {Object} template Template object.
 * @return {Promise} Request promise.
 */
export const createStoryFromTemplate = async (config, template) => {
  const path = addQueryArgs(config.api.stories, {
    _fields: 'edit_link',
  });

  const { createdBy, pages, version, colors } = template;
  const { getStoryPropsToSave } = await import(
    /* webpackChunkName: "chunk-getStoryPropsToSave" */ '@googleforcreators/story-editor'
  );
  const storyPropsToSave = await getStoryPropsToSave({
    story: {
      status: 'auto-draft',
      featuredMedia: {
        id: 0,
        height: 0,
        width: 0,
        url: '',
      },
      publisherLogo: {},
      terms: {},
      title: '',
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
  }).then(snakeToCamelCaseObjectKeys);
};

/**
 * Duplicate story.
 *
 * @param {Object} config Configuration object.
 * @param {Object} story Story object.
 * @return {Promise} Request promise.
 */
export function duplicateStory(config, story) {
  const path = addQueryArgs(config.api.stories, {
    _embed: STORY_EMBED,
    _fields: STORY_FIELDS,
  });

  return apiFetch({
    path,
    data: {
      original_id: story.id,
      status: 'draft',
    },
    method: 'POST',
  }).then(reshapeStoryObject);
}
