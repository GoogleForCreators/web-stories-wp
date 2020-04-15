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
import { FloatingTab, InfiniteScroller } from '../../../components';
import {
  VIEW_STYLE,
  STORY_STATUSES,
  STORY_SORT_OPTIONS,
} from '../../../constants';
import { ApiContext } from '../../api/apiProvider';
import { UnitsProvider } from '../../../../edit-story/units';
import { TransformProvider } from '../../../../edit-story/components/transform';
import FontProvider from '../../font/fontProvider';
import usePagePreviewSize from '../../../utils/usePagePreviewSize';
import { ReactComponent as PlayArrowSvg } from '../../../icons/playArrow.svg';
import {
  BodyWrapper,
  BodyViewOptions,
  PageHeading,
  NoResults,
  StoryGridView,
} from '../shared';

const FilterContainer = styled.div`
  margin: ${({ theme }) => `0 ${theme.pageGutter.desktop}px`};
  padding-bottom: 20px;
  border-bottom: ${({ theme: t }) => t.subNavigationBar.border};

  @media ${({ theme }) => theme.breakpoint.min} {
    & > label {
      border-radius: 0;
      box-shadow: none;
      padding: 0 10px 0 0;
    }
  }
`;

const DefaultBodyText = styled.p`
  font-family: ${({ theme }) => theme.fonts.body1.family};
  font-weight: ${({ theme }) => theme.fonts.body1.weight};
  font-size: ${({ theme }) => theme.fonts.body1.size};
  line-height: ${({ theme }) => theme.fonts.body1.lineHeight};
  letter-spacing: ${({ theme }) => theme.fonts.body1.letterSpacing};
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
  const [allStoriesLoaded, setAllStoriesLoaded] = useState(false);
  const [currentViewStoryCount, setCurrentViewStoryCount] = useState(0);
  const [currentStorySort, setCurrentStorySort] = useState(
    STORY_SORT_OPTIONS.LAST_MODIFIED
  );
  const { pageSize } = usePagePreviewSize();
  const {
    actions: { fetchStories },
    state: { stories, totalStories, totalPages },
  } = useContext(ApiContext);

  useEffect(() => {
    fetchStories({
      orderby: currentStorySort,
      searchTerm: typeaheadValue,
      page: currentPage,
      status,
    });
  }, [currentPage, currentStorySort, fetchStories, status, typeaheadValue]);

  // TODO handle story order here instead of in reducer as it is view specific
  // we cannot rely on the api ordering, ordering should be in the view instead because pagination in the api + infinite scroll makes updating state unusual.
  const filteredStories = useMemo(() => {
    return Object.values(stories).filter((story) => {
      const lowerTypeaheadValue = typeaheadValue.toLowerCase();

      return story.title.toLowerCase().includes(lowerTypeaheadValue);
    });
  }, [stories, typeaheadValue]);

  useEffect(() => {
    if (typeaheadValue.length > 0) {
      setCurrentViewStoryCount(filteredStories.length);
    } else {
      setCurrentViewStoryCount(totalStories);
    }
  }, [
    setCurrentViewStoryCount,
    typeaheadValue,
    totalStories,
    filteredStories.length,
  ]);

  const handleViewStyleBarButtonSelected = useCallback(() => {
    if (viewStyle === VIEW_STYLE.LIST) {
      setViewStyle(VIEW_STYLE.GRID);
    } else {
      setViewStyle(VIEW_STYLE.LIST);
    }
  }, [viewStyle]);

  const listBarLabel = sprintf(
    /* translators: %s: number of stories */
    _n(
      '%s total story',
      '%s total stories',
      currentViewStoryCount,
      'web-stories'
    ),
    currentViewStoryCount
  );

  const StoriesViewControls = useMemo(() => {
    return (
      <BodyViewOptions
        listBarLabel={listBarLabel}
        layoutStyle={viewStyle}
        handleLayoutSelect={handleViewStyleBarButtonSelected}
        currentSort={currentStorySort}
        handleSortChange={setCurrentStorySort}
        sortDropdownAriaLabel={__(
          'Choose sort option for display',
          'web-stories'
        )}
      />
    );
  }, [
    currentStorySort,
    handleViewStyleBarButtonSelected,
    listBarLabel,
    viewStyle,
  ]);

  const StoriesGrid = useMemo(() => {
    return (
      <InfiniteScroller
        isAllDataLoaded={allStoriesLoaded}
        allDataLoadedMessage={'There are no more stories to load'}
        handleGetData={() => {
          if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
          } else {
            setAllStoriesLoaded(true);
          }
        }}
      >
        <StoryGridView
          filteredStories={filteredStories}
          centerActionLabel={
            <>
              <PlayArrowIcon />
              {__('Preview', 'web-stories')}
            </>
          }
          bottomActionLabel={__('Open in editor', 'web-stories')}
        />
      </InfiniteScroller>
    );
  }, [allStoriesLoaded, currentPage, filteredStories, totalPages]);

  const BodyContent = useMemo(() => {
    if (currentViewStoryCount > 0) {
      return (
        <BodyWrapper>
          {StoriesViewControls}
          {StoriesGrid}
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
  }, [currentViewStoryCount, typeaheadValue, StoriesViewControls, StoriesGrid]);

  return (
    <FontProvider>
      <TransformProvider>
        <UnitsProvider pageSize={pageSize}>
          <PageHeading
            defaultTitle={__('My Stories', 'web-stories')}
            searchPlaceholder={__('Search Stories', 'web-stories')}
            filteredStories={filteredStories}
            handleTypeaheadChange={setTypeaheadValue}
            typeaheadValue={typeaheadValue}
          />
          <FilterContainer>
            {STORY_STATUSES.map((storyStatus) => (
              <FloatingTab
                key={storyStatus.value}
                onClick={(_, value) => setStatus(value)}
                name="all-stories"
                value={storyStatus.value}
                isSelected={status === storyStatus.value}
              >
                {storyStatus.label}
              </FloatingTab>
            ))}
          </FilterContainer>

          {BodyContent}
        </UnitsProvider>
      </TransformProvider>
    </FontProvider>
  );
}

export default MyStories;
