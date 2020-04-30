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
import { __, sprintf } from '@wordpress/i18n';
/**
 * External dependencies
 */
import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
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
  ActionLabel,
  PreviewPage,
} from '../../../components';
import { StoriesPropType } from '../../../types';
import { STORY_CONTEXT_MENU_ACTIONS } from '../../../constants';
import PreviewErrorBoundary from '../../../components/previewErrorBoundary';

export const DetailRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const StoryGrid = styled(CardGrid)`
  width: ${({ theme }) => `calc(100% - ${theme.pageGutter.small.desktop}px)`};

  @media ${({ theme }) => theme.breakpoint.smallDisplayPhone} {
    width: ${({ theme }) => `calc(100% - ${theme.pageGutter.small.min}px)`};
  }
`;

const StoryGridView = ({
  filteredStories,
  centerActionLabel,
  bottomActionLabel,
  updateStory,
  trashStory,
  duplicateStory,
}) => {
  const [contextMenuId, setContextMenuId] = useState(-1);
  const [titleRenameId, setTitleRenameId] = useState(-1);

  const handleMenuItemSelected = useCallback(
    (sender, story) => {
      setContextMenuId(-1);
      switch (sender.value) {
        case STORY_CONTEXT_MENU_ACTIONS.OPEN_IN_EDITOR:
          window.location.href = story.bottomTargetAction;
          break;
        case STORY_CONTEXT_MENU_ACTIONS.RENAME:
          setTitleRenameId(story.id);
          break;

        case STORY_CONTEXT_MENU_ACTIONS.DUPLICATE:
          duplicateStory(story);
          break;

        case STORY_CONTEXT_MENU_ACTIONS.DELETE:
          if (
            window.confirm(
              sprintf(
                /* translators: %s: story title. */
                __('Are you sure you want to delete "%s"?', 'web-stories'),
                story.title
              )
            )
          ) {
            trashStory(story);
          }
          break;

        default:
          break;
      }
    },
    [trashStory, duplicateStory]
  );

  const handleOnRenameStory = useCallback(
    (story, newTitle) => {
      setTitleRenameId(-1);
      updateStory({ ...story, title: { raw: newTitle } });
    },
    [updateStory]
  );

  return (
    <StoryGrid>
      {filteredStories.map((story) => (
        <CardGridItem key={story.id}>
          <CardPreviewContainer
            centerAction={{
              targetAction: story.centerTargetAction,
              label: centerActionLabel,
            }}
            bottomAction={{
              targetAction: story.bottomTargetAction,
              label: bottomActionLabel,
            }}
          >
            <PreviewErrorBoundary>
              <PreviewPage page={story.pages[0]} />
            </PreviewErrorBoundary>
          </CardPreviewContainer>
          <DetailRow>
            <CardTitle
              title={story.title}
              modifiedDate={story.modified.startOf('day').fromNow()}
              onEditComplete={(newTitle) =>
                handleOnRenameStory(story, newTitle)
              }
              onEditCancel={() => setTitleRenameId(-1)}
              editMode={titleRenameId === story.id}
            />
            <CardItemMenu
              onMoreButtonSelected={setContextMenuId}
              contextMenuId={contextMenuId}
              onMenuItemSelected={handleMenuItemSelected}
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
  centerActionLabel: ActionLabel,
  bottomActionLabel: ActionLabel,
  updateStory: PropTypes.func.isRequired,
  trashStory: PropTypes.func.isRequired,
  duplicateStory: PropTypes.func.isRequired,
};

export default StoryGridView;
