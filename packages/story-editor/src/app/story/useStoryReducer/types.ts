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

export enum ActionTypes {
  // Manipulate pages.
  AddPage = 'ADD_PAGE',
  UpdatePage = 'UPDATE_PAGE',
  DeletePage = 'DELETE_PAGE',
  ArrangePage = 'ARRANGE_PAGE',

  // Manipulate elements on a page.
  DeleteElements = 'DELETE_ELEMENTS',
  AddElements = 'ADD_ELEMENTS',
  UpdateElements = 'UPDATE_ELEMENTS',
  UpdateElementsByResourceId = 'UPDATE_ELEMENTS_BY_RESOURCE_ID',
  DeleteElementsByResourceId = 'DELETE_ELEMENTS_BY_RESOURCE_ID',
  SetBackgroundElement = 'SET_BACKGROUND_ELEMENT',
  ArrangeElement = 'ARRANGE_ELEMENT',
  ArrangeGroup = 'ARRANGE_GROUP',
  CombineElements = 'COMBINE_ELEMENTS',
  DuplicateElementsById = 'DUPLICATE_ELEMENTS_BY_ID',
  CopySelectedElement = 'COPY_SELECTED_ELEMENT',
  UpdateElementsByFontFamily = 'UPDATE_ELEMENTS_BY_FONT_FAMILY',

  // Manipulate current page.
  SetCurrentPage = 'SET_CURRENT_PAGE',

  // Manipulate list of selected elements.
  SetSelectedElements = 'SET_SELECTED_ELEMENTS',
  SelectElement = 'SELECT_ELEMENT',
  UnselectElement = 'UNSELECT_ELEMENT',
  ToggleElementInSelection = 'TOGGLE_ELEMENT_IN_SELECTION',
  ToggleLayer = 'TOGGLE_LAYER',

  // Manipulate story-global state.
  UpdateStory = 'UPDATE_STORY',

  // Manipulate animation state.
  UpdateAnimationState = 'UPDATE_ANIMATION_STATE',
  AddAnimations = 'ADD_ANIMATIONS',

  // Manipulate entire internal state.
  Restore = 'RESTORE',

  // Layer groups
  AddGroup = 'ADD_GROUP',
  UpdateGroup = 'UPDATE_GROUP',
  DeleteGroup = 'DELETE_GROUP',
  DuplicateGroup = 'DUPLICATE_GROUP',
  RemoveElementFromGroup = 'REMOVE_ELEMENT_FROM_GROUP',

  // Video segmentation.
  AddElementsAcrossPages = 'ADD_ELEMENTS_ACROSS_PAGES',
}

// Reserved property names for pages, elements and groups.
export const PAGE_RESERVED_PROPERTIES = ['id', 'elements', 'groups'];
export const ELEMENT_RESERVED_PROPERTIES = [
  'id',
  'isBackground',
  'isDefaultBackground',
];
