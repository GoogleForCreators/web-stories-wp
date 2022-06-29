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
import {
  useState,
  useCallback,
  useMemo,
  useEffect,
} from '@googleforcreators/react';
import { __, sprintf } from '@googleforcreators/i18n';
import { trackEvent } from '@googleforcreators/tracking';
import {
  LoadingSpinner,
  useSnackbar,
  Text,
  THEME_CONSTANTS,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { StoriesPropType, StoryActionsPropType } from '../../../../../types';
import { titleFormatted } from '../../../../../utils';
import {
  SortPropTypes,
  ViewPropTypes,
  ShowStoriesWhileLoadingPropType,
} from '../../../../../utils/useStoryView';
import { Dialog, LoadingContainer } from '../../../../../components';
import {
  VIEW_STYLE,
  STORY_CONTEXT_MENU_ACTIONS,
  STORY_CONTEXT_MENU_ITEMS,
} from '../../../../../constants';
import ListView from '../listView';
import StoryGridView from '../storyGridView';

const ACTIVE_DIALOG_DELETE_STORY = 'DELETE_STORY';
function StoriesView({ loading, sort, storyActions, stories, view }) {
  const [contextMenuId, setContextMenuId] = useState(-1);
  const [titleRenameId, setTitleRenameId] = useState(-1);

  const [activeDialog, setActiveDialog] = useState('');
  const [activeStory, setActiveStory] = useState(null);
  const [focusedStory, setFocusedStory] = useState({});
  const [returnStoryFocusId, setReturnStoryFocusId] = useState(null);

  const { showSnackbar } = useSnackbar();

  const isActiveDeleteStoryDialog =
    activeDialog === ACTIVE_DIALOG_DELETE_STORY && activeStory;

  const storiesById = useMemo(() => stories.map(({ id }) => id), [stories]);

  useEffect(() => {
    // if a dialog is opened and the keyboard used we need to return the focus of the proper grid item to ease keyboard usage
    // focusedStory is set when activeDialog is removed
    // then we use storiesById to find the proper index of the interacted with item and use that to decide where to move focus
    if (focusedStory.id && !returnStoryFocusId) {
      const storyArrayIndex = storiesById.indexOf(focusedStory.id);
      const isDeletedAdjustmentDirection = storyArrayIndex > 0 ? -1 : +1;
      const adjustedIndex = focusedStory.isDeleted
        ? isDeletedAdjustmentDirection
        : 0;
      const focusIndex = storyArrayIndex + adjustedIndex;
      const storyIdToFocus = storiesById[focusIndex];
      storyIdToFocus && setReturnStoryFocusId(storyIdToFocus);
    }
  }, [focusedStory, returnStoryFocusId, storiesById]);

  useEffect(() => {
    if (!activeDialog) {
      setActiveStory(null);
    }
  }, [activeDialog, setActiveStory]);

  useEffect(() => {
    // every time the activeDialog is truthy we want to reset our state that helps determine where to send focus back to when the dialog is closed
    if (activeDialog) {
      setFocusedStory({});
      setReturnStoryFocusId(null);
    }
  }, [activeDialog]);

  const handleOnRenameStory = useCallback(
    (story, newTitle) => {
      setTitleRenameId(-1);
      trackEvent('rename_story');
      storyActions.updateStory({ ...story, title: { raw: newTitle } });
    },
    [storyActions]
  );

  const handleOnDeleteStory = useCallback(() => {
    trackEvent('delete_story');
    storyActions.trashStory(activeStory);
    setFocusedStory({ id: activeStory.id, isDeleted: true });
    setActiveDialog('');
  }, [storyActions, activeStory]);

  // menu item actions
  const handleOpenStoryInEditor = useCallback(() => {
    setContextMenuId(-1);
    trackEvent('open_in_editor');
  }, []);

  const handleRenameStory = useCallback((story) => {
    setContextMenuId(-1);
    setTitleRenameId(story.id);
  }, []);

  const handleDuplicateStory = useCallback(
    (story) => {
      setContextMenuId(-1);
      trackEvent('duplicate_story');
      storyActions.duplicateStory(story);
      setFocusedStory({ id: story.id });
    },
    [storyActions]
  );

  const handleDeleteStory = useCallback((story) => {
    setContextMenuId(-1);
    setActiveStory(story);
    setActiveDialog(ACTIVE_DIALOG_DELETE_STORY);
  }, []);

  const handleCopyStoryLink = useCallback(
    (story) => {
      setContextMenuId(-1);
      window.navigator.clipboard.writeText(story.link);

      showSnackbar({
        message: sprintf(
          /* translators: %s: story title. */
          __('%s has been copied to your clipboard.', 'web-stories'),
          titleFormatted(story.title)
        ),
        dismissible: true,
      });
      setFocusedStory({ id: story.id });
    },
    [showSnackbar]
  );

  const menuItems = STORY_CONTEXT_MENU_ITEMS.map((item) => {
    switch (item?.value) {
      case STORY_CONTEXT_MENU_ACTIONS.COPY_STORY_LINK:
        item.action = handleCopyStoryLink;
        break;
      case STORY_CONTEXT_MENU_ACTIONS.DELETE:
        item.action = handleDeleteStory;
        break;
      case STORY_CONTEXT_MENU_ACTIONS.DUPLICATE:
        item.action = handleDuplicateStory;
        break;
      case STORY_CONTEXT_MENU_ACTIONS.OPEN_STORY_LINK:
        item.action = handleOpenStoryInEditor;
        break;
      case STORY_CONTEXT_MENU_ACTIONS.RENAME:
        item.action = handleRenameStory;
        break;
      default:
        item.action = () => setContextMenuId(-1);
        break;
    }
    return item;
  });

  const storyMenu = useMemo(() => {
    return {
      handleMenuToggle: setContextMenuId,
      contextMenuId,
      menuItems,
    };
  }, [contextMenuId, menuItems, setContextMenuId]);

  const renameStory = useMemo(() => {
    return {
      id: titleRenameId,
      handleOnRenameStory,
      handleCancelRename: () => setTitleRenameId(-1),
    };
  }, [handleOnRenameStory, setTitleRenameId, titleRenameId]);

  const ActiveView = useMemo(() => {
    // Stories should be shown when we trigger a fetch from `InfiniteScroll`.
    // Stories should be hidden when a filter is changed.
    if (view.style === VIEW_STYLE.LIST) {
      // StoryListView needs to show the table header when loading stories
      // when filtering.
      return (
        <ListView
          handleSortChange={sort.set}
          handleSortDirectionChange={sort.setDirection}
          hideStoryList={
            loading?.isLoading && !loading?.showStoriesWhileLoading.current
          }
          pageSize={view.pageSize}
          renameStory={renameStory}
          sortDirection={sort.direction}
          stories={stories}
          storyMenu={storyMenu}
          storySort={sort.value}
        />
      );
    }

    if (
      !loading?.isLoading ||
      (loading?.isLoading && loading?.showStoriesWhileLoading.current)
    ) {
      return (
        <StoryGridView
          isLoading={loading?.isLoading}
          pageSize={view.pageSize}
          renameStory={renameStory}
          storyMenu={storyMenu}
          stories={stories}
          returnStoryFocusId={{
            value: returnStoryFocusId,
            set: setReturnStoryFocusId,
          }}
        />
      );
    }

    // Hide all stories when filter is triggered.
    return null;
  }, [
    loading,
    renameStory,
    returnStoryFocusId,
    sort,
    stories,
    storyMenu,
    view,
  ]);

  return (
    <>
      {ActiveView}
      {loading?.isLoading && !loading?.showStoriesWhileLoading.current && (
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      )}
      {isActiveDeleteStoryDialog && (
        <Dialog
          isOpen
          contentLabel={__('Dialog to confirm deleting a story', 'web-stories')}
          title={__('Delete Story', 'web-stories')}
          onClose={() => {
            setFocusedStory({ id: activeStory.id });
            setActiveDialog('');
          }}
          secondaryText={__('Cancel', 'web-stories')}
          secondaryRest={{
            ['aria-label']: sprintf(
              /* translators: %s: story title. */
              __('Cancel deleting story "%s"', 'web-stories'),
              titleFormatted(activeStory.title)
            ),
          }}
          primaryText={__('Delete', 'web-stories')}
          onPrimary={handleOnDeleteStory}
          primaryRest={{
            ['aria-label']: sprintf(
              /* translators: %s: story title. */
              __('Confirm deleting story "%s"', 'web-stories'),
              titleFormatted(activeStory.title)
            ),
          }}
        >
          <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
            {sprintf(
              /* translators: %s: story title. */
              __('Are you sure you want to delete "%s"?', 'web-stories'),
              titleFormatted(activeStory.title)
            )}
          </Text>
        </Dialog>
      )}
    </>
  );
}

StoriesView.propTypes = {
  loading: PropTypes.shape({
    isLoading: PropTypes.bool,
    showStoriesWhileLoading: ShowStoriesWhileLoadingPropType,
  }),
  sort: SortPropTypes,
  storyActions: StoryActionsPropType,
  stories: StoriesPropType,
  view: ViewPropTypes,
};
export default StoriesView;
