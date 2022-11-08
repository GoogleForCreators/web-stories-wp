/*
 * Copyright 2022 Google LLC
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
import type {Page, Element, ResourceId} from '@googleforcreators/types';

/**
 * Internal dependencies
 */
import type * as actionTypes from '../app/story/useStoryReducer/types';

export type AddPageProps = {
  page: Page;
  position: null | number;
  updateSelection: boolean;
};
export type AddPageAction = {
  type: typeof actionTypes.ADD_PAGE;
  payload: AddPageProps;
};

export type DeletePageProps = {
  pageId: string | null;
};
export type DeletePageAction = {
  type: typeof actionTypes.DELETE_PAGE;
  payload: DeletePageProps;
};

export type UpdatePageProps = {
  pageId: string | null;
  properties: Partial<Page>;
};
export type UpdatePageAction = {
  type: typeof actionTypes.UPDATE_PAGE;
  payload: UpdatePageProps;
};

export type ArrangePageProps = {
  pageId: string;
  position: number;
};
export type ArrangePageAction = {
  type: typeof actionTypes.ARRANGE_PAGE;
  payload: ArrangePageProps;
};

export type SetCurrentPageProps = {
  pageId: string;
};
export type SetCurrentPagePageAction = {
  type: typeof actionTypes.SET_CURRENT_PAGE;
  payload: SetCurrentPageProps;
};

export type AddElementsProps = {
  elements: Element[];
  pageId: string;
  updateSelection: boolean;
};

export type AddElementsAction = {
  type: typeof actionTypes.ADD_ELEMENTS;
  payload: AddElementsProps;
};

export type DeleteElementsProps = {
  elementIds: string[];
};
export type DeleteElementsAction = {
  type: typeof actionTypes.DELETE_ELEMENTS;
  payload: DeleteElementsProps;
};

type ElementUpdater = (prevProps: Element) => Element;
export type UpdateElementsProps = {
  elementIds: string[];
  properties: Partial<Element> | ElementUpdater;
};
export type UpdateElementsAction = {
  type: typeof actionTypes.UPDATE_ELEMENTS;
  payload: UpdateElementsProps;
};

export type UpdateElementsByResourceIdProps = {
  id: ResourceId;
  properties: Partial<Element> | ElementUpdater;
};
export type UpdateElementsByResourceIdAction = {
  type: typeof actionTypes.UPDATE_ELEMENTS_BY_RESOURCE_ID;
  payload: UpdateElementsByResourceIdProps;
};

export type DeleteElementsByResourceIdProps = {
  id: ResourceId;
};
export type DeleteElementsByResourceIdAction = {
  type: typeof actionTypes.DELETE_ELEMENTS_BY_RESOURCE_ID;
  payload: DeleteElementsByResourceIdProps;
};

export type CombineElementsProps = {
  firstElement: Element;
  secondId: string;
  shouldRetainAnimations: boolean;
};
export type CombineElementsAction = {
  type: typeof actionTypes.COMBINE_ELEMENTS;
  payload: CombineElementsProps;
};

export type SetBackgroundElementProps = {};
export type SetBackgroundElementAction = {
  type: typeof actionTypes.SET_BACKGROUND_ELEMENT;
  payload: SetBackgroundElementProps;
};

export type ArrangeElementProps = {};
export type ArrangeElementAction = {
  type: typeof actionTypes.ARRANGE_ELEMENT;
  payload: ArrangeElementProps;
};

export type ArrangeGroupProps = {};
export type ArrangeGroupAction = {
  type: typeof actionTypes.ARRANGE_GROUP;
  payload: ArrangeGroupProps;
};

export type SetSelectedElementsProps = {};
export type SetSelectedElementsAction = {
  type: typeof actionTypes.SET_SELECTED_ELEMENTS;
  payload: SetSelectedElementsProps;
};

export type SelectElementProps = {};
export type SelectElementAction = {
  type: typeof actionTypes.SELECT_ELEMENT;
  payload: SelectElementProps;
};

export type UnselectElementProps = {};
export type UnselectElementAction = {
  type: typeof actionTypes.UNSELECT_ELEMENT;
  payload: UnselectElementProps;
};

