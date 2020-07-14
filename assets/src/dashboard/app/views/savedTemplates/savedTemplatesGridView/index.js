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
import { useState, useCallback, useMemo } from 'react';
import { useFeature } from 'flagged';

/**
 * Internal dependencies
 */
import {
  TEMPLATES_GALLERY_ITEM_CENTER_ACTION_LABELS,
  STORY_CONTEXT_MENU_ITEMS,
} from '../../../../constants';
import { ViewPropTypes } from '../../../../utils/useStoryView';
import { StoriesPropType } from '../../../../types';
import { StoryGridView } from '../../shared';

function SavedTemplatesGridView({ stories, view }) {
  const [contextMenuId, setContextMenuId] = useState(-1);
  const enableInProgressStoryActions = useFeature(
    'enableInProgressStoryActions'
  );

  const handleMenuItemSelected = useCallback(() => {
    setContextMenuId(-1);
  }, []);

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

  return (
    <StoryGridView
      bottomActionLabel={__('Use template', 'web-stories')}
      centerActionLabelByStatus={TEMPLATES_GALLERY_ITEM_CENTER_ACTION_LABELS}
      isSavedTemplate
      pageSize={view.pageSize}
      storyMenu={storyMenu}
      stories={stories}
    />
  );
}

SavedTemplatesGridView.propTypes = {
  stories: StoriesPropType,
  view: ViewPropTypes,
};
export default SavedTemplatesGridView;
