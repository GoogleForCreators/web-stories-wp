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
import { useState, useCallback, useMemo, useEffect } from 'react';
import { useFeature } from 'flagged';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
  DateSettingsPropType,
  StoriesPropType,
  StoryActionsPropType,
  UsersPropType,
} from '../../../../../types';
import {
  SortPropTypes,
  ViewPropTypes,
} from '../../../../../utils/useStoryView';
import { Button, Dialog, useToastContext } from '../../../../../components';
import {
  VIEW_STYLE,
  STORY_ITEM_CENTER_ACTION_LABELS,
  STORY_CONTEXT_MENU_ACTIONS,
  STORY_CONTEXT_MENU_ITEMS,
  BUTTON_TYPES,
  ALERT_SEVERITY,
} from '../../../../../constants';
import { StoryGridView, StoryListView } from '../../../shared';
import { trackEvent } from '../../../../../../tracking';

const ACTIVE_DIALOG_DELETE_STORY = 'DELETE_STORY';
function StoriesView({
  filterValue,
  sort,
  storyActions,
  stories,
  users,
  view,
  dateSettings,
}) {
  const [contextMenuId, setContextMenuId] = useState(-1);
  const [titleRenameId, setTitleRenameId] = useState(-1);
  const enableInProgressStoryActions = useFeature(
    'enableInProgressStoryActions'
  );
  const enableStoryPreviews = useFeature('enableStoryPreviews');

  const [activeDialog, setActiveDialog] = useState('');
  const [activeStory, setActiveStory] = useState(null);

  const {
    actions: { addToast },
  } = useToastContext();
  const isActiveDeleteStoryDialog =
    activeDialog === ACTIVE_DIALOG_DELETE_STORY && activeStory;

  useEffect(() => {
    if (!activeDialog) {
      setActiveStory(null);
    }
  }, [activeDialog, setActiveStory]);

  const handleOnRenameStory = useCallback(
    async (story, newTitle) => {
      setTitleRenameId(-1);
      await trackEvent('rename_story', 'dashboard');
      storyActions.updateStory({ ...story, title: { raw: newTitle } });
    },
    [storyActions]
  );

  const handleOnDeleteStory = useCallback(async () => {
    await trackEvent('delete_story', 'dashboard');
    storyActions.trashStory(activeStory);
    setActiveDialog('');
  }, [storyActions, activeStory]);

  const handleMenuItemSelected = useCallback(
    async (sender, story) => {
      setContextMenuId(-1);
      switch (sender.value) {
        case STORY_CONTEXT_MENU_ACTIONS.OPEN_IN_EDITOR:
          await trackEvent('open_in_editor', 'dashboard');
          window.location.href = story.bottomTargetAction;
          break;
        case STORY_CONTEXT_MENU_ACTIONS.RENAME:
          setTitleRenameId(story.id);
          break;

        case STORY_CONTEXT_MENU_ACTIONS.DUPLICATE:
          await trackEvent('duplicate_story', 'dashboard');
          storyActions.duplicateStory(story);
          break;

        case STORY_CONTEXT_MENU_ACTIONS.CREATE_TEMPLATE:
          storyActions.createTemplateFromStory(story);
          break;

        case STORY_CONTEXT_MENU_ACTIONS.DELETE:
          setActiveStory(story);
          setActiveDialog(ACTIVE_DIALOG_DELETE_STORY);
          break;

        case STORY_CONTEXT_MENU_ACTIONS.COPY_STORY_LINK:
          global.navigator.clipboard.writeText(story.link);

          addToast({
            message: {
              title: __('URL copied', 'web-stories'),
              body:
                story.title.length > 0
                  ? sprintf(
                      /* translators: %s is the story title. */
                      __(
                        '%s has been copied to your clipboard.',
                        'web-stories'
                      ),
                      story.title
                    )
                  : __(
                      '(no title) has been copied to your clipboard.',
                      'web-stories'
                    ),
            },
            severity: ALERT_SEVERITY.SUCCESS,
            id: Date.now(),
          });
          break;

        default:
          break;
      }
    },
    [addToast, storyActions]
  );

  const enabledMenuItems = useMemo(() => {
    if (enableInProgressStoryActions) {
      return STORY_CONTEXT_MENU_ITEMS;
    }
    return STORY_CONTEXT_MENU_ITEMS.filter((item) => !item.inProgress);
  }, [enableInProgressStoryActions]);

  const storyMenu = useMemo(() => {
    return {
      handleMenuToggle: setContextMenuId,
      contextMenuId,
      handleMenuItemSelected,
      menuItems: enabledMenuItems,
    };
  }, [
    setContextMenuId,
    contextMenuId,
    handleMenuItemSelected,
    enabledMenuItems,
  ]);

  const renameStory = useMemo(() => {
    return {
      id: titleRenameId,
      handleOnRenameStory,
      handleCancelRename: () => setTitleRenameId(-1),
    };
  }, [handleOnRenameStory, setTitleRenameId, titleRenameId]);

  const ActiveView =
    view.style === VIEW_STYLE.LIST ? (
      <StoryListView
        handleSortChange={sort.set}
        handleSortDirectionChange={sort.setDirection}
        pageSize={view.pageSize}
        renameStory={renameStory}
        sortDirection={sort.direction}
        stories={stories}
        storyMenu={storyMenu}
        storySort={sort.value}
        storyStatus={filterValue}
        users={users}
        dateSettings={dateSettings}
      />
    ) : (
      <StoryGridView
        bottomActionLabel={__('Open in editor', 'web-stories')}
        centerActionLabelByStatus={
          enableStoryPreviews && STORY_ITEM_CENTER_ACTION_LABELS
        }
        pageSize={view.pageSize}
        renameStory={renameStory}
        previewStory={storyActions.handlePreviewStory}
        storyMenu={storyMenu}
        stories={stories}
        users={users}
        dateSettings={dateSettings}
      />
    );

  return (
    <>
      {ActiveView}
      {isActiveDeleteStoryDialog && (
        <Dialog
          isOpen={true}
          contentLabel={__('Dialog to confirm deleting a story', 'web-stories')}
          title={__('Delete Story', 'web-stories')}
          onClose={() => setActiveDialog('')}
          actions={
            <>
              <Button
                type={BUTTON_TYPES.DEFAULT}
                onClick={() => setActiveDialog('')}
              >
                {__('Cancel', 'web-stories')}
              </Button>
              <Button type={BUTTON_TYPES.DEFAULT} onClick={handleOnDeleteStory}>
                {__('Delete', 'web-stories')}
              </Button>
            </>
          }
        >
          {sprintf(
            /* translators: %s: story title. */
            __('Are you sure you want to delete "%s"?', 'web-stories'),
            activeStory.title
          )}
        </Dialog>
      )}
    </>
  );
}

StoriesView.propTypes = {
  filterValue: PropTypes.string,
  sort: SortPropTypes,
  storyActions: StoryActionsPropType,
  stories: StoriesPropType,
  users: UsersPropType,
  view: ViewPropTypes,
  dateSettings: DateSettingsPropType,
};
export default StoriesView;
