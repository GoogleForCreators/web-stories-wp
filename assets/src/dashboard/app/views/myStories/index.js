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
import styled from 'styled-components';
import { useCallback, useContext, useEffect, useState, useMemo } from 'react';

/**
 * Internal dependencies
 */
import {
  ViewHeader,
  FloatingTab,
  StoryGrid,
  CardGridItem,
  CardTitle,
  CardPreviewContainer,
  ListBar,
  TypeaheadInput,
} from '../../../components';
import { VIEW_STYLE, STORY_STATUSES } from '../../../constants';
import { ApiContext } from '../../api/apiProvider';

const PageHeading = styled.div``;
const FilterContainer = styled.div`
  padding: 0 20px 20px;
  border-bottom: ${({ theme }) => theme.subNavigationBar.border};
`;

function MyStories() {
  const [viewStyle, setViewStyle] = useState(VIEW_STYLE.GRID);
  const {
    actions: { fetchStories },
    state: { stories },
  } = useContext(ApiContext);

  const [status, setStatus] = useState(STORY_STATUSES[0].value);
  const [typeaheadValue, setTypeaheadValue] = useState('');
  const [filteredStories, setFilteredStories] = useState([]);
  const [displayStories, setDisplayStories] = useState(stories);

  useEffect(() => {
    fetchStories({ status });
  }, [fetchStories, status]);

  // Set display stories depending on if filtering
  useMemo(() => {
    if (typeaheadValue.length > 0) {
      return setDisplayStories(filteredStories);
    }
    return setDisplayStories(stories);
  }, [stories, filteredStories, typeaheadValue]);

  // Actually filter the stories, occurs from onTypeaheadInputChange.
  // Only ever filtering from the page query (my stories, templates, bookmarks)
  // so all necessary data is already in context
  const filterStories = useCallback(() => {
    const filterResults = stories.filter((story) => {
      const lowerTypeaheadValue = typeaheadValue.toString().toLowerCase();

      return (
        story.title.toLowerCase().includes(lowerTypeaheadValue) ||
        story.id.toString().toLowerCase().includes(lowerTypeaheadValue)
      );
    });
    setFilteredStories(filterResults);
  }, [stories, typeaheadValue, setFilteredStories]);

  useEffect(() => {
    fetchStories({ status });
  }, [fetchStories, status]);

  const handleViewStyleBarButtonSelected = useCallback(() => {
    if (viewStyle === VIEW_STYLE.LIST) {
      setViewStyle(VIEW_STYLE.GRID);
    } else {
      setViewStyle(VIEW_STYLE.LIST);
    }
  }, [viewStyle]);

  // controls setting typeaheadValue, this triggers setting displayStories
  // TODO update typeahead to return the object of the selection
  const onTypeaheadInputChange = useCallback((val) => {
    setTypeaheadValue(val);
  }, []);

  // structures stories for potential filtering based on stories from context and gives them the keys the input expects.
  // metadata is to handle the custom filter parameters within myStories
  const typeaheadMenuOptions = useMemo(() => {
    return displayStories.map((displayStory) => {
      return {
        label: displayStory.title,
        value: displayStory.id,
        metadata: [
          displayStory.title,
          displayStory.id.toString(),
          displayStory.status,
        ],
      };
    });
  }, [displayStories]);

  return (
    <div>
      <PageHeading>
        <ViewHeader>{__('My Stories', 'web-stories')}</ViewHeader>
        <TypeaheadInput
          inputId="my-stories-search"
          items={typeaheadMenuOptions}
          onChange={(val) => {
            onTypeaheadInputChange(val);
          }}
          onKeyUp={filterStories()}
          value={typeaheadValue}
          placeholder={__('Search Stories', 'web-stories')}
          ariaLabel={__('Search Stories', 'web-stories')}
        />
      </PageHeading>

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
      <ListBar
        label={`${displayStories.length} ${__('total Stories', 'web-stories')}`}
        layoutStyle={viewStyle}
        onPress={handleViewStyleBarButtonSelected}
      />
      <StoryGrid>
        {displayStories.map((story) => (
          <CardGridItem key={story.id}>
            <CardPreviewContainer
              onOpenInEditorClick={() => {}}
              onPreviewClick={() => {}}
              previewSource={'http://placeimg.com/225/400/nature'}
            />
            <CardTitle
              title={story.title}
              modifiedDate={story.modified.startOf('day').fromNow()}
            />
          </CardGridItem>
        ))}
      </StoryGrid>
    </div>
  );
}

export default MyStories;
