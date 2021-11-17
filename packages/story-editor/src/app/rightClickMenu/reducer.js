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

export const ACTION_TYPES = {
  COPY_ELEMENT_STYLES: 'COPY_ELEMENT_STYLES',
  OPEN_MENU: 'OPEN_MENU',
  CLOSE_MENU: 'CLOSE_MENU',
  RESET: 'RESET',
};

export const DEFAULT_RIGHT_CLICK_MENU_STATE = {
  copiedElement: {
    animations: null,
    styles: null,
    type: null,
  },
  isMenuOpen: false,
  menuPosition: {
    x: 0,
    y: 0,
  },
};

// TODO: check if we need to add tracking events when we come back to right click menu.
function rightClickMenuReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.CLOSE_MENU:
      return {
        ...state,
        isMenuOpen: false,
        menuPosition: DEFAULT_RIGHT_CLICK_MENU_STATE.menuPosition,
      };
    case ACTION_TYPES.COPY_ELEMENT_STYLES:
      return {
        ...state,
        copiedElement: {
          animations: action.payload.animations,
          styles: action.payload.styles,
          type: action.payload.type,
        },
      };
    case ACTION_TYPES.OPEN_MENU:
      return {
        ...state,
        isMenuOpen: true,
        menuPosition: action.payload,
      };
    case ACTION_TYPES.RESET:
      return {
        ...DEFAULT_RIGHT_CLICK_MENU_STATE,
      };
    default:
      return state;
  }
}

export default rightClickMenuReducer;
