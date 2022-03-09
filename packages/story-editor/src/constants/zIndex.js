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

export const Z_INDEX_EDIT_LAYER = Z_INDEX_FLOATING_MENU + 1;

export const Z_INDEX_FOOTER_POPUP = Z_INDEX_EDIT_LAYER + 1;
