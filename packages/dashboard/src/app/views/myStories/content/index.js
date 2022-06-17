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
import { __ } from '@googleforcreators/i18n';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  Headline,
  THEME_CONSTANTS,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { resolveRoute } from '../../../router';
import { APP_ROUTES } from '../../../../constants';
import {
  InfiniteScroller,
  Layout,
  StandardViewContentGutter,
} from '../../../../components';
import { StoriesPropType, StoryActionsPropType } from '../../../../types';
import {
  FilterPropTypes,
  ViewPropTypes,
  PagePropTypes,
  SortPropTypes,
  ShowStoriesWhileLoadingPropType,
} from '../../../../utils/useStoryView';
import { EmptyContentMessage } from '../../shared';
import StoriesView from './storiesView';

function Content({
  allPagesFetched,
  canViewDefaultTemplates,
  filter,
  filtersObject,
  loading,
  page,
  search,
  sort,
  stories,
  storyActions,
  view,
}) {
  return (
    <Layout.Scrollable>
      <StandardViewContentGutter>
        {stories.length > 0 ? (
          <>
            <StoriesView
              filterValue={filter.value}
              sort={sort}
              storyActions={storyActions}
              stories={stories}
              view={view}
              loading={loading}
            />
            <InfiniteScroller
              canLoadMore={!allPagesFetched}
              isLoading={loading?.isLoading}
              allDataLoadedMessage={__('No more stories', 'web-stories')}
              onLoadMore={page.requestNextPage}
            />
          </>
        ) : (
          <EmptyContentMessage>
            <Headline
              size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
              as="h3"
            >
              {search?.keyword || Boolean(Object.keys(filtersObject))
                ? __("Sorry, we couldn't find any results.", 'web-stories')
                : __('Start telling Stories.', 'web-stories')}
            </Headline>
            {!search?.keyword && canViewDefaultTemplates && (
              <Button
                type={BUTTON_TYPES.PRIMARY}
                size={BUTTON_SIZES.MEDIUM}
                as="a"
                href={resolveRoute(APP_ROUTES.TEMPLATES_GALLERY)}
              >
                {__('Explore Templates', 'web-stories')}
              </Button>
            )}
          </EmptyContentMessage>
        )}
      </StandardViewContentGutter>
    </Layout.Scrollable>
  );
}
Content.propTypes = {
  allPagesFetched: PropTypes.bool,
  canViewDefaultTemplates: PropTypes.bool,
  filter: FilterPropTypes,
  filtersObject: PropTypes.object,
  loading: PropTypes.shape({
    isLoading: PropTypes.bool,
    showStoriesWhileLoading: ShowStoriesWhileLoadingPropType,
  }),
  page: PagePropTypes,
  search: PropTypes.object,
  sort: SortPropTypes,
  stories: StoriesPropType,
  storyActions: StoryActionsPropType,
  view: ViewPropTypes,
};

export default Content;
