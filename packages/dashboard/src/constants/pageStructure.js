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

export { PAGE_RATIO, PAGE_WIDTH, PAGE_HEIGHT } from '@googleforcreators/units';

export const DASHBOARD_LEFT_NAV_WIDTH = 288;

export const MIN_DASHBOARD_WIDTH = 1098;

export const VIEWPORT_BREAKPOINT = {
  TABLET: 'tablet',
  DESKTOP: 'desktop',
  THUMBNAIL: 'thumbnail',
};

export const STORY_PREVIEW_WIDTH = {
  [VIEWPORT_BREAKPOINT.TABLET]: 200,
  [VIEWPORT_BREAKPOINT.DESKTOP]: 232,
  [VIEWPORT_BREAKPOINT.THUMBNAIL]: 33,
};

export const GRID_SPACING = {
  COLUMN_GAP: 24,
  ROW_GAP: 32,
};

export const PAGE_WRAPPER = {
  GUTTER: 52,
};
