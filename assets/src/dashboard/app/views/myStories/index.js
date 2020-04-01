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
import { useCallback, useContext, useEffect, useState } from 'react';

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
} from '../../../components';
import { LIST_STATE, STORY_STATUSES } from '../../../constants';
import { ApiContext } from '../../api/apiProvider';

const FilterContainer = styled.div`
  padding: 0 20px 20px;
  border-bottom: ${({ theme }) => theme.subNavigationBar.border};
`;

function MyStories() {
  const [status, setStatus] = useState(STORY_STATUSES[0].value);
  const [listState, setListState] = useState(LIST_STATE.GRID);
  const {
    actions: { fetchStories },
    state: { stories },
  } = useContext(ApiContext);

  useEffect(() => {
    fetchStories({ status });
  }, [fetchStories, status]);

  const handleListBarButtonSelected = useCallback(() => {
    if (listState === LIST_STATE.LIST) {
      setListState(LIST_STATE.GRID);
    } else {
      setListState(LIST_STATE.LIST);
    }
  }, [listState]);

  return (
    <div>
      <ViewHeader>{__('My Stories', 'web-stories')}</ViewHeader>
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
        label={`${stories.length} ${__('total Stories', 'web-stories')}`}
        state={listState}
        onPress={handleListBarButtonSelected}
      />
      <StoryGrid>
        {stories.map((story) => (
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
