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

// Manipulate pages.
export const ADD_PAGE = 'ADD_PAGE';
export const UPDATE_PAGE = 'UPDATE_PAGE';
export const DELETE_PAGE = 'DELETE_PAGE';
export const ARRANGE_PAGE = 'ARRANGE_PAGE';

// Manipulate elements on a page.
export const DELETE_ELEMENTS = 'DELETE_ELEMENTS';
export const ADD_ELEMENTS = 'ADD_ELEMENTS';
export const UPDATE_ELEMENTS = 'UPDATE_ELEMENTS';
export const UPDATE_ELEMENTS_BY_RESOURCE_ID = 'UPDATE_ELEMENTS_BY_RESOURCE_ID';
export const DELETE_ELEMENTS_BY_RESOURCE_ID = 'DELETE_ELEMENTS_BY_RESOURCE_ID';
export const SET_BACKGROUND_ELEMENT = 'SET_BACKGROUND_ELEMENT';
export const ARRANGE_ELEMENT = 'ARRANGE_ELEMENT';
export const COMBINE_ELEMENTS = 'COMBINE_ELEMENTS';
export const DUPLICATE_ELEMENTS_BY_ID = 'DUPLICATE_ELEMENTS_BY_ID';
export const COPY_SELECTED_ELEMENT = 'COPY_SELECTED_ELEMENT';

// Manipulate current page.
export const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';

// Manipulate list of selected elements.
export const SET_SELECTED_ELEMENTS = 'SET_SELECTED_ELEMENTS';
export const SELECT_ELEMENT = 'SELECT_ELEMENT';
export const UNSELECT_ELEMENT = 'UNSELECT_ELEMENT';
export const TOGGLE_ELEMENT_IN_SELECTION = 'TOGGLE_ELEMENT_IN_SELECTION';
export const TOGGLE_LAYER = 'TOGGLE_LAYER';

// Manipulate story-global state.
export const UPDATE_STORY = 'UPDATE_STORY';

// Manipulate animation state.
export const UPDATE_ANIMATION_STATE = 'UPDATE_ANIMATION_STATE';
export const ADD_ANIMATIONS = 'ADD_ANIMATIONS';

// Manipulate entire internal state.
export const RESTORE = 'RESTORE';

// Reserved property names for pages and elements.
export const PAGE_RESERVED_PROPERTIES = ['id', 'elements'];
export const ELEMENT_RESERVED_PROPERTIES = [
  'id',
  'isBackground',
  'isDefaultBackground',
];
