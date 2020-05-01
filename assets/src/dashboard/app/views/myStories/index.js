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
import { useCallback, useContext, useEffect, useState, useMemo } from 'react';

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
  STORY_SORT_OPTIONS,
  SORT_DIRECTION,
} from '../../../constants';
import { ReactComponent as PlayArrowSvg } from '../../../icons/playArrow.svg';
import { ApiContext } from '../../api/apiProvider';
import FontProvider from '../../font/fontProvider';
import { clamp, usePagePreviewSize } from '../../../utils/';
import {
  BodyWrapper,
  BodyViewOptions,
  PageHeading,
  NoResults,
  StoryGridView,
  StoryListView,
} from '../shared';

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
  const [status, setStatus] = useState(STORY_STATUSES[0].value);
  const [typeaheadValue, setTypeaheadValue] = useState('');
  const [viewStyle, setViewStyle] = useState(VIEW_STYLE.GRID);
  const [currentPage, setCurrentPage] = useState(1);

  const [currentStorySort, setCurrentStorySort] = useState(
    STORY_SORT_OPTIONS.LAST_MODIFIED
  );
  const [currentListSortDirection, setListSortDirection] = useState(
    SORT_DIRECTION.DESC
  );

  const { pageSize } = usePagePreviewSize({
    thumbnailMode: viewStyle === VIEW_STYLE.LIST,
  });
  const {
    actions: {
      storyApi: { updateStory, fetchStories, trashStory, duplicateStory },
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
    },
  } = useContext(ApiContext);

  useEffect(() => {
    fetchStories({
      sortOption: currentStorySort,
      searchTerm: typeaheadValue,
      sortDirection: viewStyle === VIEW_STYLE.LIST && currentListSortDirection,
      status,
      page: currentPage,
    });
  }, [
    viewStyle,
    currentListSortDirection,
    currentPage,
    currentStorySort,
    status,
    typeaheadValue,
    fetchStories,
  ]);

  const setCurrentPageClamped = useCallback(
    (newPage) => {
      const pageRange = [1, totalPages];
      setCurrentPage(clamp(newPage, pageRange));
    },
    [totalPages]
  );

  const orderedStories = useMemo(() => {
    return storiesOrderById.map((storyId) => {
      return stories[storyId];
    });
  }, [stories, storiesOrderById]);

  const handleNewStorySort = useCallback(
    (sort) => {
      setCurrentStorySort(sort);
      setCurrentPageClamped(1);
    },
    [setCurrentStorySort, setCurrentPageClamped]
  );
  const handleFilterStatusUpdate = useCallback(
    (value) => {
      setCurrentPageClamped(1);
      setStatus(value);
    },
    [setCurrentPageClamped]
  );

  const handleNewPageRequest = useCallback(() => {
    setCurrentPageClamped(currentPage + 1);
  }, [currentPage, setCurrentPageClamped]);

  const handleTypeaheadChange = useCallback(
    (newTypeaheadValue) => {
      setCurrentPageClamped(1);
      setTypeaheadValue(newTypeaheadValue);
    },
    [setCurrentPageClamped, setTypeaheadValue]
  );

  const handleViewStyleBarButtonSelected = useCallback(() => {
    if (viewStyle === VIEW_STYLE.LIST) {
      setViewStyle(VIEW_STYLE.GRID);
    } else {
      setViewStyle(VIEW_STYLE.LIST);
      if (currentStorySort === STORY_SORT_OPTIONS.NAME) {
        setListSortDirection(SORT_DIRECTION.ASC);
      } else {
        setListSortDirection(SORT_DIRECTION.DESC);
      }
    }
  }, [currentStorySort, viewStyle]);

  const listBarLabel = sprintf(
    /* translators: %s: number of stories */
    _n('%s total story', '%s total stories', totalStories, 'web-stories'),
    totalStories
  );

  const storiesView = useMemo(() => {
    switch (viewStyle) {
      case VIEW_STYLE.GRID:
        return (
          <StoryGridView
            trashStory={trashStory}
            updateStory={updateStory}
            duplicateStory={duplicateStory}
            filteredStories={orderedStories}
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
            filteredStories={orderedStories}
            storySort={currentStorySort}
            sortDirection={currentListSortDirection}
            handleSortChange={handleNewStorySort}
            handleSortDirectionChange={setListSortDirection}
          />
        );
      default:
        return null;
    }
  }, [
    duplicateStory,
    trashStory,
    viewStyle,
    updateStory,
    orderedStories,
    currentStorySort,
    currentListSortDirection,
    handleNewStorySort,
  ]);

  const storiesViewControls = useMemo(() => {
    return (
      <BodyViewOptions
        showGridToggle
        listBarLabel={listBarLabel}
        layoutStyle={viewStyle}
        handleLayoutSelect={handleViewStyleBarButtonSelected}
        currentSort={currentStorySort}
        handleSortChange={handleNewStorySort}
        sortDropdownAriaLabel={__(
          'Choose sort option for display',
          'web-stories'
        )}
      />
    );
  }, [
    currentStorySort,
    handleNewStorySort,
    handleViewStyleBarButtonSelected,
    listBarLabel,
    viewStyle,
  ]);

  const BodyContent = useMemo(() => {
    if (orderedStories.length > 0) {
      return (
        <BodyWrapper>
          {storiesView}
          <InfiniteScroller
            canLoadMore={!allPagesFetched}
            isLoading={isLoading}
            allDataLoadedMessage={__('No more stories', 'web-stories')}
            onLoadMore={handleNewPageRequest}
          />
        </BodyWrapper>
      );
    } else if (typeaheadValue.length > 0) {
      return <NoResults typeaheadValue={typeaheadValue} />;
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
    handleNewPageRequest,
    typeaheadValue,
    storiesView,
  ]);

  return (
    <FontProvider>
      <TransformProvider>
        <UnitsProvider pageSize={pageSize}>
          <Layout.Provider>
            <Layout.Squishable>
              <PageHeading
                defaultTitle={__('My Stories', 'web-stories')}
                searchPlaceholder={__('Search Stories', 'web-stories')}
                filteredStories={orderedStories}
                handleTypeaheadChange={handleTypeaheadChange}
                typeaheadValue={typeaheadValue}
              >
                <ToggleButtonGroup
                  buttons={STORY_STATUSES.map((storyStatus) => {
                    return {
                      handleClick: () =>
                        handleFilterStatusUpdate(storyStatus.value),
                      key: storyStatus.value,
                      isActive: status === storyStatus.value,
                      text: storyStatus.label,
                    };
                  })}
                />
              </PageHeading>
              {storiesViewControls}
            </Layout.Squishable>
            <Layout.Scrollable>{BodyContent}</Layout.Scrollable>
            <Layout.Fixed>
              <ScrollToTop />
            </Layout.Fixed>
          </Layout.Provider>
        </UnitsProvider>
      </TransformProvider>
    </FontProvider>
  );
}

export default MyStories;
