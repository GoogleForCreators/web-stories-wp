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
import { VisuallyHidden } from '@googleforcreators/design-system';
import { getRelativeDisplayDate } from '@googleforcreators/date';
import { __, sprintf } from '@googleforcreators/i18n';
import PropTypes from 'prop-types';
import { useMemo, forwardRef } from '@googleforcreators/react';
import { css } from 'styled-components';
/**
 * Internal dependencies
 */
import { StoryMenu } from '../../../../../components';
import { generateStoryMenu } from '../../../../../components/popoverMenu/story-menu-generator';
import {
  DEFAULT_GRID_IMG_HEIGHT,
  DEFAULT_GRID_IMG_WIDTH,
  STORY_STATUS,
} from '../../../../../constants';
import {
  PageSizePropType,
  RenameStoryPropType,
  StoryMenuPropType,
  StoryPropType,
} from '../../../../../types';
import { titleFormatted } from '../../../../../utils';
import { useConfig } from '../../../../config';
import {
  Container,
  Poster,
  Gradient,
  Scrim,
} from '../../../shared/grid/components';
import { CardWrapper, CustomCardGridItem, ScrimAnchor } from './components';
import StoryDisplayContent from './storyDisplayContent';

const StoryGridItem = forwardRef(
  ({ onFocus, isActive, pageSize, renameStory, story, storyMenu }, ref) => {
    const { userId } = useConfig();
    const tabIndex = isActive ? 0 : -1;
    const titleRenameProps = renameStory
      ? {
          editMode: renameStory?.id === story?.id,
          onEditComplete: (newTitle) =>
            renameStory?.handleOnRenameStory(story, newTitle),
          onEditCancel: renameStory?.handleCancelRename,
        }
      : {};

    const isLocked = useMemo(
      () => story?.locked && userId !== story?.lockUser.id,
      [story, userId]
    );

    const generatedMenuItems = useMemo(
      () =>
        generateStoryMenu({
          menuItems: storyMenu.menuItems,
          story,
          isLocked,
        }),
      [storyMenu, story, isLocked]
    );

    const storyDate = getRelativeDisplayDate(
      story?.status === STORY_STATUS.DRAFT
        ? story?.modifiedGmt
        : story?.createdGmt
    );

    const formattedTitle = titleFormatted(story.title);

    const memoizedStoryMenu = useMemo(
      () =>
        generatedMenuItems.length ? (
          <StoryMenu
            menuLabel={
              isLocked
                ? sprintf(
                    /* translators: 1: story title. 2: user currently editing the story. */
                    __('Context menu for %1$s (locked by %2$s)', 'web-stories'),
                    formattedTitle,
                    story?.lockUser.name
                  )
                : sprintf(
                    /* translators: %s: story title.*/
                    __('Context menu for %s', 'web-stories'),
                    formattedTitle
                  )
            }
            itemActive={isActive}
            tabIndex={tabIndex}
            onMoreButtonSelected={storyMenu.handleMenuToggle}
            contextMenuId={storyMenu.contextMenuId}
            storyId={story.id}
            isInverted
            menuItems={generatedMenuItems}
            menuStyleOverrides={css`
              /* force menu position to bottom corner */
              margin: 0 0 0 auto;
            `}
          />
        ) : null,
      [
        isLocked,
        formattedTitle,
        story?.lockUser?.name,
        story.id,
        isActive,
        tabIndex,
        storyMenu,
        generatedMenuItems,
      ]
    );

    return (
      <CustomCardGridItem
        data-testid={`story-grid-item-${story.id}`}
        onFocus={onFocus}
        $posterHeight={pageSize.height}
        ref={ref}
        aria-label={sprintf(
          /* translators: %s: story title.*/
          __('Details about %s', 'web-stories'),
          formattedTitle
        )}
      >
        <Container>
          <CardWrapper>
            <Poster
              {...(story.featuredMediaUrl
                ? {
                    alt: sprintf(
                      /* translators: %s: Story title. */
                      __('%s Poster image', 'web-stories'),
                      formattedTitle
                    ),
                    as: 'img',
                    src: story.featuredMediaUrl,
                    decoding: 'async',
                  }
                : null)}
              width={DEFAULT_GRID_IMG_WIDTH}
              height={DEFAULT_GRID_IMG_HEIGHT}
            />
            <Gradient />
            <Scrim>
              {story?.capabilities?.hasEditAction && (
                <ScrimAnchor
                  className="grid-item-anchor"
                  data-testid="story-editor-grid-link"
                  tabIndex={tabIndex}
                  href={story.editStoryLink}
                >
                  <VisuallyHidden>
                    {sprintf(
                      /* translators: %s: Story title. */
                      __('Open %s in Editor', 'web-stories'),
                      formattedTitle
                    )}
                  </VisuallyHidden>
                </ScrimAnchor>
              )}
              <StoryDisplayContent
                author={story.author}
                contextMenu={memoizedStoryMenu}
                displayDate={storyDate}
                formattedTitle={formattedTitle}
                id={story.id}
                isLocked={isLocked}
                lockUser={story?.lockUser}
                status={story?.status}
                title={story.title}
                {...titleRenameProps}
              />
            </Scrim>
          </CardWrapper>
        </Container>
      </CustomCardGridItem>
    );
  }
);

StoryGridItem.displayName = 'StoryGridItem';

StoryGridItem.propTypes = {
  onFocus: PropTypes.func,
  isActive: PropTypes.bool,
  pageSize: PageSizePropType,
  renameStory: RenameStoryPropType,
  storyMenu: StoryMenuPropType,
  story: StoryPropType,
};

export default StoryGridItem;
