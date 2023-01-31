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

/**
 * Internal dependencies
 */
import type {
  AddAnimationsProps,
  AddElementsAcrossPagesProps,
  AddElementProps,
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
} from '../../../types';
import { ActionTypes } from './types';

export type DispatchType = Dispatch<ReducerActionProps>;
// Exposed actions
const addPage =
  (dispatch: DispatchType) =>
  ({ page, position, updateSelection }: AddPageProps) =>
    dispatch({
      type: ActionTypes.AddPage,
      payload: { page, position, updateSelection },
    });

const addPageAt =
  (dispatch: DispatchType) =>
  ({ page, position, updateSelection }: AddPageProps) =>
    dispatch({
      type: ActionTypes.AddPage,
      payload: { page, position, updateSelection },
    });

const deletePage =
  (dispatch: DispatchType) =>
  ({ pageId }: DeletePageProps) =>
    dispatch({ type: ActionTypes.DeletePage, payload: { pageId } });

const deleteCurrentPage = (dispatch: DispatchType) => () =>
  dispatch({ type: ActionTypes.DeletePage, payload: { pageId: null } });

const updatePageProperties =
  (dispatch: DispatchType) =>
  ({ pageId, properties }: UpdatePageProps) =>
    dispatch({ type: ActionTypes.UpdatePage, payload: { pageId, properties } });

const updateCurrentPageProperties =
  (dispatch: DispatchType) =>
  ({ properties }: UpdatePageProps) =>
    dispatch({
      type: ActionTypes.UpdatePage,
      payload: { pageId: null, properties },
    });

const arrangePage =
  (dispatch: DispatchType) =>
  ({ pageId, position }: ArrangePageProps) =>
    dispatch({ type: ActionTypes.ArrangePage, payload: { pageId, position } });

const setCurrentPage =
  (dispatch: DispatchType) =>
  ({ pageId }: SetCurrentPageProps) =>
    dispatch({ type: ActionTypes.SetCurrentPage, payload: { pageId } });

const addElements =
  (dispatch: DispatchType) =>
  ({ elements, pageId, updateSelection }: AddElementsProps) =>
    dispatch({
      type: ActionTypes.AddElements,
      payload: { elements, pageId, updateSelection },
    });

const addElement =
  (dispatch: DispatchType) =>
  ({ element, pageId, updateSelection }: AddElementProps) =>
    dispatch({
      type: ActionTypes.AddElements,
      payload: { elements: [element], pageId, updateSelection },
    });

const deleteElementsById =
  (dispatch: DispatchType) =>
  ({ elementIds }: DeleteElementsProps) =>
    dispatch({ type: ActionTypes.DeleteElements, payload: { elementIds } });

const deleteSelectedElements = (dispatch: DispatchType) => () =>
  dispatch({ type: ActionTypes.DeleteElements, payload: { elementIds: null } });

interface DeleteElementProps extends Omit<DeleteElementsProps, 'elementIds'> {
  elementId: string;
}
const deleteElementById =
  (dispatch: DispatchType) =>
  ({ elementId }: DeleteElementProps) =>
    dispatch({
      type: ActionTypes.DeleteElements,
      payload: { elementIds: [elementId] },
    });

const updateElementsById =
  (dispatch: DispatchType) =>
  ({ elementIds, properties }: UpdateElementsProps) =>
    dispatch({
      type: ActionTypes.UpdateElements,
      payload: { elementIds, properties },
    });

const updateElementsByResourceId =
  (dispatch: DispatchType) =>
  ({ id, properties }: UpdateElementsByResourceIdProps) =>
    dispatch({
      type: ActionTypes.UpdateElementsByResourceId,
      payload: { id, properties },
    });

const deleteElementsByResourceId =
  (dispatch: DispatchType) =>
  ({ id }: DeleteElementsByResourceIdProps) =>
    dispatch({
      type: ActionTypes.DeleteElementsByResourceId,
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
      type: ActionTypes.UpdateElements,
      payload: { elementIds: [elementId], properties },
    });

const duplicateElementsById =
  (dispatch: DispatchType) =>
  ({ elementIds }: DuplicateElementsByIdProps) =>
    dispatch({
      type: ActionTypes.DuplicateElementsById,
      payload: { elementIds },
    });

const updateSelectedElements =
  (dispatch: DispatchType) =>
  ({ properties }: UpdateElementsProps) =>
    dispatch({
      type: ActionTypes.UpdateElements,
      payload: { elementIds: null, properties },
    });

const combineElements =
  (dispatch: DispatchType) =>
  ({ firstElement, secondId, shouldRetainAnimations }: CombineElementsProps) =>
    dispatch({
      type: ActionTypes.CombineElements,
      payload: { firstElement, secondId, shouldRetainAnimations },
    });

const setBackgroundElement =
  (dispatch: DispatchType) =>
  ({ elementId }: SetBackgroundElementProps) =>
    dispatch({
      type: ActionTypes.SetBackgroundElement,
      payload: { elementId },
    });

const clearBackgroundElement = (dispatch: DispatchType) => () =>
  dispatch({
    type: ActionTypes.SetBackgroundElement,
    payload: { elementId: null },
  });

