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
import { noop } from '@web-stories-wp/design-system';
/**
 * Internal dependencies
 */
import { STORY_CONTEXT_MENU_ACTIONS } from '../../constants';

/**
 * Generate story enu.
 *
 * For menuItemActions, The `key` is any property in `STORY_CONTEXT_MENU_ACTIONS` found in {@module packages/dashboard/src/types.js}.
 *
 * @param {Object} arguments The arguments
 * @param {Array} arguments.menuItems The menu items to build out
 * @param {Object} arguments.story The story used to generate the menu items
 * @param {boolean} arguments.isLocked Communicates if the story is locked by another user so we can disable any actions necessary
 * @return {Array} Array of menu items
 */
export const generateStoryMenu = ({ menuItems, story, isLocked }) => {
  const defaultFn = menuItems.default ? () => menuItems.default(story) : noop;
  const getMenuItem = (value) =>
    menuItems.find((item) => item?.value === value);

  const menuItemsFiltered = menuItems.filter(
    (item) => typeof item.isEnabled === undefined || item.isEnabled(story)
  );

  return menuItemsFiltered.map(({ capability, value, ...menuItem }) => {
    const menu = getMenuItem(value);
    const extraProperties = {
      onClick: menu ? () => menu['action'](story) : defaultFn,
    };

    switch (value) {
      case STORY_CONTEXT_MENU_ACTIONS.OPEN_IN_EDITOR:
        extraProperties.href = story.bottomTargetAction;
        extraProperties.openNewTab = false;
        break;
      case STORY_CONTEXT_MENU_ACTIONS.OPEN_STORY_LINK:
        extraProperties.href = story.previewLink;
        extraProperties.openNewTab = true;
        break;
      case STORY_CONTEXT_MENU_ACTIONS.RENAME:
        extraProperties.disabled = isLocked;
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
