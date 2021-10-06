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
import PropTypes from 'prop-types';
import { useMemo } from '@web-stories-wp/react';
import { getRelativeDisplayDate } from '@web-stories-wp/date';
import { __, sprintf } from '@web-stories-wp/i18n';
import {
  Headline,
  Text,
  THEME_CONSTANTS,
  Tooltip,
} from '@web-stories-wp/design-system';

/**
 * Internal dependencies
 */
import {
  InlineInputForm,
  StoryMenu,
  TableCell,
  TablePreviewCell,
  TableStatusCell,
} from '../../../../../components';
import { generateStoryMenu } from '../../../../../components/popoverMenu/story-menu-generator';
import { DISPLAY_STATUS, STORY_STATUS } from '../../../../../constants';
import {
  RenameStoryPropType,
  StoryMenuPropType,
  StoryPropType,
} from '../../../../../types';
import { titleFormatted } from '../../../../../utils';

import {
  LockIcon,
  PreviewWrapper,
  PreviewImage,
  StyledTableRow,
  TitleTableCellContainer,
} from './components';

function onFocusSelectAll(e) {
  window.getSelection().selectAllChildren(e.target);
}

function onBlurDeselectAll() {
  window.getSelection().removeAllRanges();
}

export const StoryListItem = ({
  story,
  renameStory,
  userId,
  storyMenu,
  storyStatus,
}) => {
  const isLocked = useMemo(
    () => story?.locked && userId !== story?.lockUser.id,
    [story, userId]
  );

  const formattedTitle = titleFormatted(story.title);

  const memoizedStoryMenu = useMemo(
    () => (
      <StoryMenu
        menuLabel={sprintf(
          /* translators: %s: story title.*/
          __('Context menu for %s', 'web-stories'),
          formattedTitle
        )}
        onMoreButtonSelected={(_, id) => storyMenu.handleMenuToggle(id)}
        contextMenuId={storyMenu.contextMenuId}
        storyId={story.id}
        menuItems={generateStoryMenu({
          menuItemActions: storyMenu.menuItemActions,
          menuItems: storyMenu.menuItems,
          story,
          isLocked,
        })}
        verticalAlign="center"
      />
    ),
    [isLocked, formattedTitle, storyMenu, story]
  );

  return (
    <StyledTableRow data-testid={`story-list-item-${story.id}`}>
      <TablePreviewCell>
        <Tooltip
          title={
            isLocked && story?.lockUser.name
              ? sprintf(
                  /* translators: %s: user name */
                  __('%s is currently editing this story', 'web-stories'),
                  story?.lockUser.name
                )
              : ''
          }
        >
          <PreviewWrapper>
            <PreviewImage
              {...(story.featuredMediaUrl
                ? {
                    src: story.featuredMediaUrl,
                    alt: formattedTitle,
                    as: 'img',
                  }
                : null)}
            />
            {isLocked && <LockIcon />}
          </PreviewWrapper>
        </Tooltip>
      </TablePreviewCell>
      <TableCell>
        <TitleTableCellContainer>
          {renameStory.id === story.id ? (
            <InlineInputForm
              onEditComplete={(newTitle) =>
                renameStory.handleOnRenameStory(story, newTitle)
              }
              onEditCancel={renameStory.handleCancelRename}
              value={story.title}
              id={story.id}
              label={__('Rename story', 'web-stories')}
            />
          ) : (
            <>
              <Headline
                tabIndex={0}
                onFocus={onFocusSelectAll}
                onBlur={onBlurDeselectAll}
                size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.XXX_SMALL}
                as="h4"
                aria-label={
                  isLocked
                    ? sprintf(
                        /* translators: 1: story title. 2: user currently editing the story. */
                        __('%1$s (locked by %2$s)', 'web-stories'),
                        formattedTitle,
                        story?.lockUser.name
                      )
                    : formattedTitle
                }
              >
                {formattedTitle}
              </Headline>
              {memoizedStoryMenu}
            </>
          )}
        </TitleTableCellContainer>
      </TableCell>
      <TableCell>
        <Text as="span" size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
          {story.author || '—'}
        </Text>
      </TableCell>
      <TableCell>
        <Text as="span" size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
          {getRelativeDisplayDate(story.created_gmt)}
        </Text>
      </TableCell>
      <TableCell>
        <Text as="span" size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
          {getRelativeDisplayDate(story.modified_gmt)}
        </Text>
      </TableCell>
      {storyStatus !== STORY_STATUS.DRAFT && (
        <TableStatusCell>
          <Text as="span" size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
            {DISPLAY_STATUS[story?.status]}
          </Text>
        </TableStatusCell>
      )}
    </StyledTableRow>
  );
};

StoryListItem.propTypes = {
  story: StoryPropType.isRequired,
  renameStory: RenameStoryPropType,
  userId: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  storyMenu: StoryMenuPropType.isRequired,
  storyStatus: PropTypes.string,
};
