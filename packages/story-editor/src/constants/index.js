/*
 * Copyright 2021 Google LLC
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

export * from './fonts';
export * from './media';
export * from './multipleValue';

export const ADMIN_TOOLBAR_HEIGHT = 32;
export const HEADER_HEIGHT = 64;
export const HEADER_GAP = 16;
export const CANVAS_MIN_WIDTH = 570;
export const SIDEBAR_WIDTH = 360;
export const PAGE_NAV_PADDING = 60;
export const PAGE_NAV_BUTTON_SIZE = 40;
export const PAGE_NAV_WIDTH = PAGE_NAV_PADDING + PAGE_NAV_BUTTON_SIZE;
export const FLOATING_MENU_DISTANCE = 10;

export const ZOOM_SETTING = {
  FILL: 'FILL',
  FIT: 'FIT',
  FIXED: 'FIXED',
};

export const CAROUSEL_STATE = {
  OPEN: 'OPEN',
  OPENING: 'OPENING',
  CLOSED: 'CLOSED',
  CLOSING: 'CLOSING',
};

export const CAROUSEL_TRANSITION_DURATION = 300;

export const PAGE_WIDTH_FACTOR = 12;

export const DESIGN_SPACE_MARGIN = 48;

export const TEXT_SET_SIZE = 150;

export const LAYER_DIRECTIONS = {
  FRONT: 'FRONT',
  BACK: 'BACK',
  FORWARD: 'FORWARD',
  BACKWARD: 'BACKWARD',
};

export const FONT_WEIGHT = {
  NORMAL: 400,
  MEDIUM: 500,
  BOLD: 700,
};

export const HIDDEN_PADDING = {
  horizontal: 8,
  vertical: 4,
};

export const SAVED_COLOR_SIZE = 32;
export const SAVED_STYLE_HEIGHT = 64;

export const OUTLINK_THEME = {
  DARK: 'dark',
  LIGHT: 'light',
  CUSTOM: 'custom',
};

export const PRESET_TYPES = {
  STYLE: 'style',
  COLOR: 'colors',
};

export const STABLE_ARRAY = [];

export const DEFAULT_AUTO_ADVANCE = true;
export const DEFAULT_PAGE_DURATION = 7;
