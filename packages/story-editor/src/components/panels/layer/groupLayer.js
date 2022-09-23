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
import styled from 'styled-components';
import { Icons } from '@googleforcreators/design-system';
import { memo, useCallback } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import PropTypes from 'prop-types';
import { useStory } from '../../../app';
import useGroupSelection from './useGroupSelection';
import GroupLayerActions from './groupLayerActions';
import Layer from './layer';

const GroupIconsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 48px;

  svg {
    position: relative;
    display: block;
    width: 100%;
    color: ${({ theme }) => theme.colors.fg.secondary};
  }

  /*
  * moves the click target + positioning to the left
  * this ensures a better click target for 
  * the arrow expand collapse state
  */
  transform: translateX(-12px);
  margin-right: -12px;
`;

const ChevronDown = styled(Icons.ChevronDown)`
  min-width: 32px;
  min-height: 32px;
`;

const ChevronRight = styled(Icons.ChevronDown)`
  /*
  * Using ChevronDown and rotating it here 
  * vs ChevronRightSmall to keep consistent sizing between states
  */
  min-width: 32px;
  min-height: 32px;
  transform: rotate(-90deg);
`;

function GroupLayer({ groupId }) {
  const { groups, updateGroupById } = useStory(({ actions, state }) => ({
    groups: state.currentPage.groups,
    updateGroupById: actions.updateGroupById,
  }));

  const { name, isLocked, isCollapsed } = groups[groupId];

  const { isSelected, handleClick } = useGroupSelection(groupId);

  const handleGroupArrowClick = useCallback(() => {
    updateGroupById({
      groupId,
      properties: { isCollapsed: !isCollapsed },
    });
  }, [isCollapsed, groupId, updateGroupById]);

  const GroupLayerIcon = useCallback(
    () => (
      <GroupIconsWrapper>
        {isCollapsed ? (
          <ChevronRight onClick={handleGroupArrowClick} />
        ) : (
          <ChevronDown onClick={handleGroupArrowClick} />
        )}
        <Icons.Group />
      </GroupIconsWrapper>
    ),
    [handleGroupArrowClick, isCollapsed]
  );

  return (
    <Layer
      id={groupId}
      handleNewLayerName={(newLayerName) =>
        updateGroupById({
          groupId,
          properties: {
            name: newLayerName,
          },
        })
      }
      layerName={name}
      handleClick={handleClick}
      isSelected={isSelected}
      LayerIcon={GroupLayerIcon}
      hasLayerLockIcon={isLocked}
      LayerLockIcon={Icons.LockClosed}
      actions={<GroupLayerActions groupId={groupId} />}
    />
  );
}

GroupLayer.propTypes = {
  groupId: PropTypes.string.isRequired,
};

export default memo(GroupLayer);
