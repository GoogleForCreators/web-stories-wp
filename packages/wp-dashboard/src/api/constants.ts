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
import type { WP_REST_API_Post } from 'wp-types';

export const STORY_FIELDS: (keyof WP_REST_API_Post)[] = [
  'id',
  'title',
  'status',
  'date',
  'date_gmt',
  'modified',
  'modified_gmt',
  'foo',
  'story_poster',
  'link',
  'preview_link',
  'edit_link',
  '_links', // Needed for WP 6.1+
  // _web_stories_envelope will add these fields, we need them too.
  'body',
  'status',
  'headers',
];

export const SEARCH_PAGES_FIELDS: (keyof WP_REST_API_Post)[] = ['id', 'title'];
export const GET_PAGE_FIELDS: (keyof WP_REST_API_Post)[] = ['title', 'link'];

export const STORY_EMBED = 'wp:lock,wp:lockuser,author';

export const REST_LINKS = {
  EDIT: 'wp:action-edit',
  DELETE: 'wp:action-delete',
};
