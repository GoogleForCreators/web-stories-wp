/*
 * Copyright 2022 Google LLC
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
import { useCallback } from '@googleforcreators/react';
import { trackEvent } from '@googleforcreators/tracking';
/**
 * Internal dependencies
 */
import { useStory } from '../..';

/**
 * Creates the right click menu layer actions.
 *
 * Exposes two booleans:
 * - `canElementMoveBackwards`
 * - `canElementMoveForwards`
 *
 * These define the ability of the element to move in the layers.
 *
 * @return {Object} Right click menu layer actions
 */
const useLayerActions = () => {
  const { arrangeElement, elements, selectedElement } = useStory(
    ({ state, actions }) => ({
      arrangeElement: actions.arrangeElement,
      elements: state.currentPage?.elements || [],
      selectedElement: state.selectedElements?.[0],
    })
  );

  const elementPosition = elements.findIndex(
    ({ id }) => id === selectedElement?.id
  );

  // Non background elements may change layers.
  const canElementMoveBackwards =
    selectedElement && !selectedElement.isBackground && elementPosition > 1;
  const canElementMoveForwards =
    selectedElement &&
    !selectedElement.isBackground &&
    elementPosition < elements.length - 1;

  /**
   * Send element one layer backwards, if possible.
   */
  const handleSendBackward = useCallback(() => {
    if (!canElementMoveBackwards) {
      return;
    }

    const reversedElements = [...elements].reverse();
    const backwardPositionSkipGroups = reversedElements.findLastIndex(
      (el, i) => {
        const position = elements.length - i;
        return position > elementPosition && !el.groupId;
      }
    );
    const newPosition =
      elementPosition === 1 ? elementPosition : backwardPositionSkipGroups;

    arrangeElement({
      elementId: selectedElement.id,
      position: newPosition,
    });

    trackEvent('context_menu_action', {
      name: 'send_backward',
      element: selectedElement.type,
      isBackground: selectedElement.isBackground,
    });
  }, [
    arrangeElement,
    canElementMoveBackwards,
    elementPosition,
    selectedElement,
    elements,
  ]);

  /**
   * Send element all the way back, if possible.
   */
  const handleSendToBack = useCallback(() => {
    if (!canElementMoveBackwards) {
      return;
    }

    arrangeElement({
      elementId: selectedElement.id,
      position: 1,
    });

    trackEvent('context_menu_action', {
      name: 'send_to_back',
      element: selectedElement.type,
    });
  }, [arrangeElement, canElementMoveBackwards, selectedElement]);

  /**
   * Bring element one layer forwards, if possible.
   */
  const handleBringForward = useCallback(() => {
    if (!canElementMoveForwards) {
      return;
    }

    const forwardPositionSkipGroups = elements.findIndex(
      (el, position) =>
        (position > elementPosition && !el.groupId) ||
        position === elements.length - 1
    );
    const newPosition =
      elementPosition >= elements.length - 1
        ? elementPosition
        : forwardPositionSkipGroups;

    arrangeElement({
      elementId: selectedElement.id,
      position: newPosition,
    });

    trackEvent('context_menu_action', {
      name: 'bring_forward',
      element: selectedElement.type,
    });
  }, [
    arrangeElement,
    canElementMoveForwards,
    elementPosition,
    elements,
    selectedElement,
  ]);

  /**
   * Send element all the way to the front, if possible.
   */
  const handleBringToFront = useCallback(() => {
    if (!canElementMoveForwards) {
      return;
    }

    arrangeElement({
      elementId: selectedElement.id,
      position: elements.length - 1,
    });

    trackEvent('context_menu_action', {
      name: 'bring_to_front',
      element: selectedElement.type,
    });
  }, [arrangeElement, canElementMoveForwards, elements, selectedElement]);

  return {
    canElementMoveBackwards,
    canElementMoveForwards,
    handleBringForward,
    handleBringToFront,
    handleSendBackward,
    handleSendToBack,
  };
};

export default useLayerActions;
