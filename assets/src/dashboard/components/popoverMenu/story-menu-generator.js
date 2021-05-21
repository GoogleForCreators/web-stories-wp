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
import { noop } from '../../../design-system';
import { STORY_CONTEXT_MENU_ACTIONS } from '../../constants';

/**
 * Generate story enu.
 *
 * For menuItemActions, The `key` is any property in `STORY_CONTEXT_MENU_ACTIONS` found in {@module assets/src/dashboard/types.js}.
 *
 * @param {Object} arguments The arguments
 * @param {Object.<string, Function>} arguments.menuItemActions An object of actions that could be added as event handlers.
 * @param {Array} arguments.menuItems The menu items to build out
 * @param {Object} arguments.story The story used to generate the menu items
 * @return {Array} Array of menu items
 */
export const generateStoryMenu = ({
  menuItemActions = {},
  menuItems,
  story,
}) => {
  const defaultFn = menuItemActions.default
    ? () => menuItemActions.default(story)
    : noop;

  return menuItems.map(({ value, ...menuItem }) => {
    const extraProperties = {
      onClick: menuItemActions[value]
        ? () => menuItemActions[value](story)
        : defaultFn,
    };

    switch (value) {
      case STORY_CONTEXT_MENU_ACTIONS.OPEN_IN_EDITOR:
        extraProperties.href = story.bottomTargetAction;
        extraProperties.newTab = false;
        break;
      case STORY_CONTEXT_MENU_ACTIONS.OPEN_STORY_LINK:
        extraProperties.href = story.previewLink;
        extraProperties.newTab = true;
        break;
      default:
        break;
    }

    return {
      ...menuItem,
      ...extraProperties,
    };
  });
};
