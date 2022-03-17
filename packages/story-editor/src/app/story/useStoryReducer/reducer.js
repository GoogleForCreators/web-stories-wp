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
import * as reducers from './reducers';

// eslint-disable-next-line complexity -- reducer function, negligible.
function reducer(state, { type, payload }) {
  switch (type) {
    case types.ADD_PAGE: {
      return reducers.addPage(state, payload);
    }

    case types.DELETE_PAGE: {
      return reducers.deletePage(state, payload);
    }

    case types.UPDATE_PAGE: {
      return reducers.updatePage(state, payload);
    }

    case types.ARRANGE_PAGE: {
      return reducers.arrangePage(state, payload);
    }

    case types.SET_CURRENT_PAGE: {
      return reducers.setCurrentPage(state, payload);
    }

    case types.ADD_ELEMENTS: {
      return reducers.addElements(state, payload);
    }

    case types.DELETE_ELEMENTS: {
      return reducers.deleteElements(state, payload);
    }

    case types.UPDATE_ELEMENTS: {
      return reducers.updateElements(state, payload);
    }

    case types.UPDATE_ELEMENTS_BY_RESOURCE_ID: {
      return reducers.updateElementsByResourceId(state, payload);
    }

    case types.DELETE_ELEMENTS_BY_RESOURCE_ID: {
      return reducers.deleteElementsByResourceId(state, payload);
    }

    case types.COMBINE_ELEMENTS: {
      return reducers.combineElements(state, payload);
    }

    case types.SET_BACKGROUND_ELEMENT: {
      return reducers.setBackgroundElement(state, payload);
    }

    case types.ARRANGE_ELEMENT: {
      return reducers.arrangeElement(state, payload);
    }

    case types.SET_SELECTED_ELEMENTS: {
      return reducers.setSelectedElements(state, payload);
    }

    case types.SELECT_ELEMENT: {
      return reducers.selectElement(state, payload);
    }

    case types.UNSELECT_ELEMENT: {
      return reducers.unselectElement(state, payload);
    }

    case types.TOGGLE_ELEMENT_IN_SELECTION: {
      return reducers.toggleElement(state, payload);
    }

    case types.TOGGLE_LAYER: {
      return reducers.toggleLayer(state, payload);
    }

    case types.DUPLICATE_ELEMENTS_BY_ID: {
      return reducers.duplicateElementsById(state, payload);
    }

    case types.UPDATE_STORY: {
      return reducers.updateStory(state, payload);
    }

    case types.UPDATE_ANIMATION_STATE: {
      return reducers.updateAnimationState(state, payload);
    }

    case types.ADD_ANIMATIONS: {
      return reducers.addAnimations(state, payload);
    }

    case types.COPY_SELECTED_ELEMENT: {
      return reducers.copySelectedElement(state, payload);
    }

    case types.RESTORE: {
      return reducers.restore(state, payload);
    }

    case types.UPDATE_ELEMENTS_BY_FONT_FAMILY: {
      return reducers.updateElementsByFontFamily(state, payload);
    }

    default:
      return state;
  }
}

export default reducer;
