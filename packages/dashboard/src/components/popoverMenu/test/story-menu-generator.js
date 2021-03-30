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
/**
 * External dependencies
 */
import { noop } from '@web-stories-wp/design-system';
import {
  STORY_CONTEXT_MENU_ITEMS,
  STORY_CONTEXT_MENU_ACTIONS,
} from '../../../constants';
import { generateStoryMenu } from '../story-menu-generator';

const TEST_MENU_ITEM_ACTIONS = Object.values(STORY_CONTEXT_MENU_ACTIONS).reduce(
  (all, actionName) => {
    all[actionName] = noop;

    return all;
  },
  {
    default: noop,
  }
);

const TEST_STORY = {
  previewLink: 'preview-link',
  bottomTargetAction: 'bottom-target-action',
};

describe('generateStoryMenu', () => {
  it('should generate menu items of the correct shape', () => {
    const menuItems = generateStoryMenu({
      menuItemActions: TEST_MENU_ITEM_ACTIONS,
      menuItems: STORY_CONTEXT_MENU_ITEMS,
      story: TEST_STORY,
    });

    expect(menuItems).toStrictEqual([
      expect.objectContaining({
        href: 'bottom-target-action',
        label: 'Open in editor',
        newTab: false,
        onClick: expect.any(Function),
      }),
      expect.objectContaining({
        label: 'Preview',
        onClick: expect.any(Function),
      }),
      expect.objectContaining({
        href: 'preview-link',
        label: 'Open in new tab',
        newTab: true,
        onClick: expect.any(Function),
      }),
      expect.objectContaining({
        label: 'Copy Story URL',
        onClick: expect.any(Function),
      }),
      expect.objectContaining({
        label: 'Rename',
        onClick: expect.any(Function),
      }),
      expect.objectContaining({
        label: 'Duplicate',
        onClick: expect.any(Function),
      }),
      expect.objectContaining({
        inProgress: true,
        label: 'Create Template',
        onClick: expect.any(Function),
      }),
      expect.objectContaining({
        label: 'Delete Story',
        onClick: expect.any(Function),
      }),
    ]);
  });
});
