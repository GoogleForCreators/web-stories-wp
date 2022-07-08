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
import { sprintf, __ } from '@googleforcreators/i18n';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  Headline,
  THEME_CONSTANTS,
  InfiniteScroller,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { resolveRoute } from '../../../router';
import { APP_ROUTES } from '../../../../constants';
import { Layout, StandardViewContentGutter } from '../../../../components';
import { StoriesPropType, StoryActionsPropType } from '../../../../types';
import {
  ViewPropTypes,
  PagePropTypes,
  ShowStoriesWhileLoadingPropType,
} from '../../../../utils/useStoryView';
import { EmptyContentMessage } from '../../shared';
import StoriesView from './storiesView';

function NoAvailableContent({ filtersObject }) {
  const { search } = filtersObject;
  if (search) {
    return sprintf(
      /* translators: %s: search term. */
      __('Sorry, we couldn\'t find any results matching "%s"', 'web-stories'),
      search
    );
  } else if (Object.keys(filtersObject).length !== 0) {
    console.log(filtersObject);
    return __("Sorry, we couldn't find any results", 'web-stories');
  } else {
    return __('Start telling Stories.', 'web-stories');
  }
}
NoAvailableContent.propTypes = {
  filtersObject: PropTypes.object,
};

function Content({
  allPagesFetched,
  canViewDefaultTemplates,
  filtersObject = {},
  loading,
  page,
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
              storyActions={storyActions}
              stories={stories}
              view={view}
              loading={loading}
            />
            <InfiniteScroller
              canLoadMore={!allPagesFetched}
              isLoading={loading?.isLoading}
              allDataLoadedMessage={__('No more stories', 'web-stories')}
              allDataLoadedAriaMessage={__(
                'All stories are loaded',
                'web-stories'
              )}
              loadingAriaMessage={__('Loading more stories', 'web-stories')}
              onLoadMore={page.requestNextPage}
            />
          </>
        ) : (
          !loading?.isLoading && (
            <EmptyContentMessage>
              <Headline
                size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
                as="h3"
              >
                <NoAvailableContent filtersObject={filtersObject} />
              </Headline>
              {Object.keys(filtersObject).length === 0 &&
                canViewDefaultTemplates && (
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
          )
        )}
      </StandardViewContentGutter>
    </Layout.Scrollable>
  );
}
Content.propTypes = {
  allPagesFetched: PropTypes.bool,
  canViewDefaultTemplates: PropTypes.bool,
  filtersObject: PropTypes.object,
  loading: PropTypes.shape({
    isLoading: PropTypes.bool,
    showStoriesWhileLoading: ShowStoriesWhileLoadingPropType,
  }),
  page: PagePropTypes,
  stories: StoriesPropType,
  storyActions: StoryActionsPropType,
  view: ViewPropTypes,
};

export default Content;
