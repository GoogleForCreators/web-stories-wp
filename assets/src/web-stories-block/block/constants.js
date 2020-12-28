/*
 * Copyright 2020 Google LLC
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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
  EMBED_STORY_BLOCK_ICON,
  LATESTS_STORIES_BLOCK_ICON,
  CAROUSEL_VIEW_TYPE_ICON,
  SELECTED_STORIES_BLOCK_ICON,
  CIRCLES_VIEW_TYPE_ICON,
  LIST_VIEW_TYPE_ICON,
  GRID_VIEW_TYPE_ICON,
  BOX_CAROUSEL_CONFIG_ICON,
  LIST_VIEW_CONFIG_ICON,
  CIRCLE_CAROUSEL_CONFIG_ICON,
  GRID_VIEW_CONFIG_ICON,
} from './icons';

/**
 * Block types
 */
export const BLOCK_TYPE_LATEST_STORIES = 'latest-stories';
export const BLOCK_TYPE_SELECTED_STORIES = 'selected-stories';
export const BLOCK_TYPE_URL = 'url';
export const BLOCK_TYPES = [
  {
    id: BLOCK_TYPE_LATEST_STORIES,
    label: __('Latest Stories', 'web-stories'),
    description: __('Embed latest web stories.', 'web-stories'),
    icon: LATESTS_STORIES_BLOCK_ICON,
  },
  {
    id: BLOCK_TYPE_SELECTED_STORIES,
    label: __('Selected Stories', 'web-stories'),
    description: __('Manually select web stories.', 'web-stories'),
    icon: SELECTED_STORIES_BLOCK_ICON,
  },
  {
    id: BLOCK_TYPE_URL,
    label: __('Story URL', 'web-stories'),
    description: __('Embed a visual story.', 'web-stories'),
    icon: EMBED_STORY_BLOCK_ICON,
  },
];

/**
 * Block controls icons.
 */
export const GRID_VIEW_TYPE = 'grid';
export const LIST_VIEW_TYPE = 'list';
export const CIRCLES_VIEW_TYPE = 'circles';
export const CAROUSEL_VIEW_TYPE = 'carousel';

export const VIEW_TYPES = [
  {
    id: CAROUSEL_VIEW_TYPE,
    label: __('Box Carousel', 'web-stories'),
    icon: CAROUSEL_VIEW_TYPE_ICON,
    panelIcon: BOX_CAROUSEL_CONFIG_ICON,
  },
  {
    id: CIRCLES_VIEW_TYPE,
    label: __('Circle Carousel', 'web-stories'),
    icon: CIRCLES_VIEW_TYPE_ICON,
    panelIcon: CIRCLE_CAROUSEL_CONFIG_ICON,
  },
  {
    id: GRID_VIEW_TYPE,
    label: __('Grid', 'web-stories'),
    icon: GRID_VIEW_TYPE_ICON,
    panelIcon: GRID_VIEW_CONFIG_ICON,
  },
  {
    id: LIST_VIEW_TYPE,
    label: __('List', 'web-stories'),
    icon: LIST_VIEW_TYPE_ICON,
    panelIcon: LIST_VIEW_CONFIG_ICON,
  },
];

/**
 * Stories 'order-by' values.
 */
export const ORDER_BY_OPTIONS = {
  'new-to-old': {
    label: __('Newest to oldest', 'web-stories'),
    order: 'desc',
    orderBy: 'date',
  },
  'old-to-new': {
    label: __('Oldest to newest', 'web-stories'),
    order: 'asc',
    orderBy: 'date',
  },
  alphabetical: {
    label: __('A -> Z', 'web-stories'),
    order: 'asc',
    orderBy: 'title',
  },
  'reverse-alphabetical': {
    label: __('Z -> A', 'web-stories'),
    order: 'desc',
    orderBy: 'title',
  },
};

/**
 * Debounce duration constants.
 */
export const FETCH_AUTHORS_DEBOUNCE = 500;
export const FETCH_STORIES_DEBOUNCE = 1000;

/**
 * Story picker.
 */
export const VIEW_STYLE = {
  GRID: 'grid',
  LIST: 'list',
};

export const STORIES_PER_REQUEST = 24;

export const SORT_DIRECTION = {
  ASC: 'asc',
  DESC: 'desc',
};

export const STORY_SORT_OPTIONS = {
  NAME: 'title',
  DATE_CREATED: 'date',
  LAST_MODIFIED: 'modified',
  CREATED_BY: 'story_author',
};

export const ORDER_BY_SORT = {
  [STORY_SORT_OPTIONS.NAME]: SORT_DIRECTION.ASC,
  [STORY_SORT_OPTIONS.DATE_CREATED]: SORT_DIRECTION.DESC,
  [STORY_SORT_OPTIONS.LAST_MODIFIED]: SORT_DIRECTION.DESC,
  [STORY_SORT_OPTIONS.CREATED_BY]: SORT_DIRECTION.ASC,
};

export const STORY_STATUS = {
  ALL: 'publish,draft,future,private',
  PUBLISHED_AND_FUTURE: 'publish,future',
  DRAFT: 'draft',
  FUTURE: 'future',
  PUBLISH: 'publish',
  PRIVATE: 'private',
};

export const STORY_STATUSES = [
  {
    label: __('All Stories', 'web-stories'),
    value: STORY_STATUS.ALL,
    status: 'all',
  },
  {
    label: __('Drafts', 'web-stories'),
    value: STORY_STATUS.DRAFT,
    status: STORY_STATUS.DRAFT,
  },
  {
    label: __('Published', 'web-stories'),
    value: STORY_STATUS.PUBLISHED_AND_FUTURE,
    status: STORY_STATUS.PUBLISHED_AND_FUTURE,
  },
  {
    label: __('Private', 'web-stories'),
    value: STORY_STATUS.PRIVATE,
    status: STORY_STATUS.PRIVATE,
  },
];
