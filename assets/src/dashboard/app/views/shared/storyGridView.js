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
import { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { getRelativeDisplayDate } from '@web-stories-wp/date';
import { useGridViewKeys, useFocusOut } from '@web-stories-wp/design-system';
/**
 * Internal dependencies
 */
import {
  CardGrid,
  CardGridItem,
  CardTitle,
  StoryCardPreview,
  ActionLabel,
  StoryMenu,
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
      // TODO this is broken
      itemRefs.current?.[newFocusId]?.focus();
      setActiveGridItemId(newFocusId);
    }
  }, [activeGridItemId, returnStoryFocusId]);

  // when keyboard focus changes through FocusableGridItem immediately focus the edit preview layer on top of preview
  useEffect(() => {
    if (activeGridItemId) {
      activeGridItemIdRef.current = activeGridItemId;
    }
  }, [activeGridItemId]);

  // if keyboard is used instead of mouse the useFocusOut doesn't get triggered
  // that is where we are setting active grid item ID to null
  // by doing this here as well we are ensuring consistent functionality
  const manuallySetFocusOut = useCallback(() => {
    activeGridItemIdRef.current = null;
    setActiveGridItemId(null);
    returnStoryFocusId.set(null);
  }, [returnStoryFocusId]);

  useFocusOut(containerRef, () => setActiveGridItemId(null), []);

  const modifiedStoryMenu = useMemo(() => {
    return {
      ...storyMenu,
      menuItemActions: {
        ...storyMenu.menuItemActions,
        [STORY_CONTEXT_MENU_ACTIONS.DELETE]: (story) => {
          manuallySetFocusOut();
          storyMenu.menuItemActions[STORY_CONTEXT_MENU_ACTIONS.DELETE](story);
        },
        [STORY_CONTEXT_MENU_ACTIONS.DUPLICATE]: (story) => {
          manuallySetFocusOut();
          storyMenu.menuItemActions[STORY_CONTEXT_MENU_ACTIONS.DUPLICATE](
            story
          );
        },
        [STORY_CONTEXT_MENU_ACTIONS.COPY_STORY_LINK]: (story) => {
          manuallySetFocusOut();
          storyMenu.menuItemActions[STORY_CONTEXT_MENU_ACTIONS.COPY_STORY_LINK](
            story
          );
        },
      },
    };
  }, [manuallySetFocusOut, storyMenu]);

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
              ref={(el) => {
                itemRefs.current[story.id] = el;
              }}
              onFocus={() => {
                setActiveGridItemId(story.id);
              }}
              title={sprintf(
                /* translators: %s: story title.*/
                __('Details about %s', 'web-stories'),
                story.title
              )}
            >
              <StoryCardPreview
                ariaLabel={sprintf(
                  /* translators: %s: story title. */
                  __('Preview of %s', 'web-stories'),
                  story.title
                )}
                itemActive={isActive}
                tabIndex={tabIndex}
                pageSize={pageSize}
                storyImage={story.featuredMediaUrl}
                bottomAction={{
                  targetAction: story.bottomTargetAction,
                  label: bottomActionLabel,
                }}
                // handleFocus={() => setActiveGridItemId(story.id)}
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
  returnStoryFocusId: PropTypes.shape({
    value: PropTypes.number,
    set: PropTypes.func,
  }),
};

export default StoryGridView;
