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
 * Internal dependencies
 */
import * as types from './types';

// Exposed actions
const addPage = (dispatch) => ({ page }) =>
  dispatch({ type: types.ADD_PAGE, payload: { page, position: null } });

const addPageAt = (dispatch) => ({ page, position }) =>
  dispatch({ type: types.ADD_PAGE, payload: { page, position } });

const deletePage = (dispatch) => ({ pageId }) =>
  dispatch({ type: types.DELETE_PAGE, payload: { pageId } });

const deleteCurrentPage = (dispatch) => () =>
  dispatch({ type: types.DELETE_PAGE, payload: { pageId: null } });

const updatePageProperties = (dispatch) => ({ pageId, properties }) =>
  dispatch({ type: types.UPDATE_PAGE, payload: { pageId, properties } });

const updateCurrentPageProperties = (dispatch) => ({ properties }) =>
  dispatch({ type: types.UPDATE_PAGE, payload: { pageId: null, properties } });

const arrangePage = (dispatch) => ({ pageId, position }) =>
  dispatch({ type: types.ARRANGE_PAGE, payload: { pageId, position } });

const setCurrentPage = (dispatch) => ({ pageId }) =>
  dispatch({ type: types.SET_CURRENT_PAGE, payload: { pageId } });

const addElements = (dispatch) => ({ elements }) =>
  dispatch({ type: types.ADD_ELEMENTS, payload: { elements } });

const addElement = (dispatch) => ({ element }) =>
  dispatch({ type: types.ADD_ELEMENTS, payload: { elements: [element] } });

const deleteElementsById = (dispatch) => ({ elementIds }) =>
  dispatch({ type: types.DELETE_ELEMENTS, payload: { elementIds } });

const deleteSelectedElements = (dispatch) => () =>
  dispatch({ type: types.DELETE_ELEMENTS, payload: { elementIds: null } });

const deleteElementById = (dispatch) => ({ elementId }) =>
  dispatch({
    type: types.DELETE_ELEMENTS,
    payload: { elementIds: [elementId] },
  });

const updateElementsById = (dispatch) => ({ elementIds, properties }) =>
  dispatch({
    type: types.UPDATE_ELEMENTS,
    payload: { elementIds, properties },
  });

const updateElementsByResourceId = (dispatch) => ({ id, properties }) =>
  dispatch({
    type: types.UPDATE_ELEMENTS_BY_RESOURCE_ID,
    payload: { id, properties },
  });

const updateElementById = (dispatch) => ({ elementId, properties }) =>
  dispatch({
    type: types.UPDATE_ELEMENTS,
    payload: { elementIds: [elementId], properties },
  });

const updateSelectedElements = (dispatch) => ({ properties }) =>
  dispatch({
    type: types.UPDATE_ELEMENTS,
    payload: { elementIds: null, properties },
  });

const combineElements = (dispatch) => ({ firstElement, secondId }) =>
  dispatch({
    type: types.COMBINE_ELEMENTS,
    payload: { firstElement, secondId },
  });

const setBackgroundElement = (dispatch) => ({ elementId }) =>
  dispatch({ type: types.SET_BACKGROUND_ELEMENT, payload: { elementId } });

const clearBackgroundElement = (dispatch) => () =>
  dispatch({
    type: types.SET_BACKGROUND_ELEMENT,
    payload: { elementId: null },
  });

const arrangeElement = (dispatch) => ({ elementId, position }) =>
  dispatch({ type: types.ARRANGE_ELEMENT, payload: { elementId, position } });

const arrangeSelection = (dispatch) => ({ position }) =>
  dispatch({
    type: types.ARRANGE_ELEMENT,
    payload: { elementId: null, position },
  });

const setSelectedElementsById = (dispatch) => ({ elementIds }) =>
  dispatch({ type: types.SET_SELECTED_ELEMENTS, payload: { elementIds } });

const clearSelection = (dispatch) => () =>
  dispatch({ type: types.SET_SELECTED_ELEMENTS, payload: { elementIds: [] } });

const addElementToSelection = (dispatch) => ({ elementId }) =>
  dispatch({ type: types.SELECT_ELEMENT, payload: { elementId } });

const removeElementFromSelection = (dispatch) => ({ elementId }) =>
  dispatch({ type: types.UNSELECT_ELEMENT, payload: { elementId } });

const toggleElementInSelection = (dispatch) => ({ elementId }) =>
  dispatch({ type: types.TOGGLE_ELEMENT_IN_SELECTION, payload: { elementId } });

const updateStory = (dispatch) => ({ properties }) =>
  dispatch({ type: types.UPDATE_STORY, payload: { properties } });

const updateAnimationState = (dispatch) => ({ animationState }) =>
  dispatch({ type: types.UPDATE_ANIMATION_STATE, payload: { animationState } });

const addAnimations = (dispatch) => ({ animations }) =>
  dispatch({ type: types.ADD_ANIMATIONS, payload: { animations } });

export const exposedActions = {
  addPage,
  addPageAt,
  deletePage,
  deleteCurrentPage,
  updatePageProperties,
  updateCurrentPageProperties,
  arrangePage,
  setCurrentPage,
  addElements,
  addElement,
  deleteElementsById,
  deleteElementById,
  deleteSelectedElements,
  updateElementsById,
  updateElementsByResourceId,
  updateElementById,
  updateSelectedElements,
  combineElements,
  setBackgroundElement,
  clearBackgroundElement,
  arrangeElement,
  arrangeSelection,
  setSelectedElementsById,
  clearSelection,
  addElementToSelection,
  removeElementFromSelection,
  toggleElementInSelection,
  updateAnimationState,
  addAnimations,
  updateStory,
};

// Internal actions
const restore = (dispatch) => ({ pages, selection, current, story }) =>
  dispatch({
    type: types.RESTORE,
    payload: { pages, selection, current, story },
  });

export const internalActions = {
  restore,
};
