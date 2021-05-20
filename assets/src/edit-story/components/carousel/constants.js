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
 * Internal dependencies
 */
import { THEME_CONSTANTS } from '../../../design-system';

// If the workspace is wider than this limit, this margin will be applied to the right
export const VERY_WIDE_WORKSPACE_LIMIT = 1000;
export const VERY_WIDE_MARGIN = 8;

// The buttons and menu gutters
export const BUTTON_WIDTH = THEME_CONSTANTS.ICON_SIZE;
export const BUTTON_GAP = 8;
export const BUTTON_GUTTER = BUTTON_WIDTH + BUTTON_GAP;
export const MENU_GUTTER = 167;

// Thumbnail size varies with workspace size - over or under this limit
export const WIDE_WORKSPACE_LIMIT = 700;
export const WIDE_THUMBNAIL_WIDTH = 40;
export const WIDE_THUMBNAIL_HEIGHT = 60;
export const NARROW_THUMBNAIL_WIDTH = 36;
export const NARROW_THUMBNAIL_HEIGHT = 54;
export const THUMBNAIL_MARGIN = 16;
export const THUMBNAIL_LINE_WIDTH = 4;
