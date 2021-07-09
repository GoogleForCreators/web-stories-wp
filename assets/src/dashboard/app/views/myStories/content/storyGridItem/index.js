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
import { getRelativeDisplayDate } from '@web-stories-wp/date';
import { __, sprintf } from '@web-stories-wp/i18n';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import styled from 'styled-components';
/**
 * Internal dependencies
 */
import {
  CardGridItem,
  CardTitle,
  StoryCardPreview,
  StoryMenu,
} from '../../../../../components';
import { generateStoryMenu } from '../../../../../components/popoverMenu/story-menu-generator';
import { STORY_STATUS } from '../../../../../constants';
import {
  PageSizePropType,
  RenameStoryPropType,
  StoryMenuPropType,
  StoryPropType,
} from '../../../../../types';

export const DetailRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const StoryGridItem = ({
  bottomActionLabel,
  handleFocus,
  isActive,
  itemRefs = {},
  pageSize,
  renameStory,
  story,
  storyMenu,
}) => {
  const tabIndex = isActive ? 0 : -1;
  const titleRenameProps = renameStory
    ? {
        editMode: renameStory?.id === story?.id,
        onEditComplete: (newTitle) =>
          renameStory?.handleOnRenameStory(story, newTitle),
        onEditCancel: renameStory?.handleCancelRename,
      }
    : {};

  const generatedMenuItems = useMemo(
    () =>
      generateStoryMenu({
        menuItemActions: storyMenu.menuItemActions,
        menuItems: storyMenu.menuItems,
        story,
      }),
    [storyMenu, story]
  );

  const storyDate = getRelativeDisplayDate(
    story?.status === STORY_STATUS.DRAFT
      ? story?.modified_gmt
      : story?.created_gmt
  );

  return (
    <CardGridItem
      data-testid={`story-grid-item-${story.id}`}
      ref={(el) => {
        itemRefs.current[story.id] = el;
      }}
      onFocus={handleFocus}
      title={sprintf(
        /* translators: %s: story title.*/
        __('Details about %s', 'web-stories'),
        story.title
      )}
    >
      <StoryCardPreview
        itemActive={isActive}
        tabIndex={tabIndex}
        pageSize={pageSize}
        storyImage={story.featuredMediaUrl}
        bottomAction={{
          targetAction: story.bottomTargetAction,
          label: bottomActionLabel,
        }}
      />
      <DetailRow>
        <CardTitle
          tabIndex={tabIndex}
          title={story.title}
          titleLink={story.editStoryLink}
          status={story?.status}
          locked={story?.locked}
          lockUser={story?.lockUser}
          id={story.id}
          displayDate={storyDate}
          {...titleRenameProps}
        />

        <StoryMenu
          itemActive={isActive}
          tabIndex={tabIndex}
          onMoreButtonSelected={storyMenu.handleMenuToggle}
          contextMenuId={storyMenu.contextMenuId}
          storyId={story.id}
          menuItems={generatedMenuItems}
        />
      </DetailRow>
    </CardGridItem>
  );
};

StoryGridItem.propTypes = {
  bottomActionLabel: PropTypes.string,
  handleFocus: PropTypes.func,
  isActive: PropTypes.bool,
  itemRefs: PropTypes.shape({}),
  pageSize: PageSizePropType,
  renameStory: RenameStoryPropType,
  storyMenu: StoryMenuPropType,
  story: StoryPropType,
};

export default StoryGridItem;