const arrangeElement =
  (dispatch: DispatchType) =>
  ({ elementId, position, groupId }: ArrangeElementProps) =>
    dispatch({
      type: ActionTypes.ArrangeElement,
      payload: { elementId, position, groupId },
    });

const arrangeGroup =
  (dispatch: DispatchType) =>
  ({ groupId, position }: ArrangeGroupProps) =>
    dispatch({
      type: ActionTypes.ArrangeGroup,
      payload: { groupId, position },
    });

const arrangeSelection =
  (dispatch: DispatchType) =>
  ({ position, groupId }: ArrangeElementProps) =>
    dispatch({
      type: ActionTypes.ArrangeElement,
      payload: { elementId: null, position, groupId },
    });

const setSelectedElementsById =
  (dispatch: DispatchType) =>
  ({ elementIds, withLinked }: SetSelectedElementsProps) =>
    dispatch({
      type: ActionTypes.SetSelectedElements,
      payload: { elementIds, withLinked },
    });

const clearSelection = (dispatch: DispatchType) => () =>
  dispatch({
    type: ActionTypes.SetSelectedElements,
    payload: { elementIds: [] },
  });

const addElementToSelection =
  (dispatch: DispatchType) =>
  ({ elementId }: SelectElementProps) =>
    dispatch({ type: ActionTypes.SelectElement, payload: { elementId } });

const removeElementFromSelection =
  (dispatch: DispatchType) =>
  ({ elementId }: UnselectElementProps) =>
    dispatch({ type: ActionTypes.UnselectElement, payload: { elementId } });

const toggleElementInSelection =
  (dispatch: DispatchType) =>
  ({ elementId, withLinked }: ToggleElementInSelectionProps) =>
    dispatch({
      type: ActionTypes.ToggleElementInSelection,
      payload: { elementId, withLinked },
    });

const updateStory =
  (dispatch: DispatchType) =>
  ({ properties }: UpdateStoryProps) =>
    dispatch({ type: ActionTypes.UpdateStory, payload: { properties } });

const updateAnimationState =
  (dispatch: DispatchType) =>
  ({ animationState }: UpdateAnimationStateProps) =>
    dispatch({
      type: ActionTypes.UpdateAnimationState,
      payload: { animationState },
    });

const addAnimations =
  (dispatch: DispatchType) =>
  ({ animations }: AddAnimationsProps) =>
    dispatch({ type: ActionTypes.AddAnimations, payload: { animations } });

const toggleLayer =
  (dispatch: DispatchType) =>
  ({ metaKey, shiftKey, elementId, withLinked }: ToggleLayerProps) =>
    dispatch({
      type: ActionTypes.ToggleLayer,
      payload: { metaKey, shiftKey, elementId, withLinked },
    });

const copySelectedElement = (dispatch: DispatchType) => () =>
  dispatch({
    type: ActionTypes.CopySelectedElement,
    payload: null,
  });

const updateElementsByFontFamily =
  (dispatch: DispatchType) =>
  ({ family, properties }: UpdateElementsByFontFamilyProps) =>
    dispatch({
      type: ActionTypes.UpdateElementsByFontFamily,
      payload: { family, properties },
    });

const addGroup =
  (dispatch: DispatchType) =>
  ({ groupId, name, isLocked }: AddGroupProps) =>
    dispatch({
      type: ActionTypes.AddGroup,
      payload: { groupId, name, isLocked },
    });

const updateGroupById =
  (dispatch: DispatchType) =>
  ({ groupId, properties }: UpdateGroupProps) =>
    dispatch({
      type: ActionTypes.UpdateGroup,
      payload: { groupId, properties },
    });

const deleteGroupById =
  (dispatch: DispatchType) =>
  ({ groupId }: DeleteGroupProps) =>
    dispatch({
      type: ActionTypes.DeleteGroup,
      payload: { groupId },
    });

const deleteGroupAndElementsById =
  (dispatch: DispatchType) =>
  ({ groupId }: DeleteGroupProps) =>
    dispatch({
      type: ActionTypes.DeleteGroup,
      payload: { groupId, includeElements: true },
    });

const duplicateGroupById =
  (dispatch: DispatchType) =>
  ({ groupId, name, oldGroupId, isLocked }: DuplicateGroupProps) =>
    dispatch({
      type: ActionTypes.DuplicateGroup,
      payload: { groupId, name, oldGroupId, isLocked },
    });

const removeElementFromGroup =
  (dispatch: DispatchType) =>
  ({ elementId, groupId }: RemoveElementFromGroupProps) =>
    dispatch({
      type: ActionTypes.RemoveElementFromGroup,
      payload: { elementId, groupId },
    });

const addElementsAcrossPages =
  (dispatch: DispatchType) =>
  ({ elements, page, position }: AddElementsAcrossPagesProps) =>
    dispatch({
      type: ActionTypes.AddElementsAcrossPages,
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
      type: ActionTypes.Restore,
      payload: { pages, selection, current, story, capabilities },
    });

export const internalActions = {
  restore,
};
