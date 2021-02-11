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
import { boolean, text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

/**
 * Internal dependencies
 */

import {
  formattedStoriesArray,
  STORYBOOK_PAGE_SIZE,
} from '../../../../storybookUtils';
import {
  STORY_ITEM_CENTER_ACTION_LABELS,
  STORY_CONTEXT_MENU_ITEMS,
} from '../../../../constants';
import StoryGridView from '../storyGridView';

export default {
  title: 'Dashboard/Views/Shared/StoryGridView',
  component: StoryGridView,
};

export const _default = () => {
  return (
    <StoryGridView
      stories={formattedStoriesArray}
      centerActionLabelByStatus={STORY_ITEM_CENTER_ACTION_LABELS}
      bottomActionLabel={text('bottomActionLabel', 'MY CTA')}
      storyMenu={{
        handleMenuToggle: action('handleMenuToggle'),
        contextMenuId: -1,
        menuItems: STORY_CONTEXT_MENU_ITEMS,
        handleMenuItemSelected: action('handleMenuItemSelected'),
      }}
      isTemplate={boolean('isTemplate')}
      isSavedTemplate={boolean('isSavedTemplate')}
      pageSize={STORYBOOK_PAGE_SIZE}
    />
  );
};
