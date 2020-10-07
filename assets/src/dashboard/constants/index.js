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
import { STORY_VIEWING_LABELS } from './stories';
import { SAVED_TEMPLATES_VIEWING_LABELS } from './savedTemplates';
import { TEMPLATES_GALLERY_VIEWING_LABELS } from './templates';

export const KEYBOARD_USER_CLASS = `useskeyboard`;
export const KEYBOARD_USER_SELECTOR = `.${KEYBOARD_USER_CLASS}`;

export const Z_INDEX = {
  LAYOUT_SQUISHABLE: 3,
  LAYOUT_FIXED: 5,
  STICKY_TABLE: 2,
  POPOVER_MENU: 10,
  TYPEAHEAD_OPTIONS: 10,
  POPOVER_PANEL: 10,
  TOASTER: 15,
};

export const APP_ROUTES = {
  MY_STORIES: '/',
  SAVED_TEMPLATES: '/saved-templates',
  TEMPLATES_GALLERY: '/templates-gallery',
  TEMPLATE_DETAIL: 'template-detail',

  EDITOR_SETTINGS: '/editor-settings',
  SUPPORT: 'https://wordpress.org/support/plugin/web-stories/',
  STORY_ANIM_TOOL: '/story-anim-tool',
};

export const NESTED_APP_ROUTES = {
  TEMPLATES_GALLERY_DETAIL: `${APP_ROUTES.TEMPLATES_GALLERY}/${APP_ROUTES.TEMPLATE_DETAIL}`,
  SAVED_TEMPLATE_DETAIL: `${APP_ROUTES.SAVED_TEMPLATES}/${APP_ROUTES.TEMPLATE_DETAIL}`,
};

export const ADMIN_TITLE = __('Web Stories', 'web-stories');

export const ROUTE_TITLES = {
  [APP_ROUTES.MY_STORIES]: __('My Stories', 'web-stories'),
  [APP_ROUTES.SAVED_TEMPLATES]: __('Saved Templates', 'web-stories'),
  [APP_ROUTES.TEMPLATES_GALLERY]: __('Explore Templates', 'web-stories'),
  [`${APP_ROUTES.TEMPLATES_GALLERY}/${APP_ROUTES.TEMPLATE_DETAIL}`]: __(
    'Template Details',
    'web-stories'
  ),
  [APP_ROUTES.EDITOR_SETTINGS]: __('Editor Settings', 'web-stories'),
  [APP_ROUTES.SUPPORT]: __('Support', 'web-stories'),
  DEFAULT: __('My Stories', 'web-stories'),
};

export const PRIMARY_PATHS = [
  { value: APP_ROUTES.MY_STORIES, label: ROUTE_TITLES[APP_ROUTES.MY_STORIES] },
  {
    value: APP_ROUTES.SAVED_TEMPLATES,
    label: ROUTE_TITLES[APP_ROUTES.SAVED_TEMPLATES],
    inProgress: true,
  },
  {
    value: APP_ROUTES.TEMPLATES_GALLERY,
    label: ROUTE_TITLES[APP_ROUTES.TEMPLATES_GALLERY],
  },
  {
    value: APP_ROUTES.EDITOR_SETTINGS,
    label: ROUTE_TITLES[APP_ROUTES.EDITOR_SETTINGS],
  },
  {
    value: APP_ROUTES.SUPPORT,
    label: ROUTE_TITLES[APP_ROUTES.SUPPORT],
    isExternal: true,
    trackingEvent: 'open_support_page',
  },
];

export const VIEW_STYLE = {
  GRID: 'grid',
  LIST: 'list',
};

export const VIEW_STYLE_LABELS = {
  [VIEW_STYLE.GRID]: __('Switch to List View', 'web-stories'),
  [VIEW_STYLE.LIST]: __('Switch to Grid View', 'web-stories'),
};

export const ICON_METRICS = {
  VIEW_STYLE: { width: 17, height: 14 },
  LEFT_RIGHT_ARROW: { width: 16, height: 16 },
  TELEMETRY_BANNER_EXIT: { width: 10, height: 10 },
};

export const DASHBOARD_VIEWS = {
  MY_STORIES: 'MY_STORIES',
  SAVED_TEMPLATES: 'SAVED_TEMPLATES',
  TEMPLATES_GALLERY: 'TEMPLATES_GALLERY',
};
export const RESULT_LABELS = {
  [DASHBOARD_VIEWS.MY_STORIES]: { ...STORY_VIEWING_LABELS },
  [DASHBOARD_VIEWS.SAVED_TEMPLATES]: { ...SAVED_TEMPLATES_VIEWING_LABELS },
  [DASHBOARD_VIEWS.TEMPLATES_GALLERY]: { ...TEMPLATES_GALLERY_VIEWING_LABELS },
};

// API Query Constants
export const ITEMS_PER_PAGE = 24;
export const USERS_PER_REQUEST = 100;
export const STORIES_PER_REQUEST = 24;

export const DEFAULT_DATE_FORMAT = 'Y-m-d';

export const TEXT_INPUT_DEBOUNCE = 300;

export const MIN_IMG_HEIGHT = 96;
export const MIN_IMG_WIDTH = 96;

export * from './components';
export * from './direction';
export * from './pageStructure';
export * from './savedTemplates';
export * from './settings';
export * from './stories';
export * from './templates';