export type ToggleElementInSelectionProps = {};
export type ToggleElementInSelectionAction = {
  type: typeof actionTypes.TOGGLE_ELEMENT_IN_SELECTION;
  payload: ToggleElementInSelectionProps;
};

export type ToggleLayerProps = {};
export type ToggleLayerAction = {
  type: typeof actionTypes.TOGGLE_LAYER;
  payload: ToggleLayerProps;
};

export type DuplicateElementsByIdProps = {};
export type DuplicateElementsByIdAction = {
  type: typeof actionTypes.DUPLICATE_ELEMENTS_BY_ID;
  payload: DuplicateElementsByIdProps;
};

export type UpdateStoryProps = {};
export type UpdateStoryAction = {
  type: typeof actionTypes.UPDATE_STORY;
  payload: UpdateStoryProps;
};

export type UpdateAnimationStateProps = {};
export type UpdateAnimationStateAction = {
  type: typeof actionTypes.UPDATE_ANIMATION_STATE;
  payload: ArrangePageProps;
};

export type AddAnimationsProps = {};
export type AddAnimationsAction = {
  type: typeof actionTypes.ADD_ANIMATIONS;
  payload: AddAnimationsProps;
};

export type CopySelectedElementProps = {};
export type CopySelectedElementAction = {
  type: typeof actionTypes.COPY_SELECTED_ELEMENT;
  payload: CopySelectedElementProps;
};

export type RestoreProps = {};
export type RestoreAction = {
  type: typeof actionTypes.RESTORE;
  payload: RestoreProps;
};

export type UpdateElementsByFontFamilyProps = {};
export type UpdateElementsByFontFamilyAction = {
  type: typeof actionTypes.UPDATE_ELEMENTS_BY_FONT_FAMILY;
  payload: UpdateElementsByFontFamilyProps;
};

export type AddGroupProps = {};
export type AddGroupAction = {
  type: typeof actionTypes.ADD_GROUP;
  payload: AddGroupProps;
};

export type UpdateGroupProps = {};
export type UpdateGroupAction = {
  type: typeof actionTypes.UPDATE_GROUP;
  payload: UpdateGroupProps;
};

export type DeleteGroupProps = {};
export type DeleteGroupAction = {
  type: typeof actionTypes.DELETE_GROUP;
  payload: DeleteGroupProps;
};

export type DuplicateGroupProps = {};
export type DuplicateGroupAction = {
  type: typeof actionTypes.DUPLICATE_GROUP;
  payload: DuplicateGroupProps;
};

export type RemoveElementFromGroupProps = {};
export type RemoveElementFromGroupAction = {
  type: typeof actionTypes.REMOVE_ELEMENT_FROM_GROUP;
  payload: RemoveElementFromGroupProps;
};

export type AddElementsAcrossPagesProps = {};
export type AddElementsAcrossPagesAction = {
  type: typeof actionTypes.ADD_ELEMENTS_ACROSS_PAGES;
  payload: AddElementsAcrossPagesProps;
};

export type ReducerActionProps =
  | AddPageAction
  | DeletePageAction
  | UpdatePageAction
  | ArrangePageAction
  | SetCurrentPagePageAction
  | AddElementsAction
  | DeleteElementsAction
  | UpdateElementsAction
  | UpdateElementsByResourceIdAction
  | DeleteElementsByResourceIdAction
  | CombineElementsAction
  | SetBackgroundElementAction
  | ArrangeElementAction
  | ArrangeGroupAction
  | SetSelectedElementsAction
  | SelectElementAction
  | UnselectElementAction
  | ToggleElementInSelectionAction
  | ToggleLayerAction
  | DuplicateElementsByIdAction
  | UpdateStoryAction
  | UpdateAnimationStateAction
  | AddAnimationsAction
  | CopySelectedElementAction
  | RestoreAction
  | UpdateElementsByFontFamilyAction
  | AddGroupAction
  | UpdateGroupAction
  | DeleteGroupAction
  | DuplicateGroupAction
  | RemoveElementFromGroupAction
  | AddElementsAcrossPagesAction;
