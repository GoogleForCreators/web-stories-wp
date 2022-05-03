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

// Floating menu lays on top of side menu
export const Z_INDEX_CANVAS_SIDE_MENU = 3;

// Floating element menu (a context menu) should be behind other popopups
export const Z_INDEX_FLOATING_MENU = 4;

// Edit Layer holds footer, popups in footer need to be in front of floating menu
export const Z_INDEX_EDIT_LAYER = 3;

// Nav layer doesn't have it's own stacking context, so we apply this
// to the header and footer to be in the same stacking context as
// floating menu layer & edit layer
export const Z_INDEX_NAV_LAYER = 5;

// idk why these are defined in here. they're used through out parts of the
// codebase, but they're not in the same stacking as the other layers in this
// file. Keeping them in here to avoid regressions in the codebase, but
// we should look into only storing z-index constants that apply to the same
// stacking context
export const Z_INDEX_FOOTER = 3;
export const Z_INDEX_HEAD_AREA = 3;

// The Grid View component is a modal, the Slider that is used inside
// needs to be pulled on top.
export const Z_INDEX_GRID_VIEW_SLIDER = 11;
