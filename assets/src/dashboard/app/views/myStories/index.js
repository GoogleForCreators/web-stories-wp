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
import { __, sprintf, _n } from '@wordpress/i18n';

/**
 * External dependencies
 */
import styled from 'styled-components';
import { useContext, useEffect, useMemo } from 'react';

/**
 * Internal dependencies
 */
import { UnitsProvider } from '../../../../edit-story/units';
import { TransformProvider } from '../../../../edit-story/components/transform';
import {
  InfiniteScroller,
  ScrollToTop,
  Layout,
  ToggleButtonGroup,
} from '../../../components';
import {
  VIEW_STYLE,
  STORY_STATUSES,
  STORY_VIEWING_LABELS,
} from '../../../constants';
import { ReactComponent as PlayArrowSvg } from '../../../icons/playArrow.svg';
import { ApiContext } from '../../api/apiProvider';
import FontProvider from '../../font/fontProvider';
import {
  BodyWrapper,
  BodyViewOptions,
  PageHeading,
  NoResults,
  StoryGridView,
  StoryListView,
  HeaderToggleButtonContainer,
} from '../shared';
import useStoryView from '../../../utils/useStoryView';

const DefaultBodyText = styled.p`
  font-family: ${({ theme }) => theme.fonts.body1.family};
  font-weight: ${({ theme }) => theme.fonts.body1.weight};
  font-size: ${({ theme }) => theme.fonts.body1.size}px;
  line-height: ${({ theme }) => theme.fonts.body1.lineHeight}px;
  letter-spacing: ${({ theme }) => theme.fonts.body1.letterSpacing}em;
  color: ${({ theme }) => theme.colors.gray200};
  margin: 40px 20px;
`;

const PlayArrowIcon = styled(PlayArrowSvg).attrs({ width: 11, height: 14 })`
  margin-right: 9px;
`;

function MyStories() {
  const {
    actions: {
      storyApi: { updateStory, fetchStories, trashStory, duplicateStory },
      templateApi: { createTemplateFromStory },
    },
    state: {
      stories: {
        allPagesFetched,
        isLoading,
        stories,
        storiesOrderById,
        totalStories,
        totalPages,
      },
      tags,
      categories,
      users,
    },
  } = useContext(ApiContext);

  const { view, sort, filter, page, search } = useStoryView({
    filters: STORY_STATUSES,
    totalPages,
  });

  useEffect(() => {
    fetchStories({
      sortOption: sort.value,
      searchTerm: search.keyword,
      sortDirection: view.style === VIEW_STYLE.LIST && sort.direction,
      status: filter.value,
      page: page.value,
    });
  }, [
    view.style,
    sort.direction,
    page.value,
    sort.value,
    filter.value,
    search.keyword,
    fetchStories,
  ]);

  const orderedStories = useMemo(() => {
    return storiesOrderById.map((storyId) => {
      return stories[storyId];
    });
  }, [stories, storiesOrderById]);

  const listBarLabel = useMemo(
    () =>
      search.keyword
        ? sprintf(
            /* translators: %s: number of stories */
            _n('%s result', '%s results', totalStories, 'web-stories'),
            totalStories
          )
        : STORY_VIEWING_LABELS[filter.value],
    [filter.value, search.keyword, totalStories]
  );

  const storiesView = useMemo(() => {
    switch (view.style) {
      case VIEW_STYLE.GRID:
        return (
          <StoryGridView
            trashStory={trashStory}
            updateStory={updateStory}
            createTemplateFromStory={createTemplateFromStory}
            duplicateStory={duplicateStory}
            stories={orderedStories}
            users={users}
            centerActionLabel={
              <>
                <PlayArrowIcon />
                {__('Preview', 'web-stories')}
              </>
            }
            bottomActionLabel={__('Open in editor', 'web-stories')}
          />
        );
      case VIEW_STYLE.LIST:
        return (
          <StoryListView
            stories={orderedStories}
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
    view.style,
    trashStory,
    updateStory,
    createTemplateFromStory,
    duplicateStory,
    orderedStories,
    filter.value,
    sort,
    tags,
    categories,
    users,
  ]);

  const storiesViewControls = useMemo(() => {
    return (
      <BodyViewOptions
        showGridToggle
        listBarLabel={listBarLabel}
        layoutStyle={view.style}
        handleLayoutSelect={view.toggleStyle}
        currentSort={sort.value}
        handleSortChange={sort.set}
        sortDropdownAriaLabel={__(
          'Choose sort option for display',
          'web-stories'
        )}
      />
    );
  }, [sort, listBarLabel, view]);

  const BodyContent = useMemo(() => {
    if (orderedStories.length > 0) {
      return (
        <BodyWrapper>
          {storiesView}
          <InfiniteScroller
            canLoadMore={!allPagesFetched}
            isLoading={isLoading}
            allDataLoadedMessage={__('No more stories', 'web-stories')}
            onLoadMore={page.requestNextPage}
          />
        </BodyWrapper>
      );
    } else if (search.keyword.length > 0) {
      return <NoResults typeaheadValue={search.keyword} />;
    }

    return (
      <DefaultBodyText>
        {__('Create a story to get started!', 'web-stories')}
      </DefaultBodyText>
    );
  }, [
    orderedStories.length,
    isLoading,
    allPagesFetched,
    page.requestNextPage,
    search.keyword,
    storiesView,
  ]);

  return (
    <FontProvider>
      <TransformProvider>
        <Layout.Provider>
          <Layout.Squishable>
            <PageHeading
              defaultTitle={__('My Stories', 'web-stories')}
              searchPlaceholder={__('Search Stories', 'web-stories')}
              stories={orderedStories}
              handleTypeaheadChange={search.setKeyword}
              typeaheadValue={search.keyword}
            >
              <HeaderToggleButtonContainer>
                <ToggleButtonGroup
                  buttons={STORY_STATUSES.map((storyStatus) => {
                    return {
                      handleClick: () => filter.set(storyStatus.value),
                      key: storyStatus.value,
                      isActive: filter.value === storyStatus.value,
                      text: storyStatus.label,
                    };
                  })}
                />
              </HeaderToggleButtonContainer>
            </PageHeading>
            {storiesViewControls}
          </Layout.Squishable>
          <Layout.Scrollable>
            <UnitsProvider pageSize={view.pageSize}>
              {BodyContent}
            </UnitsProvider>
          </Layout.Scrollable>
          <Layout.Fixed>
            <ScrollToTop />
          </Layout.Fixed>
        </Layout.Provider>
      </TransformProvider>
    </FontProvider>
  );
}

export default MyStories;
