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
 * External dependencies
 */
import type { Dispatch } from 'react';
import type { Element } from '@googleforcreators/types';

/**
 * Internal dependencies
 */
import type {
  AddAnimationsProps,
  AddElementsAcrossPagesProps,
  AddElementsProps,
  AddGroupProps,
  AddPageProps,
  ArrangeElementProps,
  ArrangeGroupProps,
  ArrangePageProps,
  CombineElementsProps,
  DeleteElementsByResourceIdProps,
  DeleteElementsProps,
  DeleteGroupProps,
  DeletePageProps,
  DuplicateElementsByIdProps,
  DuplicateGroupProps,
  ReducerActionProps,
  RemoveElementFromGroupProps,
  RestoreProps,
  SelectElementProps,
  SetBackgroundElementProps,
  SetCurrentPageProps,
  SetSelectedElementsProps,
  ToggleElementInSelectionProps,
  ToggleLayerProps,
  UnselectElementProps,
  UpdateAnimationStateProps,
  UpdateElementsByFontFamilyProps,
  UpdateElementsByResourceIdProps,
  UpdateElementsProps,
  UpdateGroupProps,
  UpdatePageProps,
  UpdateStoryProps,
} from '../../../types/storyProvider';
import * as types from './types';

type DispatchType = Dispatch<ReducerActionProps>;
// Exposed actions
const addPage =
  (dispatch: DispatchType) =>
  ({ page, position, updateSelection }: AddPageProps) =>
    dispatch({
      type: types.ADD_PAGE,
      payload: { page, position, updateSelection },
    });

const addPageAt =
  (dispatch: DispatchType) =>
  ({ page, position, updateSelection }): AddPageProps =>
    dispatch({
      type: types.ADD_PAGE,
      payload: { page, position, updateSelection },
    });

const deletePage =
  (dispatch: DispatchType) =>
  ({ pageId }: DeletePageProps) =>
    dispatch({ type: types.DELETE_PAGE, payload: { pageId } });

const deleteCurrentPage = (dispatch: DispatchType) => () =>
  dispatch({ type: types.DELETE_PAGE, payload: { pageId: null } });

const updatePageProperties =
  (dispatch: DispatchType) =>
  ({ pageId, properties }: UpdatePageProps) =>
    dispatch({ type: types.UPDATE_PAGE, payload: { pageId, properties } });

const updateCurrentPageProperties =
  (dispatch: DispatchType) =>
  ({ properties }: UpdatePageProps) =>
    dispatch({
      type: types.UPDATE_PAGE,
      payload: { pageId: null, properties },
    });

const arrangePage =
  (dispatch: DispatchType) =>
  ({ pageId, position }: ArrangePageProps) =>
    dispatch({ type: types.ARRANGE_PAGE, payload: { pageId, position } });

const setCurrentPage =
  (dispatch: DispatchType) =>
  ({ pageId }: SetCurrentPageProps) =>
    dispatch({ type: types.SET_CURRENT_PAGE, payload: { pageId } });

const addElements =
  (dispatch: DispatchType) =>
  ({ elements, pageId, updateSelection }: AddElementsProps) =>
    dispatch({
      type: types.ADD_ELEMENTS,
      payload: { elements, pageId, updateSelection },
    });

interface AddElementProps extends Omit<AddElementsProps, 'elements'> {
  element: Element;
}
const addElement =
  (dispatch: DispatchType) =>
  ({ element, pageId, updateSelection }: AddElementProps) =>
    dispatch({
      type: types.ADD_ELEMENTS,
      payload: { elements: [element], pageId, updateSelection },
    });

const deleteElementsById =
  (dispatch: DispatchType) =>
  ({ elementIds }: DeleteElementsProps) =>
    dispatch({ type: types.DELETE_ELEMENTS, payload: { elementIds } });

const deleteSelectedElements = (dispatch: DispatchType) => () =>
  dispatch({ type: types.DELETE_ELEMENTS, payload: { elementIds: null } });

interface DeleteElementProps extends Omit<DeleteElementsProps, 'elementIds'> {
  elementId: string;
}
const deleteElementById =
  (dispatch: DispatchType) =>
  ({ elementId }: DeleteElementProps) =>
    dispatch({
      type: types.DELETE_ELEMENTS,
      payload: { elementIds: [elementId] },
    });

