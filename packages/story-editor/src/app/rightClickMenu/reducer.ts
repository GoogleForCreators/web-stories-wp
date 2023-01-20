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

/**
 * Internal dependencies
 */
import type { MenuPosition } from '../../types';

export enum ActionType {
  OpenMenu = 'OPEN_MENU',
  CloseMenu = 'CLOSE_MENU',
  Reset = 'RESET',
}

export interface State {
  isMenuOpen: boolean;
  menuPosition: MenuPosition;
}

interface Action {
  type: ActionType;
  payload?: MenuPosition;
}

export const DEFAULT_RIGHT_CLICK_MENU_STATE: State = {
  isMenuOpen: false,
  menuPosition: {
    x: 0,
    y: 0,
  },
};

// TODO: check if we need to add tracking events when we come back to right click menu.
function rightClickMenuReducer(state: State, action: Action): State {
  switch (action.type) {
    case ActionType.CloseMenu:
      return {
        ...state,
        isMenuOpen: false,
        menuPosition: DEFAULT_RIGHT_CLICK_MENU_STATE.menuPosition,
      };
    case ActionType.OpenMenu:
      if (action.payload) {
        return {
          ...state,
          isMenuOpen: true,
          menuPosition: action.payload,
        };
      }
      return {
        ...state,
        isMenuOpen: true,
      };
    case ActionType.Reset:
      return {
        ...DEFAULT_RIGHT_CLICK_MENU_STATE,
      };
    default:
      return state;
  }
}

export default rightClickMenuReducer;
