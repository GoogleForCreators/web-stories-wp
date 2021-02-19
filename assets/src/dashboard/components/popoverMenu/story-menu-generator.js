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
import { STORY_CONTEXT_MENU_ACTIONS } from '../../constants';

const generateClickEventHandler = ({
  action,
  menuItemActions,
  story,
}) => () => {
  menuItemActions?.handleCloseMenu();
  menuItemActions[action]?.(story);
};

export const generateStoryMenu = ({ menuItemActions = {}, menuItems, story }) =>
  menuItems.map(({ value, ...menuItem }) => {
    const extraProperties = {
      onClick: generateClickEventHandler({
        action: value,
        menuItemActions,
        story,
      }),
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
