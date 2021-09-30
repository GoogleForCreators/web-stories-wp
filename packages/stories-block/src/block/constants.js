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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
  EMBED_STORY_BLOCK_ICON,
  LATEST_STORIES_BLOCK_ICON,
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
    icon: LATEST_STORIES_BLOCK_ICON,
  },
  {
    id: BLOCK_TYPE_SELECTED_STORIES,
    label: __('Selected Stories', 'web-stories'),
    description: __('Manually select web stories.', 'web-stories'),
    icon: SELECTED_STORIES_BLOCK_ICON,
  },
  {
    id: BLOCK_TYPE_URL,
    label: __('Single Story', 'web-stories'),
    description: __('Embed a single story.', 'web-stories'),
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
