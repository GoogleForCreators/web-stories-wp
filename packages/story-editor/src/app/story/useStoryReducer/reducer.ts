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
import type { ReducerActionProps, ReducerState } from '../../../types';
import { ActionTypes } from './types';
import * as reducers from './reducers';

// eslint-disable-next-line complexity -- reducer function, negligible.
function reducer(
  state: ReducerState,
  { type, payload }: ReducerActionProps
): ReducerState {
  switch (type) {
    case ActionTypes.AddPage: {
      return reducers.addPage(state, payload);
    }

    case ActionTypes.DeletePage: {
      return reducers.deletePage(state, payload);
    }

    case ActionTypes.UpdatePage: {
      return reducers.updatePage(state, payload);
    }

    case ActionTypes.ArrangePage: {
      return reducers.arrangePage(state, payload);
    }

    case ActionTypes.SetCurrentPage: {
      return reducers.setCurrentPage(state, payload);
    }

    case ActionTypes.AddElements: {
      return reducers.addElements(state, payload);
    }

    case ActionTypes.DeleteElements: {
      return reducers.deleteElements(state, payload);
    }

    case ActionTypes.UpdateElements: {
      return reducers.updateElements(state, payload);
    }

    case ActionTypes.UpdateElementsByResourceId: {
      return reducers.updateElementsByResourceId(state, payload);
    }

    case ActionTypes.DeleteElementsByResourceId: {
      return reducers.deleteElementsByResourceId(state, payload);
    }

    case ActionTypes.CombineElements: {
      return reducers.combineElements(state, payload);
    }

    case ActionTypes.SetBackgroundElement: {
      return reducers.setBackgroundElement(state, payload);
    }

    case ActionTypes.ArrangeElement: {
      return reducers.arrangeElement(state, payload);
    }

    case ActionTypes.ArrangeGroup: {
      return reducers.arrangeGroup(state, payload);
    }

    case ActionTypes.SetSelectedElements: {
      return reducers.setSelectedElements(state, payload);
    }

    case ActionTypes.SelectElement: {
      return reducers.selectElement(state, payload);
    }

    case ActionTypes.UnselectElement: {
      return reducers.unselectElement(state, payload);
    }

    case ActionTypes.ToggleElementInSelection: {
      return reducers.toggleElement(state, payload);
    }

    case ActionTypes.ToggleLayer: {
      return reducers.toggleLayer(state, payload);
    }

    case ActionTypes.DuplicateElementsById: {
      return reducers.duplicateElementsById(state, payload);
    }

    case ActionTypes.UpdateStory: {
      return reducers.updateStory(state, payload);
    }

    case ActionTypes.UpdateAnimationState: {
      return reducers.updateAnimationState(state, payload);
    }

    case ActionTypes.AddAnimations: {
      return reducers.addAnimations(state, payload);
    }

    case ActionTypes.CopySelectedElement: {
      return reducers.copySelectedElement(state);
    }

    case ActionTypes.Restore: {
      return reducers.restore(state, payload);
    }

    case ActionTypes.UpdateElementsByFontFamily: {
      return reducers.updateElementsByFontFamily(state, payload);
    }

    case ActionTypes.AddGroup: {
      return reducers.addGroup(state, payload);
    }

    case ActionTypes.UpdateGroup: {
      return reducers.updateGroup(state, payload);
    }

    case ActionTypes.DeleteGroup: {
      return reducers.deleteGroup(state, payload);
    }

    case ActionTypes.DuplicateGroup: {
      return reducers.duplicateGroup(state, payload);
    }

    case ActionTypes.RemoveElementFromGroup: {
      return reducers.removeElementFromGroup(state, payload);
    }

    case ActionTypes.AddElementsAcrossPages: {
      return reducers.addElementsAcrossPages(state, payload);
    }

    default:
      return state;
  }
}

export default reducer;
