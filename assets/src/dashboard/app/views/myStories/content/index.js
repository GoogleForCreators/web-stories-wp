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
import { __, sprintf } from '@web-stories-wp/i18n';
import { useMemo } from 'react';

/**
 * Internal dependencies
 */
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  Headline,
  LoadingSpinner,
  THEME_CONSTANTS,
} from '../../../../../design-system';
import { UnitsProvider } from '../../../../../edit-story/units';
import { TransformProvider } from '../../../../../edit-story/components/transform';
import { resolveRoute } from '../../../router';
import { APP_ROUTES } from '../../../../constants';
import {
  InfiniteScroller,
  Layout,
  LoadingContainer,
  StandardViewContentGutter,
} from '../../../../components';
import { StoriesPropType, StoryActionsPropType } from '../../../../types';
import {
  FilterPropTypes,
  ViewPropTypes,
  PagePropTypes,
  SortPropTypes,
} from '../../../../utils/useStoryView';
import FontProvider from '../../../font/fontProvider';
import { EmptyContentMessage } from '../../shared';
import StoriesView from './storiesView';

function Content({
  allPagesFetched,
  filter,
  isLoading,
  page,
  search,
  sort,
  stories,
  storyActions,
  view,
  initialFocusStoryId,
}) {
  const pageContent = useMemo(() => {
    if (isLoading) {
      return (
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      );
    }

    return stories.length > 0 ? (
      <>
        <StoriesView
          filterValue={filter.value}
          sort={sort}
          storyActions={storyActions}
          stories={stories}
          view={view}
          initialFocusStoryId={initialFocusStoryId}
        />
        <InfiniteScroller
          canLoadMore={!allPagesFetched}
          isLoading={isLoading}
          allDataLoadedMessage={__('No more stories', 'web-stories')}
          onLoadMore={page.requestNextPage}
        />
      </>
    ) : (
      <EmptyContentMessage>
        <Headline size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL} as="h3">
          {search?.keyword
            ? sprintf(
                /* translators: %s: search term. */
                __(
                  'Sorry, we couldn\'t find any results matching "%s"',
                  'web-stories'
                ),
                search.keyword
              )
            : __('Start telling Stories.', 'web-stories')}
        </Headline>
        {!search?.keyword && (
          <Button
            type={BUTTON_TYPES.PRIMARY}
            size={BUTTON_SIZES.MEDIUM}
            as="a"
            href={resolveRoute(APP_ROUTES.TEMPLATES_GALLERY)}
          >
            {__('Explore templates', 'web-stories')}
          </Button>
        )}
      </EmptyContentMessage>
    );
  }, [
    allPagesFetched,
    filter.value,
    initialFocusStoryId,
    isLoading,
    page.requestNextPage,
    search?.keyword,
    sort,
    stories,
    storyActions,
    view,
  ]);

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
            <StandardViewContentGutter>{pageContent}</StandardViewContentGutter>
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
  view: ViewPropTypes,
  initialFocusStoryId: PropTypes.number,
};

export default Content;