const updateElementsById =
  (dispatch: DispatchType) =>
  ({ elementIds, properties }: UpdateElementsProps) =>
    dispatch({
      type: types.UPDATE_ELEMENTS,
      payload: { elementIds, properties },
    });

const updateElementsByResourceId =
  (dispatch: DispatchType) =>
  ({ id, properties }: UpdateElementsByResourceIdProps) =>
    dispatch({
      type: types.UPDATE_ELEMENTS_BY_RESOURCE_ID,
      payload: { id, properties },
    });

const deleteElementsByResourceId =
  (dispatch: DispatchType) =>
  ({ id }: DeleteElementsByResourceIdProps) =>
    dispatch({
      type: types.DELETE_ELEMENTS_BY_RESOURCE_ID,
      payload: { id },
    });

interface UpdateElementByIdProps
  extends Omit<UpdateElementsProps, 'elementIds'> {
  elementId: string;
}
const updateElementById =
  (dispatch: DispatchType) =>
  ({ elementId, properties }: UpdateElementByIdProps) =>
    dispatch({
      type: types.UPDATE_ELEMENTS,
      payload: { elementIds: [elementId], properties },
    });

const duplicateElementsById =
  (dispatch: DispatchType) =>
  ({ elementIds }: DuplicateElementsByIdProps) =>
    dispatch({
      type: types.DUPLICATE_ELEMENTS_BY_ID,
      payload: { elementIds },
    });

const updateSelectedElements =
  (dispatch: DispatchType) =>
  ({ properties }: UpdateElementsProps) =>
    dispatch({
      type: types.UPDATE_ELEMENTS,
      payload: { elementIds: null, properties },
    });

const combineElements =
  (dispatch: DispatchType) =>
  ({ firstElement, secondId, shouldRetainAnimations }: CombineElementsProps) =>
    dispatch({
      type: types.COMBINE_ELEMENTS,
      payload: { firstElement, secondId, shouldRetainAnimations },
    });

const setBackgroundElement =
  (dispatch: DispatchType) =>
  ({ elementId }: SetBackgroundElementProps) =>
    dispatch({ type: types.SET_BACKGROUND_ELEMENT, payload: { elementId } });

const clearBackgroundElement = (dispatch: DispatchType) => () =>
  dispatch({
    type: types.SET_BACKGROUND_ELEMENT,
    payload: { elementId: null },
  });

const arrangeElement =
  (dispatch: DispatchType) =>
  ({ elementId, position, groupId }: ArrangeElementProps) =>
    dispatch({
      type: types.ARRANGE_ELEMENT,
      payload: { elementId, position, groupId },
    });

const arrangeGroup =
  (dispatch: DispatchType) =>
  ({ groupId, position }: ArrangeGroupProps) =>
    dispatch({ type: types.ARRANGE_GROUP, payload: { groupId, position } });

const arrangeSelection =
  (dispatch: DispatchType) =>
  ({ position, groupId }: ArrangeElementProps) =>
    dispatch({
      type: types.ARRANGE_ELEMENT,
      payload: { elementId: null, position, groupId },
    });

const setSelectedElementsById =
  (dispatch: DispatchType) =>
  ({ elementIds, withLinked }: SetSelectedElementsProps) =>
    dispatch({
      type: types.SET_SELECTED_ELEMENTS,
      payload: { elementIds, withLinked },
    });

const clearSelection = (dispatch: DispatchType) => () =>
  dispatch({ type: types.SET_SELECTED_ELEMENTS, payload: { elementIds: [] } });

const addElementToSelection =
  (dispatch: DispatchType) =>
  ({ elementId }: SelectElementProps) =>
    dispatch({ type: types.SELECT_ELEMENT, payload: { elementId } });

const removeElementFromSelection =
  (dispatch: DispatchType) =>
  ({ elementId }: UnselectElementProps) =>
    dispatch({ type: types.UNSELECT_ELEMENT, payload: { elementId } });

const toggleElementInSelection =
  (dispatch: DispatchType) =>
  ({ elementId, withLinked }: ToggleElementInSelectionProps) =>
    dispatch({
      type: types.TOGGLE_ELEMENT_IN_SELECTION,
      payload: { elementId, withLinked },
    });

