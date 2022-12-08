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
import { memo, useMemo, useCallback } from '@googleforcreators/react';
import { getDefinitionForType } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import { StoryPropTypes } from '../../../propTypes';
import { useStory } from '../../../app';
import { TRACKING_EVENTS } from '../../../constants';
import useShapeMask from '../../../utils/useShapeMask';
import LayerAction from './layerAction';

function ElementLayerActions({ element }) {
  const { hasDuplicateMenu } = getDefinitionForType(element.type);

  const { duplicateElementsById, updateElementById, deleteElementById } =
    useStory(({ actions }) => ({
      duplicateElementsById: actions.duplicateElementsById,
      deleteElementById: actions.deleteElementById,
      updateElementById: actions.updateElementById,
    }));

  const { hasShapeMask, removeShapeMask } = useShapeMask(element);
  const removeMaskTitle = __('Unmask', 'web-stories');

  const isNested = Boolean(element.groupId);
  const { isLocked, isHidden } = element;

  const lockTitle = useMemo(
    () =>
      isNested
        ? isLocked
          ? __('Group is Locked', 'web-stories')
          : __('Group is Unlocked', 'web-stories')
        : isLocked
        ? __('Unlock Layer', 'web-stories')
        : __('Lock Layer', 'web-stories'),
    [isLocked, isNested]
  );
  const visibilityTitle = isHidden
    ? __('Show Layer', 'web-stories')
    : __('Hide Layer', 'web-stories');

  const handleDeleteElement = useCallback(
    () => deleteElementById({ elementId: element.id }),
    [deleteElementById, element.id]
  );

  const handleDuplicateElement = useCallback(
    () => duplicateElementsById({ elementIds: [element.id] }),
    [duplicateElementsById, element.id]
  );

  const handleLockElement = useCallback(
    () =>
      updateElementById({
        elementId: element.id,
        properties: { isLocked: !isLocked },
      }),
    [element.id, isLocked, updateElementById]
  );

  const handleHideElement = useCallback(
    () =>
      updateElementById({
        elementId: element.id,
        properties: { isHidden: !isHidden },
      }),
    [element.id, isHidden, updateElementById]
  );

  const LockIcon = isLocked ? Icons.LockClosed : Icons.LockOpen;
  const VisibilityIcon = isHidden ? Icons.VisibilityOff : Icons.Visibility;

  return (
    <>
      <LayerAction
        isActive={hasShapeMask}
        label={removeMaskTitle}
        handleClick={removeShapeMask}
      >
        <Icons.RemoveMask />
      </LayerAction>
      <LayerAction
        label={__('Delete Layer', 'web-stories')}
        handleClick={handleDeleteElement}
        trackingData={{
          ...TRACKING_EVENTS.DELETE_ELEMENT,
          label: element.type,
        }}
      >
        <Icons.Trash />
      </LayerAction>
      <LayerAction
        isActive={hasDuplicateMenu}
        label={__('Duplicate Layer', 'web-stories')}
        handleClick={handleDuplicateElement}
      >
        <Icons.PagePlus />
      </LayerAction>
      <LayerAction label={visibilityTitle} handleClick={handleHideElement}>
        <VisibilityIcon />
      </LayerAction>
      <LayerAction
        label={lockTitle}
        disabled={isNested}
        handleClick={handleLockElement}
      >
        {isNested ? <Icons.LockFilledClosed /> : <LockIcon />}
      </LayerAction>
    </>
  );
}

ElementLayerActions.propTypes = {
  element: StoryPropTypes.element.isRequired,
};

export default memo(ElementLayerActions);
