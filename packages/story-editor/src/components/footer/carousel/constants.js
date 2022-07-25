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
import { THEME_CONSTANTS } from '@googleforcreators/design-system';

// The navigation buttons and menu gutters
export const NAVIGATION_BUTTON_WIDTH = THEME_CONSTANTS.ICON_SIZE;
export const NAVIGATION_BUTTON_GAP = 8;
export const NAVIGATION_BUTTON_GUTTER =
  NAVIGATION_BUTTON_WIDTH + NAVIGATION_BUTTON_GAP;

// Drawer button
export const DRAWER_BUTTON_HEIGHT = 32;
export const DRAWER_BUTTON_GAP_EXPANDED = 8;
export const DRAWER_BUTTON_GAP_COLLAPSED = 2;

// Thumbnail size varies with available carousel size - over or under this limit
export const WIDE_CAROUSEL_LIMIT = 400;
export const WIDE_THUMBNAIL_WIDTH = 45;
export const WIDE_THUMBNAIL_HEIGHT = 80;
export const NARROW_THUMBNAIL_WIDTH = 36;
export const NARROW_THUMBNAIL_HEIGHT = 64;
export const THUMBNAIL_MARGIN = 16;
export const THUMBNAIL_LINE_WIDTH = 4;
