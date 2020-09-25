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
import PropTypes from 'prop-types';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { UnitsProvider } from '../../../../../edit-story/units';
import { TransformProvider } from '../../../../../edit-story/components/transform';
import {
  InfiniteScroller,
  Layout,
  StandardViewContentGutter,
} from '../../../../components';
import {
  UsersPropType,
  StoriesPropType,
  StoryActionsPropType,
} from '../../../../types';
import {
  FilterPropTypes,
  ViewPropTypes,
  PagePropTypes,
  SortPropTypes,
} from '../../../../utils/useStoryView';
import FontProvider from '../../../font/fontProvider';
import StoriesView from './storiesView';
import EmptyView from './emptyView';

function Content({
  allPagesFetched,
  filter,
  isLoading,
  page,
  search,
  sort,
  stories,
  storyActions,
  users,
  view,
  initialFocusStoryId,
}) {
  return (
    <Layout.Scrollable>
      <FontProvider>
        <TransformProvider>
          <UnitsProvider
            pageSize={{
              width: view.pageSize.width,
              height: view.pageSize.height,
            }}
          >
            {stories.length > 0 ? (
              <StandardViewContentGutter>
                <StoriesView
                  filterValue={filter.value}
                  sort={sort}
                  storyActions={storyActions}
                  stories={stories}
                  users={users}
                  view={view}
                  initialFocusStoryId={initialFocusStoryId}
                />
                <InfiniteScroller
                  canLoadMore={!allPagesFetched}
                  isLoading={isLoading}
                  allDataLoadedMessage={__('No more stories', 'web-stories')}
                  onLoadMore={page.requestNextPage}
                />
              </StandardViewContentGutter>
            ) : (
              <EmptyView searchKeyword={search.keyword} />
            )}
          </UnitsProvider>
        </TransformProvider>
      </FontProvider>
    </Layout.Scrollable>
  );
}
Content.propTypes = {
  allPagesFetched: PropTypes.bool,
  filter: FilterPropTypes,
  isLoading: PropTypes.bool,
  page: PagePropTypes,
  search: PropTypes.object,
  sort: SortPropTypes,
  stories: StoriesPropType,
  storyActions: StoryActionsPropType,
  users: UsersPropType,
  view: ViewPropTypes,
  initialFocusStoryId: PropTypes.number,
};

export default Content;
