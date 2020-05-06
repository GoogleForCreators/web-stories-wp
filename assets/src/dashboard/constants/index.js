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
import { PAGE_HEIGHT, PAGE_WIDTH } from '../../edit-story/constants';

export const BUTTON_TYPES = {
  CTA: 'cta',
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
};

export const CHIP_TYPES = {
  STANDARD: 'standard',
  SMALL: 'small',
};

export const DROPDOWN_TYPES = {
  TRANSPARENT_MENU: 'transparentMenu',
  MENU: 'menu',
  PANEL: 'panel',
};

export const KEYS = {
  ENTER: 'Enter',
  UP: 'ArrowUp',
  DOWN: 'ArrowDown',
};

export const KEYBOARD_USER_CLASS = `useskeyboard`;
export const KEYBOARD_USER_SELECTOR = `.${KEYBOARD_USER_CLASS}`;

export const Z_INDEX = {
  LAYOUT_SQUISHABLE: 2,
  LAYOUT_FIXED: 3,
  POPOVER_MENU: 10,
  TYPEAHEAD_OPTIONS: 10,
  POPOVER_PANEL: 10,
};

export const PAGE_RATIO = PAGE_WIDTH / PAGE_HEIGHT;
export const CARD_TITLE_AREA_HEIGHT = 80;

export const APP_ROUTES = {
  MY_STORIES: '/',
  SAVED_TEMPLATES: '/saved-templates',
  TEMPLATES_GALLERY: '/templates-gallery',
  TEMPLATE_DETAIL: '/template-detail',
  EDITOR_SETTINGS: '/editor-settings',
  SUPPORT: '/support',
};

export const primaryPaths = [
  { value: APP_ROUTES.MY_STORIES, label: __('My Stories', 'web-stories') },
  {
    value: APP_ROUTES.SAVED_TEMPLATES,
    label: __('Saved Templates', 'web-stories'),
  },
  {
    value: APP_ROUTES.TEMPLATES_GALLERY,
    label: __('Explore Templates', 'web-stories'),
  },
];

export const secondaryPaths = [
  {
    value: APP_ROUTES.EDITOR_SETTINGS,
    label: __('Editor Settings', 'web-stories'),
  },
  {
    value: APP_ROUTES.SUPPORT,
    label: __('Support', 'web-stories'),
  },
];

export const STORY_STATUSES = [
  { label: __('All Stories', 'web-stories'), value: 'publish,draft' },
  { label: __('Drafts', 'web-stories'), value: 'draft' },
  { label: __('Active Stories', 'web-stories'), value: 'publish' },
  // { label: __('My Templates', 'web-stories'), value: 'template ' },
];

export const VIEW_STYLE = {
  GRID: 'GRID',
  LIST: 'LIST',
};

export const ICON_METRICS = {
  VIEW_STYLE: { width: 17, height: 14 },
  UP_DOWN_ARROW: { width: 16, height: 16 },
  LEFT_RIGHT_ARROW: { width: 16, height: 16 },
};

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

export const ITEMS_PER_PAGE = 10;

export const STORY_SORT_OPTIONS = {
  NAME: 'title',
  DATE_CREATED: 'date',
  LAST_MODIFIED: 'modified',
  LAST_OPENED: 'modified',
  CREATED_BY: 'story_author',
};

export const SORT_DIRECTION = {
  ASC: 'asc',
  DESC: 'desc',
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
    label: __('Created by', 'web-stories'), // owner first then alpha
    value: STORY_SORT_OPTIONS.CREATED_BY,
  },
];

export * from './animation';
export * from './direction';
export * from './templates';
