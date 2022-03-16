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
import { __ } from '@googleforcreators/i18n';
/**
 * Internal dependencies
 */
import { Compass, HomeWithHeart } from '../icons';
import { STORY_VIEWING_LABELS } from './stories';
import { TEMPLATES_GALLERY_VIEWING_LABELS } from './templates';

export const KEYBOARD_USER_CLASS = `useskeyboard`;

export const Z_INDEX = {
  LAYOUT_SQUISHABLE: 3,
  LAYOUT_FIXED: 5,
  STICKY_TABLE: 2,
  POPOVER_MENU: 10,
  POPOVER_PANEL: 10,
};

export const APP_ROUTES = {
  DASHBOARD: '/',
  TEMPLATES_GALLERY: '/templates-gallery',
  TEMPLATE_DETAIL: 'template-detail',
};

export const ADMIN_TITLE = __('Web Stories', 'web-stories');

export const ROUTE_TITLES = {
  [APP_ROUTES.DASHBOARD]: __('Dashboard', 'web-stories'),
  [APP_ROUTES.TEMPLATES_GALLERY]: __('Explore Templates', 'web-stories'),
  [`${APP_ROUTES.TEMPLATES_GALLERY}/${APP_ROUTES.TEMPLATE_DETAIL}`]: __(
    'Template Details',
    'web-stories'
  ),
  DEFAULT: __('Dashboard', 'web-stories'),
};

export const PRIMARY_PATHS = [
  {
    value: APP_ROUTES.DASHBOARD,
    label: ROUTE_TITLES[APP_ROUTES.DASHBOARD],
    Icon: HomeWithHeart,
  },
  {
    value: APP_ROUTES.TEMPLATES_GALLERY,
    label: ROUTE_TITLES[APP_ROUTES.TEMPLATES_GALLERY],
    Icon: Compass,
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

export const DASHBOARD_VIEWS = {
  DASHBOARD: 'DASHBOARD',
  TEMPLATES_GALLERY: 'TEMPLATES_GALLERY',
};
export const RESULT_LABELS = {
  [DASHBOARD_VIEWS.DASHBOARD]: { ...STORY_VIEWING_LABELS },
  [DASHBOARD_VIEWS.TEMPLATES_GALLERY]: { ...TEMPLATES_GALLERY_VIEWING_LABELS },
};

// API Query Constants
export const STORIES_PER_REQUEST = 24;

export const TEXT_INPUT_DEBOUNCE = 300;

export const MIN_IMG_HEIGHT = 96;
export const MIN_IMG_WIDTH = 96;

export const DEFAULT_GRID_IMG_HEIGHT = 853;
export const DEFAULT_GRID_IMG_WIDTH = 640;

export * from './components';
export * from './pageStructure';
export * from './stories';
export * from './templates';
