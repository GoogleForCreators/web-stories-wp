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

// If the workspace is wider than this limit, this margin will be applied to the right
export const VERY_WIDE_WORKSPACE_LIMIT = 1000;
export const VERY_WIDE_MARGIN = 8;

export const FOOTER_MARGIN = 16;
export const FOOTER_TOP_MARGIN = FOOTER_MARGIN;
export const FOOTER_BOTTOM_MARGIN = FOOTER_MARGIN;

export const FOOTER_MENU_GAP = 8;

export const KEYBOARD_SHORTCUTS_PADDING = 3;

const BORDER_WIDTH = 1;
const KEYBOARD_SHORTCUTS_WIDTH =
  THEME_CONSTANTS.ICON_SIZE + 2 * KEYBOARD_SHORTCUTS_PADDING + 2 * BORDER_WIDTH;
const LARGE_BUTTON_WIDTH = THEME_CONSTANTS.LARGE_BUTTON_SIZE + 2 * BORDER_WIDTH;

// What's the max space required for either menu? The widest possible menu is
// the secondary one with two large buttons + shortcuts button + 2 gaps + right margin:
export const MAX_MENU_WIDTH =
  2 * LARGE_BUTTON_WIDTH +
  KEYBOARD_SHORTCUTS_WIDTH +
  2 * FOOTER_MENU_GAP +
  FOOTER_MARGIN;
