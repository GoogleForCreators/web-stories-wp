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
import { STORY_CONTEXT_MENU_ITEMS } from '../../../constants';
import { generateStoryMenu } from '../story-menu-generator';

const TEST_STORY = {
  previewLink: 'preview-link',
  bottomTargetAction: 'bottom-target-action',
  capabilities: {
    hasEditAction: true,
    hasDeleteAction: true,
  },
};

describe('generateStoryMenu', () => {
  it('should generate menu items of the correct shape', () => {
    const menuItems = generateStoryMenu({
      menuItems: STORY_CONTEXT_MENU_ITEMS,
      story: TEST_STORY,
    });

    expect(menuItems).toStrictEqual([
      expect.objectContaining({
        href: 'bottom-target-action',
        label: 'Open in editor',
        openNewTab: false,
        onClick: expect.any(Function),
      }),
      expect.objectContaining({
        href: 'preview-link',
        label: 'Open in new tab',
        openNewTab: true,
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
        label: 'Delete Story',
        onClick: expect.any(Function),
      }),
    ]);
  });
});
