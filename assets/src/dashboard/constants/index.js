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
  LAYOUT_SQUISHABLE: 2,
  LAYOUT_FIXED: 3,
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
  SUPPORT: '/support',
  STORY_ANIM_TOOL: '/story-anim-tool',
};

export const NESTED_APP_ROUTES = {
  TEMPLATES_GALLERY_DETAIL: `${APP_ROUTES.TEMPLATES_GALLERY}/${APP_ROUTES.TEMPLATE_DETAIL}`,
  SAVED_TEMPLATE_DETAIL: `${APP_ROUTES.SAVED_TEMPLATES}/${APP_ROUTES.TEMPLATE_DETAIL}`,
};

export const primaryPaths = [
  { value: APP_ROUTES.MY_STORIES, label: __('My Stories', 'web-stories') },
  {
    value: APP_ROUTES.SAVED_TEMPLATES,
    label: __('Saved Templates', 'web-stories'),
    inProgress: true,
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
    inProgress: true,
  },
  {
    value: APP_ROUTES.SUPPORT,
    label: __('Support', 'web-stories'),
    inProgress: true,
  },
];

export const VIEW_STYLE = {
  GRID: 'GRID',
  LIST: 'LIST',
};

export const VIEW_STYLE_LABELS = {
  [VIEW_STYLE.GRID]: __('Switch to List View', 'web-stories'),
  [VIEW_STYLE.LIST]: __('Switch to Grid View', 'web-stories'),
};

export const ICON_METRICS = {
  VIEW_STYLE: { width: 17, height: 14 },
  LEFT_RIGHT_ARROW: { width: 16, height: 16 },
};

export const ITEMS_PER_PAGE = 20;

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

export * from './animation';
export * from './components';
export * from './direction';
export * from './pageStructure';
export * from './savedTemplates';
export * from './stories';
export * from './templates';
