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

export const ADMIN_TOOLBAR_HEIGHT = 32;
export const HEADER_HEIGHT = 48;
export const CANVAS_MIN_WIDTH = 480;
export const LIBRARY_MIN_WIDTH = 220;
export const LIBRARY_MAX_WIDTH = 360;
export const INSPECTOR_MIN_WIDTH = 220;
export const INSPECTOR_MAX_WIDTH = 280;
export const PAGE_NAV_PADDING = 60;
export const PAGE_NAV_BUTTON_WIDTH = 40;
export const PAGE_NAV_WIDTH = PAGE_NAV_PADDING + PAGE_NAV_BUTTON_WIDTH;

export const PAGE_WIDTH = 1080;
export const PAGE_HEIGHT = 1920;
export const DEFAULT_EDITOR_PAGE_WIDTH = 412;
export const DEFAULT_EDITOR_PAGE_HEIGHT = 732;

// @todo Confirm real min-max font sizes.
export const MIN_FONT_SIZE = 30;
export const MAX_FONT_SIZE = 200;

export const LAYER_DIRECTIONS = {
  FRONT: 'FRONT',
  BACK: 'BACK',
  FORWARD: 'FORWARD',
  BACKWARD: 'BACKWARD',
};

export const Z_INDEX_CANVAS = {
  MOVABLE: 10,
  FLOAT_PANEL: 11,
};
