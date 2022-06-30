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
 * External dependencies
 */
import { __, sprintf, _n } from '@googleforcreators/i18n';

export const STORY_CONTEXT_MENU_ACTIONS = {
  OPEN_IN_EDITOR: 'open-in-editor-action',
  RENAME: 'rename-action',
  DUPLICATE: 'duplicate-action',
  DELETE: 'delete-story-action',
  COPY_STORY_LINK: 'copy-story-link',
  OPEN_STORY_LINK: 'open-story-link',
  CLOSE: 'close-menu',
};

export const STORY_CONTEXT_MENU_ITEMS = [
  {
    label: __('Open in editor', 'web-stories'),
    value: STORY_CONTEXT_MENU_ACTIONS.OPEN_IN_EDITOR,
    isEnabled: (story) => Boolean(story?.capabilities?.hasEditAction),
  },
  {
    label: __('Open in new tab', 'web-stories'),
    value: STORY_CONTEXT_MENU_ACTIONS.OPEN_STORY_LINK,
    isEnabled: (story) => Boolean(story?.previewLink),
  },
  {
    label: __('Copy Story URL', 'web-stories'),
    value: STORY_CONTEXT_MENU_ACTIONS.COPY_STORY_LINK,
    isEnabled: (story) => Boolean(story?.previewLink),
  },
  {
    label: __('Rename', 'web-stories'),
    value: STORY_CONTEXT_MENU_ACTIONS.RENAME,
    separator: 'top',
    isEnabled: (story) => Boolean(story?.capabilities?.hasEditAction),
  },
  {
    label: __('Duplicate', 'web-stories'),
    value: STORY_CONTEXT_MENU_ACTIONS.DUPLICATE,
    isEnabled: (story) => Boolean(story?.capabilities?.hasEditAction),
  },
  {
    label: __('Delete Story', 'web-stories'),
    value: STORY_CONTEXT_MENU_ACTIONS.DELETE,
    separator: 'top',
    isEnabled: (story) => Boolean(story?.capabilities?.hasDeleteAction),
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

export const SORT_KEYS = {
  orderby: STORY_SORT_OPTIONS,
  order: SORT_DIRECTION,
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
    label: __('Date Created', 'web-stories'),
    value: STORY_SORT_OPTIONS.DATE_CREATED,
  },
  {
    label: __('Last Modified', 'web-stories'), // default
    value: STORY_SORT_OPTIONS.LAST_MODIFIED,
  },
  {
    label: __('Created By', 'web-stories'),
    value: STORY_SORT_OPTIONS.CREATED_BY,
  },
];

/**
 * All possible story statuses.
 */
const BASE_STATUSES = {
  DRAFT: 'draft',
  FUTURE: 'future',
  PENDING: 'pending',
  PUBLISH: 'publish',
  PRIVATE: 'private',
};

export const STORY_STATUS = {
  ALL: Object.values(BASE_STATUSES).join(','),
  PUBLISHED_AND_FUTURE: [BASE_STATUSES.PUBLISH, BASE_STATUSES.FUTURE].join(','),
  ...BASE_STATUSES,
};

export const DISPLAY_STATUS = {
  [STORY_STATUS.PUBLISH]: __('Published', 'web-stories'),
  [STORY_STATUS.PENDING]: __('Pending', 'web-stories'),
  [STORY_STATUS.FUTURE]: __('Scheduled', 'web-stories'),
  [STORY_STATUS.DRAFT]: __('Draft', 'web-stories'),
  [STORY_STATUS.PRIVATE]: __('Private', 'web-stories'),
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
    label: __('Pending', 'web-stories'),
    value: STORY_STATUS.PENDING,
    status: STORY_STATUS.PENDING,
  },
  {
    label: __('Published', 'web-stories'),
    value: STORY_STATUS.PUBLISH,
    status: STORY_STATUS.PUBLISH,
  },
  {
    label: __('Scheduled', 'web-stories'),
    value: STORY_STATUS.FUTURE,
    status: STORY_STATUS.FUTURE,
  },
  {
    label: __('Private', 'web-stories'),
    value: STORY_STATUS.PRIVATE,
    status: STORY_STATUS.PRIVATE,
  },
];

export const STORY_VIEWING_LABELS = {
  [STORY_STATUS.ALL]: (n) =>
    sprintf(
      /* translators: %d: number of stories in view */
      _n(
        'Viewing <strong>%d</strong> story',
        'Viewing all <strong>%d</strong> stories',
        n,
        'web-stories'
      ),
      n
    ),
  [STORY_STATUS.DRAFT]: (n) =>
    sprintf(
      /* translators: %d: number of draft stories in view */
      _n(
        'Viewing <strong>%d</strong> draft',
        'Viewing <strong>%d</strong> drafts',
        n,
        'web-stories'
      ),
      n
    ),
  [STORY_STATUS.PUBLISH]: (n) =>
    sprintf(
      /* translators: %d: number of stories */
      _n(
        'Viewing <strong>%d</strong> published story',
        'Viewing <strong>%d</strong> published stories',
        n,
        'web-stories'
      ),
      n
    ),
  [STORY_STATUS.FUTURE]: (n) =>
    sprintf(
      /* translators: %d: number of stories */
      _n(
        'Viewing <strong>%d</strong> scheduled story',
        'Viewing <strong>%d</strong> scheduled stories',
        n,
        'web-stories'
      ),
      n
    ),
  [STORY_STATUS.PENDING]: (n) =>
    sprintf(
      /* translators: %d: number of stories */
      _n(
        'Viewing <strong>%d</strong> pending story',
        'Viewing <strong>%d</strong> pending stories',
        n,
        'web-stories'
      ),
      n
    ),
  [STORY_STATUS.PRIVATE]: (n) =>
    sprintf(
      /* translators: %d: number of stories */
      _n(
        'Viewing <strong>%d</strong> private story',
        'Viewing <strong>%d</strong> private stories',
        n,
        'web-stories'
      ),
      n
    ),
};

export const STORY_ANIMATION_STATE = {
  RESET: 'reset',
  PAUSED: 'paused',
  SCRUBBING: 'scrubbing',
  PLAYING: 'playing',
};
