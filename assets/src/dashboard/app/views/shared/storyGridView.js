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
import { useState } from 'react';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import {
  CardGrid,
  CardGridItem,
  CardTitle,
  CardItemMenu,
  CardPreviewContainer,
  PreviewPage,
} from '../../../components';
import { StoriesPropType } from '../../../types';

export const DetailRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const StoryGrid = styled(CardGrid)`
  width: ${({ theme }) => `calc(100% - ${theme.pageGutter.desktop}px)`};

  @media ${({ theme }) => theme.breakpoint.smallDisplayPhone} {
    width: ${({ theme }) => `calc(100% - ${theme.pageGutter.min}px)`};
  }
`;

const StoryGridView = ({ filteredStories }) => {
  const [contextMenuId, setContextMenuId] = useState(-1);
  return (
    <StoryGrid>
      {filteredStories.map((story) => (
        <CardGridItem key={story.id}>
          <CardPreviewContainer
            editUrl={story.editStoryUrl}
            onPreviewClick={() => {}}
          >
            <PreviewPage page={story.pages[0]} />
          </CardPreviewContainer>
          <DetailRow>
            <CardTitle
              title={story.title}
              modifiedDate={story.modified.startOf('day').fromNow()}
            />
            <CardItemMenu
              onMoreButtonSelected={setContextMenuId}
              contextMenuId={contextMenuId}
              onMenuItemSelected={() => setContextMenuId(-1)}
              story={story}
            />
          </DetailRow>
        </CardGridItem>
      ))}
    </StoryGrid>
  );
};

StoryGridView.propTypes = {
  filteredStories: StoriesPropType,
};

export default StoryGridView;
