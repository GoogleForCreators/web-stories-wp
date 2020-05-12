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

export const STORY_CONTEXT_MENU_ACTIONS = {
  OPEN_IN_EDITOR: 'open-in-editor-action',
  PREVIEW: 'preview-action',
  RENAME: 'rename-action',
  DUPLICATE: 'duplicate-action',
  CREATE_TEMPLATE: 'create-template-action',
  DELETE: 'delete-story-action',
};

export const STORY_CONTEXT_MENU_ITEMS = [
  {
    label: __('Open in editor', 'web-stories'),
    value: STORY_CONTEXT_MENU_ACTIONS.OPEN_IN_EDITOR,
  },
  {
    label: __('Preview', 'web-stories'),
    value: STORY_CONTEXT_MENU_ACTIONS.PREVIEW,
  },
  { label: null, value: false, separator: true },
  {
    label: __('Rename', 'web-stories'),
    value: STORY_CONTEXT_MENU_ACTIONS.RENAME,
  },
  {
    label: __('Duplicate', 'web-stories'),
    value: STORY_CONTEXT_MENU_ACTIONS.DUPLICATE,
  },
  {
    label: __('Create Template', 'web-stories'),
    value: STORY_CONTEXT_MENU_ACTIONS.CREATE_TEMPLATE,
  },
  { label: null, value: false, separator: true },
  {
    label: __('Delete Story', 'web-stories'),
    value: STORY_CONTEXT_MENU_ACTIONS.DELETE,
  },
];

export const SORT_DIRECTION = {
  ASC: 'asc',
  DESC: 'desc',
};

export const STORY_SORT_OPTIONS = {
  NAME: 'title',
  DATE_CREATED: 'date',
  LAST_MODIFIED: 'modified',
  LAST_OPENED: 'modified',
  CREATED_BY: 'story_author',
};

export const ORDER_BY_SORT = {
  [STORY_SORT_OPTIONS.NAME]: SORT_DIRECTION.ASC,
  [STORY_SORT_OPTIONS.DATE_CREATED]: SORT_DIRECTION.DESC,
  [STORY_SORT_OPTIONS.LAST_MODIFIED]: SORT_DIRECTION.DESC,
  [STORY_SORT_OPTIONS.LAST_OPENED]: SORT_DIRECTION.DESC,
  [STORY_SORT_OPTIONS.CREATED_BY]: SORT_DIRECTION.ASC,
};

export const STORY_SORT_MENU_ITEMS = [
  {
    label: __('Name', 'web-stories'),
    value: STORY_SORT_OPTIONS.NAME,
  },
  {
    label: __('Date created', 'web-stories'),
    value: STORY_SORT_OPTIONS.DATE_CREATED,
  },
  {
    label: __('Last modified', 'web-stories'), // default
    value: STORY_SORT_OPTIONS.LAST_MODIFIED,
  },
  {
    label: __('Last opened', 'web-stories'),
    value: STORY_SORT_OPTIONS.LAST_OPENED,
  },
  {
    label: __('Created by', 'web-stories'),
    value: STORY_SORT_OPTIONS.CREATED_BY,
  },
];
export const STORY_STATUS = {
  ALL: 'publish,draft',
  PUBLISHED: 'publish',
  DRAFT: 'draft',
};

export const STORY_STATUSES = [
  { label: __('All Stories', 'web-stories'), value: STORY_STATUS.ALL },
  { label: __('Drafts', 'web-stories'), value: STORY_STATUS.DRAFT },
  { label: __('Published', 'web-stories'), value: STORY_STATUS.PUBLISHED },
];

export const STORY_VIEWING_LABELS = {
  [STORY_STATUS.ALL]: __('Viewing all stories', 'web-stories'),
  [STORY_STATUS.DRAFT]: __('Viewing drafts', 'web-stories'),
  [STORY_STATUS.PUBLISHED]: __('Viewing published stories', 'web-stories'),
};
