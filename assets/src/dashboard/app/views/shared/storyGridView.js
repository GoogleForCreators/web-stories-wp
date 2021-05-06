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
import { __, sprintf } from '@web-stories-wp/i18n';
/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useRef, useEffect, useState, useMemo } from 'react';
import { getRelativeDisplayDate } from '@web-stories-wp/date';

/**
 * Internal dependencies
 */
import {
  CardGrid,
  CardGridItem,
  CardTitle,
  CardPreviewContainer,
  ActionLabel,
  StoryMenu,
  FocusableGridItem,
} from '../../../components';
import {
  StoriesPropType,
  StoryMenuPropType,
  PageSizePropType,
  RenameStoryPropType,
} from '../../../types';
import {
  PAGE_WRAPPER,
  STORY_CONTEXT_MENU_ACTIONS,
  STORY_STATUS,
} from '../../../constants';
import { useGridViewKeys, useFocusOut } from '../../../../design-system';
import { useConfig } from '../../config';
import { generateStoryMenu } from '../../../components/popoverMenu/story-menu-generator';

export const DetailRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const StoryGrid = styled(CardGrid)`
  width: calc(100% - ${PAGE_WRAPPER.GUTTER}px);
`;

const StoryGridView = ({
  stories,
  bottomActionLabel,
  isSavedTemplate,
  pageSize,
  storyMenu,
  renameStory,
  returnStoryFocusId,
}) => {
  const { isRTL } = useConfig();
  const containerRef = useRef();
  const gridRef = useRef();
  const itemRefs = useRef({});
  const [activeGridItemId, setActiveGridItemId] = useState();
  const activeGridItemIdRef = useRef();

  useGridViewKeys({
    containerRef,
    gridRef,
    itemRefs,
    isRTL,
    currentItemId: activeGridItemId,
    items: stories,
  });

  // We only want to force focus when returning to the grid from a dialog
  // By checking to see if the active grid item no longer exists
  // in tandem with the returnStoryFocusId being present from the parent
  // AND that the activeGridItemIdRef.current is null we know that
  // the user is coming from a dialog not just moving grid items
  useEffect(() => {
    if (
      !activeGridItemId &&
      returnStoryFocusId.value &&
      !activeGridItemIdRef.current
    ) {
      const newFocusId = returnStoryFocusId?.value;
      itemRefs.current?.[newFocusId]?.children?.[0]?.focus();
    }
  }, [activeGridItemId, returnStoryFocusId]);

  // when keyboard focus changes through FocusableGridItem immediately focus the edit preview layer on top of preview
  useEffect(() => {
    if (activeGridItemId && activeGridItemId !== activeGridItemIdRef.current) {
      activeGridItemIdRef.current = activeGridItemId;
      itemRefs.current?.[activeGridItemId]?.children[2].focus();
    }
  }, [activeGridItemId]);

  useFocusOut(containerRef, () => setActiveGridItemId(null), []);

  const modifiedStoryMenu = useMemo(() => {
    return {
      ...storyMenu,
      menuItemActions: {
        ...storyMenu.menuItemActions,
        [STORY_CONTEXT_MENU_ACTIONS.DELETE]: (story) => {
          // if keyboard is used instead of mouse the useFocusOut doesn't get triggered
          // that is where we are setting active grid item ID to null
          // by doing this here as well we are ensuring consistent functionality
          activeGridItemIdRef.current = null;
          setActiveGridItemId(null);
          returnStoryFocusId.set(null);
          storyMenu.menuItemActions[STORY_CONTEXT_MENU_ACTIONS.DELETE](story);
        },
      },
    };
  }, [returnStoryFocusId, storyMenu]);

  return (
    <div ref={containerRef}>
      <StoryGrid
        pageSize={pageSize}
        ref={gridRef}
        role="list"
        ariaLabel={__('Viewing stories', 'web-stories')}
      >
        {stories.map((story) => {
          const isActive = activeGridItemId === story.id;
          const tabIndex = isActive ? 0 : -1;
          const titleRenameProps = renameStory
            ? {
                editMode: renameStory?.id === story?.id,
                onEditComplete: (newTitle) =>
                  renameStory?.handleOnRenameStory(story, newTitle),
                onEditCancel: renameStory?.handleCancelRename,
              }
            : {};

          return (
            <CardGridItem
              key={story.id}
              data-testid={`story-grid-item-${story.id}`}
              role="listitem"
              ref={(el) => {
                itemRefs.current[story.id] = el;
              }}
            >
              <FocusableGridItem
                onFocus={() => setActiveGridItemId(story.id)}
                isSelected={isActive}
                tabIndex={tabIndex}
                title={sprintf(
                  /* translators: %s: story title.*/
                  __('Press Enter to explore details about %s', 'web-stories'),
                  story.title
                )}
              />
              <CardPreviewContainer
                ariaLabel={sprintf(
                  /* translators: %s: story title. */
                  __('preview of %s', 'web-stories'),
                  story.title
                )}
                tabIndex={tabIndex}
                pageSize={pageSize}
                story={story}
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
                  secondaryTitle={
                    isSavedTemplate ? __('Google', 'web-stories') : story.author
                  }
                  displayDate={
                    story?.status === STORY_STATUS.DRAFT
                      ? getRelativeDisplayDate(story?.modified_gmt)
                      : getRelativeDisplayDate(story?.created_gmt)
                  }
                  {...titleRenameProps}
                />

                <StoryMenu
                  itemActive={isActive}
                  tabIndex={tabIndex}
                  onMoreButtonSelected={modifiedStoryMenu.handleMenuToggle}
                  contextMenuId={modifiedStoryMenu.contextMenuId}
                  story={story}
                  menuItems={generateStoryMenu({
                    menuItemActions: modifiedStoryMenu.menuItemActions,
                    menuItems: modifiedStoryMenu.menuItems,
                    story,
                  })}
                />
              </DetailRow>
            </CardGridItem>
          );
        })}
      </StoryGrid>
    </div>
  );
};

StoryGridView.propTypes = {
  isTemplate: PropTypes.bool,
  isSavedTemplate: PropTypes.bool,
  stories: StoriesPropType,
  centerActionLabelByStatus: PropTypes.oneOfType([
    PropTypes.objectOf(PropTypes.string),
    PropTypes.bool,
  ]),
  bottomActionLabel: ActionLabel,
  pageSize: PageSizePropType.isRequired,
  storyMenu: StoryMenuPropType,
  renameStory: RenameStoryPropType,
  returnStoryFocusId: PropTypes.number,
};

export default StoryGridView;
