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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import {
  CategoriesPropType,
  StoriesPropType,
  StoryActionsPropType,
  TagsPropType,
  UsersPropType,
} from '../../../../../types';
import {
  SortPropTypes,
  ViewPropTypes,
} from '../../../../../utils/useStoryView';
import {
  VIEW_STYLE,
  STORY_ITEM_CENTER_ACTION_LABELS,
} from '../../../../../constants';
import { StoryGridView, StoryListView } from '../../../shared';

function StoriesView({
  categories,
  filterValue,
  sort,
  storyActions,
  stories,
  tags,
  users,
  view,
}) {
  return view.style === VIEW_STYLE.LIST ? (
    <StoryListView
      stories={stories}
      storySort={sort.value}
      storyStatus={filterValue}
      sortDirection={sort.direction}
      handleSortChange={sort.set}
      handleSortDirectionChange={sort.setDirection}
      tags={tags}
      categories={categories}
      users={users}
    />
  ) : (
    <StoryGridView
      trashStory={storyActions.trashStory}
      updateStory={storyActions.updateStory}
      createTemplateFromStory={storyActions.createTemplateFromStory}
      duplicateStory={storyActions.duplicateStory}
      stories={stories}
      users={users}
      centerActionLabelByStatus={STORY_ITEM_CENTER_ACTION_LABELS}
      bottomActionLabel={__('Open in editor', 'web-stories')}
      pageSize={view.pageSize}
    />
  );
}

StoriesView.propTypes = {
  categories: CategoriesPropType,
  filterValue: PropTypes.string,
  sort: SortPropTypes,
  storyActions: StoryActionsPropType,
  stories: StoriesPropType,
  tags: TagsPropType,
  users: UsersPropType,
  view: ViewPropTypes,
};
export default StoriesView;