const updateStory =
  (dispatch: DispatchType) =>
  ({ properties }: UpdateStoryProps) =>
    dispatch({ type: types.UPDATE_STORY, payload: { properties } });

const updateAnimationState =
  (dispatch: DispatchType) =>
  ({ animationState }: UpdateAnimationStateProps) =>
    dispatch({
      type: types.UPDATE_ANIMATION_STATE,
      payload: { animationState },
    });

const addAnimations =
  (dispatch: DispatchType) =>
  ({ animations }: AddAnimationsProps) =>
    dispatch({ type: types.ADD_ANIMATIONS, payload: { animations } });

const toggleLayer =
  (dispatch: DispatchType) =>
  ({ metaKey, shiftKey, elementId, withLinked }: ToggleLayerProps) =>
    dispatch({
      type: types.TOGGLE_LAYER,
      payload: { metaKey, shiftKey, elementId, withLinked },
    });

const copySelectedElement = (dispatch: DispatchType) => () =>
  dispatch({
    type: types.COPY_SELECTED_ELEMENT,
    payload: null,
  });

const updateElementsByFontFamily =
  (dispatch: DispatchType) =>
  ({ family, properties }: UpdateElementsByFontFamilyProps) =>
    dispatch({
      type: types.UPDATE_ELEMENTS_BY_FONT_FAMILY,
      payload: { family, properties },
    });

const addGroup =
  (dispatch: DispatchType) =>
  ({ groupId, name, isLocked }: AddGroupProps) =>
    dispatch({ type: types.ADD_GROUP, payload: { groupId, name, isLocked } });

const updateGroupById =
  (dispatch: DispatchType) =>
  ({ groupId, properties }: UpdateGroupProps) =>
    dispatch({
      type: types.UPDATE_GROUP,
      payload: { groupId, properties },
    });

const deleteGroupById =
  (dispatch: DispatchType) =>
  ({ groupId }: DeleteGroupProps) =>
    dispatch({
      type: types.DELETE_GROUP,
      payload: { groupId },
    });

const deleteGroupAndElementsById =
  (dispatch: DispatchType) =>
  ({ groupId }: DeleteGroupProps) =>
    dispatch({
      type: types.DELETE_GROUP,
      payload: { groupId, includeElements: true },
    });

const duplicateGroupById =
  (dispatch: DispatchType) =>
  ({ groupId, name, oldGroupId, isLocked }: DuplicateGroupProps) =>
    dispatch({
      type: types.DUPLICATE_GROUP,
      payload: { groupId, name, oldGroupId, isLocked },
    });

const removeElementFromGroup =
  (dispatch: DispatchType) =>
  ({ elementId, groupId }: RemoveElementFromGroupProps) =>
    dispatch({
      type: types.REMOVE_ELEMENT_FROM_GROUP,
      payload: { elementId, groupId },
    });

const addElementsAcrossPages =
  (dispatch: DispatchType) =>
  ({ elements, page, position }: AddElementsAcrossPagesProps) =>
    dispatch({
      type: types.ADD_ELEMENTS_ACROSS_PAGES,
      payload: { elements, page, position },
    });

export const exposedActions = {
  addPage,
  addPageAt,
  copySelectedElement,
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
  deleteElementsByResourceId,
  updateElementById,
  duplicateElementsById,
  updateSelectedElements,
  combineElements,
  setBackgroundElement,
  clearBackgroundElement,
  arrangeElement,
  arrangeGroup,
  arrangeSelection,
  setSelectedElementsById,
  clearSelection,
  addElementToSelection,
  removeElementFromSelection,
  toggleElementInSelection,
  updateAnimationState,
  addAnimations,
  updateStory,
  toggleLayer,
  updateElementsByFontFamily,
  addGroup,
  updateGroupById,
  deleteGroupById,
  deleteGroupAndElementsById,
  duplicateGroupById,
  removeElementFromGroup,
  addElementsAcrossPages,
};

// Internal actions
const restore =
  (dispatch: DispatchType) =>
  ({ pages, selection, current, story, capabilities }: RestoreProps) =>
    dispatch({
      type: types.RESTORE,
      payload: { pages, selection, current, story, capabilities },
    });

export const internalActions = {
  restore,
};
