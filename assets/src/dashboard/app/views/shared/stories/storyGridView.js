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

import StoryGridView from '../storyGridView';
import formattedStoriesArray from '../../../../storybookUtils/formattedStoriesArray';
import formattedUsersObject from '../../../../storybookUtils/formattedUsersObject';

export default {
  title: 'Dashboard/Components/StoryGridView',
  component: StoryGridView,
};

export const _default = () => {
  return (
    <StoryGridView
      stories={formattedStoriesArray}
      users={formattedUsersObject}
      centerActionLabel={text('centerActionLabel', 'Preview')}
      bottomActionLabel={text('bottomActionLabel', 'MY CTA')}
      createTemplateFromStory={boolean('createTemplateFromStory')}
      updateStory={action('updateStory button clicked')}
      trashStory={action('trashStory button clicked')}
      duplicateStory={action('duplicateStory button clicked')}
      isTemplate={boolean('isTemplate')}
    />
  );
};
