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
import { __ } from '@googleforcreators/i18n';
import { Icons } from '@googleforcreators/design-system';
import { memo, useCallback } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { useStory } from '../../../app';
import generateGroupName from '../../../utils/generateGroupName';
import LayerAction from './layerAction';

function GroupLayerActions({ groupId }) {
  const {
    groups,
    updateGroupById,
    deleteGroupAndElementsById,
    updateElementsById,
    duplicateGroupById,
    groupLayers,
  } = useStory(({ actions, state }) => ({
    groups: state.currentPage.groups,
    updateGroupById: actions.updateGroupById,
    deleteGroupAndElementsById: actions.deleteGroupAndElementsById,
    updateElementsById: actions.updateElementsById,
    duplicateGroupById: actions.duplicateGroupById,
    groupLayers: state.currentPage.elements.filter(
      (el) => el.groupId === groupId
    ),
  }));

  const DEFAULT_NAME = 'Undefined Layer';
  const DEFAULT_IS_LOCKED = false;
  const DEFAULT_IS_COLLAPSED = false;

  let group = {
    name: DEFAULT_NAME,
    isLocked: DEFAULT_IS_LOCKED,
    isCollapsed: DEFAULT_IS_COLLAPSED,
  };

  if (groups && groups[groupId]) {
    group = groups[groupId];
  }

  const allLayersHidden = groupLayers.every((layer) => layer.isHidden);

  const visibilityTitle = allLayersHidden
    ? __('Show Group', 'web-stories')
    : __('Hide Group', 'web-stories');
  const lockTitle = group.isLocked
    ? __('Unlock Group', 'web-stories')
    : __('Lock Group', 'web-stories');

  const { name, isLocked, isCollapsed } = group;

  const handleHideGroup = useCallback(() => {
    updateElementsById({
      elementIds: groupLayers.map((layer) => layer.id),
      properties: { isHidden: !allLayersHidden },
    });
  }, [allLayersHidden, groupLayers, updateElementsById]);

  const handleLockGroup = useCallback(() => {
    updateGroupById({
      groupId,
      properties: { isLocked: !isLocked },
    });
    updateElementsById({
      elementIds: groupLayers.map((layer) => layer.id),
      properties: { isLocked: !isLocked },
    });
  }, [groupId, groupLayers, isLocked, updateElementsById, updateGroupById]);

  const handleDuplicateGroup = useCallback(() => {
    const newGroupId = uuidv4();
    const newGroupName = generateGroupName(groups, name);
    duplicateGroupById({
      oldGroupId: groupId,
      groupId: newGroupId,
      name: newGroupName,
      isLocked: isLocked,
      isCollapsed: isCollapsed,
    });
  }, [duplicateGroupById, name, isLocked, isCollapsed, groupId, groups]);

  const handleDeleteGroup = useCallback(
    () => deleteGroupAndElementsById({ groupId }),
    [groupId, deleteGroupAndElementsById]
  );

  const VisibilityIcon = allLayersHidden
    ? Icons.VisibilityOff
    : Icons.Visibility;

  return (
    <>
      <LayerAction
        label={__('Delete Group', 'web-stories')}
        handleClick={handleDeleteGroup}
      >
        <Icons.Trash />
      </LayerAction>

      <LayerAction
        label={__('Duplicate Group', 'web-stories')}
        handleClick={handleDuplicateGroup}
      >
        <Icons.PagePlus />
      </LayerAction>

      <LayerAction label={visibilityTitle} handleClick={handleHideGroup}>
        <VisibilityIcon />
      </LayerAction>

      <LayerAction label={lockTitle} handleClick={handleLockGroup}>
        {isLocked ? <Icons.LockClosed /> : <Icons.LockOpen />}
      </LayerAction>
    </>
  );
}

GroupLayerActions.propTypes = {
  groupId: PropTypes.string.isRequired,
};

export default memo(GroupLayerActions);
