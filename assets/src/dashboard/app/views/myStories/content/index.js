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
import { useMemo } from 'react';

/**
 * Internal dependencies
 */
import { UnitsProvider } from '../../../../../edit-story/units';
import { TransformProvider } from '../../../../../edit-story/components/transform';
import {
  InfiniteScroller,
  Layout,
  StandardViewContentGutter,
  DefaultParagraph1,
} from '../../../../components';
import {
  VIEW_STYLE,
  STORY_ITEM_CENTER_ACTION_LABELS,
} from '../../../../constants';
import FontProvider from '../../../font/fontProvider';
import { NoResults, StoryGridView, StoryListView } from '../../shared';
import {
  UsersPropType,
  TagsPropType,
  CategoriesPropType,
  StoriesPropType,
} from '../../../../types';
import {
  FilterPropTypes,
  ViewPropTypes,
  PagePropTypes,
  SortPropTypes,
} from '../../../../utils/useStoryView';

function Content({
  allPagesFetched,
  categories,
  filter,
  isLoading,
  page,
  search,
  sort,
  stories,
  storyActions,
  tags,
  users,
  view,
}) {
  const contentView = useMemo(() => {
    switch (view.style) {
      case VIEW_STYLE.GRID:
        return (
          <StoryGridView
            trashStory={storyActions.trashStory}
            updateStory={storyActions.updateStory}
            createTemplateFromStory={storyActions.createTemplateFromStory}
            duplicateStory={storyActions.duplicateStory}
            stories={stories}
            users={users}
            centerActionLabelByStatus={STORY_ITEM_CENTER_ACTION_LABELS}
            bottomActionLabel={__('Open in editor', 'web-stories')}
          />
        );
      case VIEW_STYLE.LIST:
        return (
          <StoryListView
            stories={stories}
            storySort={sort.value}
            storyStatus={filter.value}
            sortDirection={sort.direction}
            handleSortChange={sort.set}
            handleSortDirectionChange={sort.setDirection}
            tags={tags}
            categories={categories}
            users={users}
          />
        );
      default:
        return null;
    }
  }, [
    categories,
    filter.value,
    sort,
    storyActions,
    stories,
    tags,
    users,
    view.style,
  ]);

  const BodyContent = useMemo(() => {
    if (stories.length > 0) {
      return (
        <StandardViewContentGutter>
          {contentView}
          <InfiniteScroller
            canLoadMore={!allPagesFetched}
            isLoading={isLoading}
            allDataLoadedMessage={__('No more stories', 'web-stories')}
            onLoadMore={page.requestNextPage}
          />
        </StandardViewContentGutter>
      );
    } else if (search.keyword.length > 0) {
      return <NoResults typeaheadValue={search.keyword} />;
    }

    return (
      <DefaultParagraph1>
        {__('Create a story to get started!', 'web-stories')}
      </DefaultParagraph1>
    );
  }, [
    stories.length,
    isLoading,
    allPagesFetched,
    page.requestNextPage,
    search.keyword,
    contentView,
  ]);

  return (
    <Layout.Scrollable>
      <FontProvider>
        <TransformProvider>
          <UnitsProvider pageSize={view.pageSize}>{BodyContent}</UnitsProvider>
        </TransformProvider>
      </FontProvider>
    </Layout.Scrollable>
  );
}
Content.propTypes = {
  allPagesFetched: PropTypes.bool,
  categories: CategoriesPropType,
  filter: FilterPropTypes,
  isLoading: PropTypes.bool,
  page: PagePropTypes,
  search: PropTypes.object,
  sort: SortPropTypes,
  stories: StoriesPropType,
  storyActions: PropTypes.shape({
    createTemplateFromStory: PropTypes.func,
    duplicateStory: PropTypes.func,
    trashStory: PropTypes.func,
    updateStory: PropTypes.func,
  }),
  tags: TagsPropType,
  users: UsersPropType,
  view: ViewPropTypes,
};

export default Content;
