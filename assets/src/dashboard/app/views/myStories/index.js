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
import { FloatingTab, ListBar } from '../../../components';
import { VIEW_STYLE, STORY_STATUSES } from '../../../constants';
import { ApiContext } from '../../api/apiProvider';
import { UnitsProvider } from '../../../../edit-story/units';
import { TransformProvider } from '../../../../edit-story/components/transform';
import FontProvider from '../../font/fontProvider';
import usePagePreviewSize from '../../../utils/usePagePreviewSize';
import StoryGridView from './storyGridView';
import PageHeading from './pageHeading';
import NoResults from './noResults';

const FilterContainer = styled.div`
  padding: 0 20px 20px 0;
  margin: ${({ theme }) => `0 ${theme.pageGutter.desktop}px`};
  border-bottom: ${({ theme: t }) => t.subNavigationBar.border};

  @media ${({ theme }) => theme.breakpoint.min} {
    margin: ${({ theme }) => `0 ${theme.pageGutter.min}px`};
  }

  @media ${({ theme }) => theme.breakpoint.trueMobile} {
    & > label {
      border-radius: 0;
      box-shadow: none;
      padding: 0 10px 0 0;
    }
  }
`;
const BodyWrapper = styled.div`
  margin: ${({ theme }) => `0 ${theme.pageGutter.desktop}px`};

  @media ${({ theme }) => theme.breakpoint.min} {
    margin: ${({ theme }) => `0 ${theme.pageGutter.min}px`};
  }
`;

const ListBarContainer = styled.div`
  margin-top: 10px;
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

function MyStories() {
  const [status, setStatus] = useState(STORY_STATUSES[0].value);
  const [typeaheadValue, setTypeaheadValue] = useState('');
  const [viewStyle, setViewStyle] = useState(VIEW_STYLE.GRID);
  const { pageSize } = usePagePreviewSize();
  const {
    actions: { fetchStories },
    state: { stories },
  } = useContext(ApiContext);

  useEffect(() => {
    fetchStories({ status });
  }, [fetchStories, status]);

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

  const BodyContent = useMemo(() => {
    if (filteredStoriesCount > 0) {
      return (
        <BodyWrapper>
          <ListBarContainer>
            <ListBar
              label={listBarLabel}
              layoutStyle={viewStyle}
              onPress={handleViewStyleBarButtonSelected}
            />
          </ListBarContainer>
          <StoryGridView filteredStories={filteredStories} />
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
    filteredStories,
    filteredStoriesCount,
    handleViewStyleBarButtonSelected,
    listBarLabel,
    typeaheadValue,
    viewStyle,
  ]);

  return (
    <FontProvider>
      <TransformProvider>
        <UnitsProvider pageSize={pageSize}>
          <PageHeading
            defaultTitle={__('My Stories', 'web-stories')}
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
