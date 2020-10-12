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

export const TIMEZONELESS_FORMAT = 'YYYY-MM-DDTHH:mm:ss';

export const SCROLLBAR_WIDTH = 11;
export const ADMIN_TOOLBAR_HEIGHT = 32;
export const HEADER_HEIGHT = 48;
export const CANVAS_MIN_WIDTH = 570;
export const LIBRARY_MIN_WIDTH = 220;
export const LIBRARY_MAX_WIDTH = 360;
export const INSPECTOR_MIN_WIDTH = 220;
export const INSPECTOR_MAX_WIDTH = 280;
export const PAGE_NAV_PADDING = 60;
export const PAGE_NAV_BUTTON_SIZE = 40;
export const PAGE_NAV_WIDTH = PAGE_NAV_PADDING + PAGE_NAV_BUTTON_SIZE;

export const PAGE_RATIO = 2 / 3;
export const PAGE_WIDTH = 412;
export const PAGE_HEIGHT = 618;

export const ALLOWED_EDITOR_PAGE_WIDTHS = [412, 268, 223];

export const FULLBLEED_RATIO = 9 / 16;

export const DESIGN_SPACE_MARGIN = 48;

export const PAGE_ATTACHMENT_HEIGHT_RATIO = 0.2;

export const COLOR_PRESETS_PER_ROW = 6;
export const STYLE_PRESETS_PER_ROW = 2;

export const TEXT_SET_SIZE = 150;

// Default device pixel ratio.
export const DEFAULT_DPR = 0.5;

// Default 1em value for font size.
export const DEFAULT_EM = PAGE_HEIGHT * 0.02186;

// @todo Confirm real min-max font sizes.
export const MIN_FONT_SIZE = 30;
export const MAX_FONT_SIZE = 200;

export const DEFAULT_ATTRIBUTES_FOR_MEDIA = {
  scale: 100,
  focalX: 50,
  focalY: 50,
};

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

export const BACKGROUND_TEXT_MODE = {
  NONE: 'NONE',
  FILL: 'FILL',
  HIGHLIGHT: 'HIGHLIGHT',
};

export const FONT_WEIGHT = {
  NORMAL: 400,
  BOLD: 700,
};
