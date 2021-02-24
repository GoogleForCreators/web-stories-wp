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
