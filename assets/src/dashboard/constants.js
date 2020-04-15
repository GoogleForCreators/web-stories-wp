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
import { PAGE_HEIGHT, PAGE_WIDTH } from '../edit-story/constants';

export const BEZIER = {
  linear: 'linear',
  inQuad: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
  outQuad: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  inOutQuad: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
  inCubic: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
  outCubic: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  inOutCubic: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
  inQuart: 'cubic-bezier(0.895, 0.03, 0.685, 0.22)',
  outQuart: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
  inOutQuart: 'cubic-bezier(0.77, 0, 0.175, 1)',
  inQuint: 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
  outQuint: 'cubic-bezier(0.23, 1, 0.32, 1)',
  inOutQuint: 'cubic-bezier(0.86, 0, 0.07, 1)',
  inSine: 'cubic-bezier(0.47, 0, 0.745, 0.715)',
  outSine: 'cubic-bezier(0.39, 0.575, 0.565, 1)',
  inOutSine: 'cubic-bezier(0.445, 0.05, 0.55, 0.95)',
  inExpo: 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
  outExpo: 'cubic-bezier(0.19, 1, 0.22, 1)',
  inOutExpo: 'cubic-bezier(1, 0, 0, 1)',
  inCirc: 'cubic-bezier(0.6, 0.04, 0.98, 0.335)',
  outCirc: 'cubic-bezier(0.075, 0.82, 0.165, 1)',
  inOutCirc: 'cubic-bezier(0.785, 0.135, 0.15, 0.86)',
};

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

export const CORNER_DIRECTIONS = {
  TOP_LEFT: 'top_left',
  TOP_RIGHT: 'top_right',
  BOTTOM_RIGHT: 'bottom_right',
  BOTTOM_LEFT: 'bottom_left',
};

export const Z_INDEX = {
  POPOVER_MENU: 10,
  TYPEAHEAD_OPTIONS: 10,
  POPOVER_PANEL: 10,
};

export const PAGE_RATIO = PAGE_HEIGHT / PAGE_WIDTH;
export const CARD_TITLE_AREA_HEIGHT = 80;

export const APP_ROUTES = {
  MY_STORIES: '/',
  MY_BOOKMARKS: '/bookmarks',
  TEMPLATES_GALLERY: '/templates-gallery',
  TEMPLATE_DETAIL: '/template-detail',
};

export const paths = [
  { value: APP_ROUTES.MY_STORIES, label: __('My Stories', 'web-stories') },
  // {
  //   value: APP_ROUTES.TEMPLATES_GALLERY,
  //   label: __('Templates Gallery', 'web-stories'),
  // },
  // { value: APP_ROUTES.MY_BOOKMARKS, label: __('My Bookmarks', 'web-stories') },
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

export const VIEW_STYLE_ICON_METRICS = { width: 17, height: 14 };

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

export const STORY_SORT_OPTIONS = {
  NAME: 'title',
  DATE_CREATED: 'date',
  LAST_MODIFIED: 'modified',
  LAST_OPENED: 'modified',
  CREATED_BY: 'author',
};

export const ORDER_BY_SORT = {
  [STORY_SORT_OPTIONS.NAME]: 'asc',
  [STORY_SORT_OPTIONS.DATE_CREATED]: 'desc',
  [STORY_SORT_OPTIONS.LAST_MODIFIED]: 'desc',
  [STORY_SORT_OPTIONS.LAST_OPENED]: 'desc',
  [STORY_SORT_OPTIONS.CREATED_BY]: 'asc',
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
