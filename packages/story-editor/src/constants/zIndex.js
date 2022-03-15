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

// Bring element in front of story details modal
export const Z_INDEX_STORY_DETAILS = 10;

// Lift the head area from under the canvas, only impacts Karma.
export const Z_INDEX_HEAD_AREA = 3;

// Floating menu lays on top of side menu
export const Z_INDEX_CANVAS_SIDE_MENU = 3;

// Floating element menu (a context menu) should be behind other popopups
export const Z_INDEX_FLOATING_MENU = 4;

// TODO these layers are taking priority over the floating menu but they can't.
// Visually we want them in front of the floating menu but
// they actually need to be behind to be usable. This is going to be a much bigger lift.
// https://github.com/GoogleForCreators/web-stories-wp/issues/10892
// Edit Layer holds footer, popups in footer need to be in front of floating menu
export const Z_INDEX_EDIT_LAYER = 3;

// sibling inherits parent z-index of Z_INDEX_EDIT_LAYER
// so popups nested in footer need to be placed above that
// while still retaining position in the DOM for focus purposes
export const Z_INDEX_FOOTER = 3;
