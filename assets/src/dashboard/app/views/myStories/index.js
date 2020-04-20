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
import { FloatingTab, MainNavBar } from '../../../components';
import {
  VIEW_STYLE,
  STORY_STATUSES,
  STORY_SORT_OPTIONS,
  SORT_DIRECTION,
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
  StoryListView,
} from '../shared';

// TODO once we know what we want this filter container to look like on small view ports (when we get designs) these should be updated

const FilterContainer = styled.fieldset`
  margin: ${({ theme }) => `0 ${theme.pageGutter.small.desktop}px`};
  padding-bottom: 20px;
  border-bottom: ${({ theme }) => theme.subNavigationBar.border};

  @media ${({ theme }) => theme.breakpoint.min} {
    & > label span {
      border-radius: 0;
      box-shadow: none !important;
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
  const [viewStyle, setViewStyle] = useState(VIEW_STYLE.LIST);
  const [currentStorySort, setCurrentStorySort] = useState(
    STORY_SORT_OPTIONS.LAST_MODIFIED
  );
  const [currentListSortDirection, setListSortDirection] = useState(
    SORT_DIRECTION.ASC
  );
  const { pageSize } = usePagePreviewSize({
    thumbnailMode: viewStyle === VIEW_STYLE.LIST,
  });
  const {
    actions: { fetchStories },
    state: { stories },
  } = useContext(ApiContext);

  useEffect(() => {
    fetchStories({
      orderby: currentStorySort,
      searchTerm: typeaheadValue,
      order: viewStyle === VIEW_STYLE.LIST && currentListSortDirection,
      status,
    });
  }, [
    viewStyle,
    currentListSortDirection,
    currentStorySort,
    fetchStories,
    status,
    typeaheadValue,
  ]);

  const filteredStories = useMemo(() => {
    return stories.filter((story) => {
      const lowerTypeaheadValue = typeaheadValue.toLowerCase();
      return story.title.toLowerCase().includes(lowerTypeaheadValue);
    });
  }, [stories, typeaheadValue]);

  const handleViewStyleBarButtonSelected = useCallback(() => {
    if (viewStyle === VIEW_STYLE.LIST) {
      setViewStyle(VIEW_STYLE.GRID);
    } else {
      setViewStyle(VIEW_STYLE.LIST);
    }
  }, [viewStyle]);

  const filteredStoriesCount = filteredStories.length;
  const listBarLabel = sprintf(
    /* translators: %s: number of stories */
    _n(
      '%s total story',
      '%s total stories',
      filteredStoriesCount,
      'web-stories'
    ),
    filteredStoriesCount
  );

  const storiesView = useMemo(() => {
    switch (viewStyle) {
      case VIEW_STYLE.GRID:
        return (
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
        );
      case VIEW_STYLE.LIST:
        return (
          <StoryListView
            filteredStories={filteredStories}
            storySort={currentStorySort}
            sortDirection={currentListSortDirection}
            handleSortChange={setCurrentStorySort}
            handleSortDirectionChange={setListSortDirection}
          />
        );
      default:
        return null;
    }
  }, [currentStorySort, filteredStories, viewStyle, currentListSortDirection]);

  const BodyContent = useMemo(() => {
    if (filteredStoriesCount > 0) {
      return (
        <BodyWrapper>
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
          {storiesView}
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
    filteredStoriesCount,
    handleViewStyleBarButtonSelected,
    listBarLabel,
    storiesView,
    typeaheadValue,
    viewStyle,
    currentStorySort,
  ]);

  return (
    <FontProvider>
      <TransformProvider>
        <UnitsProvider pageSize={pageSize}>
          <MainNavBar />
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
                name="my-stories-filter-selection"
                value={storyStatus.value}
                isSelected={status === storyStatus.value}
                inputType="radio"
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
