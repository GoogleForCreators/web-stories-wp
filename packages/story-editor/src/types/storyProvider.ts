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
import type {
  Page,
  Element,
  Animation,
  Group,
} from '@googleforcreators/elements';
import type { ResourceId } from '@googleforcreators/media';
/**
 * Internal dependencies
 */
import type * as actionTypes from '../app/story/useStoryReducer/types';
import type { Story, StorySaveData } from './story';
import type { Capabilities } from './configProvider';

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
  elementIds: string[] | null;
};
export type DeleteElementsAction = {
  type: typeof actionTypes.DELETE_ELEMENTS;
  payload: DeleteElementsProps;
};

export type ElementUpdater = (prevProps: Element) => Element;
export type UpdateElementsProps = {
  elementIds: string[] | null;
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

export type SetBackgroundElementProps = {
  elementId: string | null;
};
export type SetBackgroundElementAction = {
  type: typeof actionTypes.SET_BACKGROUND_ELEMENT;
  payload: SetBackgroundElementProps;
};

export type ArrangeElementProps = {
  elementId: string | null;
  position: number | string;
  groupId?: string | boolean;
};
export type ArrangeElementAction = {
  type: typeof actionTypes.ARRANGE_ELEMENT;
  payload: ArrangeElementProps;
};

export type ArrangeGroupProps = {
  groupId: string;
  position: number | string;
};
export type ArrangeGroupAction = {
  type: typeof actionTypes.ARRANGE_GROUP;
  payload: ArrangeGroupProps;
};

type ElementIdsFunc = (props: string[]) => string[];
export type SetSelectedElementsProps = {
  elementIds: string[] | ElementIdsFunc;
  withLinked?: boolean;
};
export type SetSelectedElementsAction = {
  type: typeof actionTypes.SET_SELECTED_ELEMENTS;
  payload: SetSelectedElementsProps;
};

export type SelectElementProps = {
  elementId: string;
};
export type SelectElementAction = {
  type: typeof actionTypes.SELECT_ELEMENT;
  payload: SelectElementProps;
};

export type UnselectElementProps = {
  elementId: string;
};
export type UnselectElementAction = {
  type: typeof actionTypes.UNSELECT_ELEMENT;
  payload: UnselectElementProps;
};

export type ToggleElementInSelectionProps = {
  elementId: string;
  withLinked?: boolean;
};
export type ToggleElementInSelectionAction = {
  type: typeof actionTypes.TOGGLE_ELEMENT_IN_SELECTION;
  payload: ToggleElementInSelectionProps;
};

export type ToggleLayerProps = {
  elementId: string;
  metaKey: boolean;
  shiftKey: boolean;
  withLinked?: boolean;
};
export type ToggleLayerAction = {
  type: typeof actionTypes.TOGGLE_LAYER;
  payload: ToggleLayerProps;
};

export type DuplicateElementsByIdProps = {
  elementIds: string[];
};
export type DuplicateElementsByIdAction = {
  type: typeof actionTypes.DUPLICATE_ELEMENTS_BY_ID;
  payload: DuplicateElementsByIdProps;
};

type StoryUpdater = (story: Story) => Story;
export type UpdateStoryProps = {
  properties: Partial<Story> | StoryUpdater;
};
export type UpdateStoryAction = {
  type: typeof actionTypes.UPDATE_STORY;
  payload: UpdateStoryProps;
};

export type UpdateAnimationStateProps = {
  animationState: string;
};
export type UpdateAnimationStateAction = {
  type: typeof actionTypes.UPDATE_ANIMATION_STATE;
  payload: UpdateAnimationStateProps;
};

export type AddAnimationsProps = {
  animations: Animation[];
};
export type AddAnimationsAction = {
  type: typeof actionTypes.ADD_ANIMATIONS;
  payload: AddAnimationsProps;
};

export type CopySelectedElementAction = {
  type: typeof actionTypes.COPY_SELECTED_ELEMENT;
  payload: null;
};

export type RestoreProps = Partial<ReducerState>;
export type RestoreAction = {
  type: typeof actionTypes.RESTORE;
  payload: RestoreProps;
};

export type UpdateElementsByFontFamilyProps = {
  family: string;
  properties: Partial<Element> | ElementUpdater;
};
export type UpdateElementsByFontFamilyAction = {
  type: typeof actionTypes.UPDATE_ELEMENTS_BY_FONT_FAMILY;
  payload: UpdateElementsByFontFamilyProps;
};

export type AddGroupProps = {
  groupId: string;
  name: string;
  isLocked?: boolean;
};
export type AddGroupAction = {
  type: typeof actionTypes.ADD_GROUP;
  payload: AddGroupProps;
};

export type UpdateGroupProps = {
  groupId: string;
  properties: Partial<Group>;
};
export type UpdateGroupAction = {
  type: typeof actionTypes.UPDATE_GROUP;
  payload: UpdateGroupProps;
};

export type DeleteGroupProps = { groupId: string; includeElements?: boolean };
export type DeleteGroupAction = {
  type: typeof actionTypes.DELETE_GROUP;
  payload: DeleteGroupProps;
};

export type DuplicateGroupProps = {
  oldGroupId: string;
  groupId: string;
  name: string;
  isLocked: boolean;
};
export type DuplicateGroupAction = {
  type: typeof actionTypes.DUPLICATE_GROUP;
  payload: DuplicateGroupProps;
};

export type RemoveElementFromGroupProps = {
  elementId: string;
  groupId: string;
};
export type RemoveElementFromGroupAction = {
  type: typeof actionTypes.REMOVE_ELEMENT_FROM_GROUP;
  payload: RemoveElementFromGroupProps;
};

export type AddElementsAcrossPagesProps = {
  page: Page;
  position: number;
  elements: Element[];
};
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

export type Restore = (props: RestoreProps) => ReducerState;
export type InternalActions = {
  restore: Restore;
};

interface DeleteElementProps {
  elementId: string;
}
interface UpdateElementProps {
  elementId: string;
  properties: Partial<Element> | ElementUpdater;
}
export type ExternalActions = {
  addAnimations: (props: AddAnimationsProps) => ReducerState;
  updateStory: (props: UpdateStoryProps) => ReducerState;
  addPage: (props: AddPageProps) => ReducerState;
  addPageAt: (props: AddPageProps) => ReducerState;
  copySelectedElement: () => ReducerState;
  deletePage: (props: DeletePageProps) => ReducerState;
  deleteCurrentPage: () => ReducerState;
  updatePageProperties: (props: UpdatePageProps) => ReducerState;
  updateCurrentPageProperties: (props: UpdatePageProps) => ReducerState;
  arrangePage: (props: ArrangePageProps) => ReducerState;
  setCurrentPage: (props: SetCurrentPageProps) => ReducerState;
  addElements: (props: AddElementsProps) => ReducerState;
  addElement: (props: AddElementsProps) => ReducerState;
  deleteElementsById: (props: DeleteElementsProps) => ReducerState;
  deleteElementById: (props: DeleteElementProps) => ReducerState;
  deleteSelectedElements: () => ReducerState;
  updateElementsById: (props: UpdateElementsProps) => ReducerState;
  updateElementsByResourceId: (
    props: UpdateElementsByResourceIdProps
  ) => ReducerState;
  deleteElementsByResourceId: (
    props: DeleteElementsByResourceIdProps
  ) => ReducerState;
  updateElementById: (props: UpdateElementProps) => ReducerState;
  duplicateElementsById: (props: DuplicateElementsByIdAction) => ReducerState;
  updateSelectedElements: (props: UpdateElementsProps) => ReducerState;
  combineElements: (props: CombineElementsProps) => ReducerState;
  setBackgroundElement: (props: SetBackgroundElementProps) => ReducerState;
  clearBackgroundElement: () => ReducerState;
  arrangeElement: (props: ArrangeElementProps) => ReducerState;
  arrangeGroup: (props: ArrangeGroupProps) => ReducerState;
  arrangeSelection: (props: ArrangeElementProps) => ReducerState;
  setSelectedElementsById: (props: SetSelectedElementsProps) => ReducerState;
  clearSelection: () => ReducerState;
  addElementToSelection: (props: SelectElementProps) => ReducerState;
  removeElementFromSelection: (props: UnselectElementProps) => ReducerState;
  toggleElementInSelection: (
    props: ToggleElementInSelectionProps
  ) => ReducerState;
  updateAnimationState: (props: UpdateAnimationStateProps) => ReducerState;
  toggleLayer: (props: ToggleLayerProps) => ReducerState;
  updateElementsByFontFamily: (
    props: UpdateElementsByFontFamilyProps
  ) => ReducerState;
  addGroup: (props: AddGroupProps) => ReducerState;
  updateGroupById: (props: UpdateGroupProps) => ReducerState;
  deleteGroupById: (props: DeleteGroupProps) => ReducerState;
  deleteGroupAndElementsById: (props: DeleteGroupProps) => ReducerState;
  duplicateGroupById: (props: DuplicateGroupProps) => ReducerState;
  removeElementFromGroup: (props: RemoveElementFromGroupProps) => ReducerState;
  addElementsAcrossPages: (props: AddElementsAcrossPagesProps) => ReducerState;
};
export interface ReducerProviderState {
  state: ReducerState;
  internal: InternalActions;
  api: ExternalActions;
}

export interface ReducerState {
  story: Story;
  selection: string[];
  current: string | null;
  pages: Page[];
  animationState: string;
  capabilities: Capabilities;
  copiedElementState?: Element;
}

export interface State extends Omit<ReducerState, 'current' | 'selection'> {
  currentPage: Page | null;
  currentPageId: string | null;
  currentPageIndex: number | null;
  currentPageNumber: number | null;
  selectedElementIds: string[];
  selectedElements: Element[];
  selectedElementAnimations: Animation[];
  hasSelection: boolean;
  meta: {
    isSaving: boolean;
    isSavingStory: boolean;
    isAutoSavingStory: boolean;
    isFreshlyPublished: boolean;
    isFreshlyPending: boolean;
  };
}

interface SaveActions {
  autoSave: (props: Partial<StorySaveData>) => void;
  saveStory: (props: Partial<StorySaveData>) => void;
  restoreLocalAutoSave: () => void;
}
export interface StoryProviderState {
  state: State;
  actions: ExternalActions & SaveActions;
  internal: {
    reducerState: ReducerState;
    restore: Restore;
  };
}
