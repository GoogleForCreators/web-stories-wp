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

export const DEFAULT_STORY_PAGE_ADVANCE_DURATION = 2000;

export const STORY_CONTEXT_MENU_ACTIONS = {
  OPEN_IN_EDITOR: 'open-in-editor-action',
  PREVIEW: 'preview-action',
  RENAME: 'rename-action',
  DUPLICATE: 'duplicate-action',
  CREATE_TEMPLATE: 'create-template-action',
  DELETE: 'delete-story-action',
  COPY_STORY_LINK: 'copy-story-link',
  OPEN_STORY_LINK: 'open-story-link',
  CLOSE: 'close-menu',
};

export const STORY_CONTEXT_MENU_ITEMS = [
  {
    label: __('Open in editor', 'web-stories'),
    value: STORY_CONTEXT_MENU_ACTIONS.OPEN_IN_EDITOR,
  },
  {
    label: __('Preview', 'web-stories'),
    value: STORY_CONTEXT_MENU_ACTIONS.PREVIEW,
    inProgress: true,
  },
  {
    label: __('Open in new tab', 'web-stories'),
    value: STORY_CONTEXT_MENU_ACTIONS.OPEN_STORY_LINK,
  },
  {
    label: __('Copy Story URL', 'web-stories'),
    value: STORY_CONTEXT_MENU_ACTIONS.COPY_STORY_LINK,
  },
  {
    label: __('Rename', 'web-stories'),
    value: STORY_CONTEXT_MENU_ACTIONS.RENAME,
    separator: 'top',
  },
  {
    label: __('Duplicate', 'web-stories'),
    value: STORY_CONTEXT_MENU_ACTIONS.DUPLICATE,
  },
  {
    label: __('Create Template', 'web-stories'),
    value: STORY_CONTEXT_MENU_ACTIONS.CREATE_TEMPLATE,
    inProgress: true,
  },
  {
    label: __('Delete Story', 'web-stories'),
    value: STORY_CONTEXT_MENU_ACTIONS.DELETE,
    separator: 'top',
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
  CREATED_BY: 'story_author',
};

export const ORDER_BY_SORT = {
  [STORY_SORT_OPTIONS.NAME]: SORT_DIRECTION.ASC,
  [STORY_SORT_OPTIONS.DATE_CREATED]: SORT_DIRECTION.DESC,
  [STORY_SORT_OPTIONS.LAST_MODIFIED]: SORT_DIRECTION.DESC,
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
    label: __('Created by', 'web-stories'),
    value: STORY_SORT_OPTIONS.CREATED_BY,
  },
];

export const STORY_STATUS = {
  ALL: 'publish,draft,future',
  PUBLISHED_AND_FUTURE: 'publish,future',
  DRAFT: 'draft',
  FUTURE: 'future',
  PUBLISH: 'publish',
};

export const STORY_ITEM_CENTER_ACTION_LABELS = {
  [STORY_STATUS.PUBLISH]: __('View', 'web-stories'),
  [STORY_STATUS.FUTURE]: __('View', 'web-stories'),
  [STORY_STATUS.DRAFT]: __('Preview', 'web-stories'),
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
];

export const STORY_VIEWING_LABELS = {
  [STORY_STATUS.ALL]: __('Viewing all stories', 'web-stories'),
  [STORY_STATUS.DRAFT]: __('Viewing drafts', 'web-stories'),
  [STORY_STATUS.PUBLISHED_AND_FUTURE]: __(
    'Viewing published stories',
    'web-stories'
  ),
};

export const STORY_ANIMATION_STATE = {
  RESET: 'reset',
  PAUSED: 'paused',
  SCRUBBING: 'scrubbing',
  PLAYING: 'playing',
};
