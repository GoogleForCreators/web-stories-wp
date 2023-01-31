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
import { elementIs } from '@googleforcreators/elements';
/**
 * Internal dependencies
 */
import { useStory } from '../../story';
import useLocalMedia from '../../media/local/useLocalMedia';
import { getCropParams } from '../../../utils/getCropParams';

/**
 * Creates the right click menu layer actions.
 *
 * Exposes two booleans:
 * - `canElementMoveBackwards`
 * - `canElementMoveForwards`
 *
 * These define the ability of the element to move in the layers.
 *
 * @return Right click menu layer actions
 */
const useLayerActions = () => {
  const { cropExistingVideo } = useLocalMedia(
    ({ actions: { cropExistingVideo } }) => ({
      cropExistingVideo,
    })
  );

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
    elementIs.backgroundable(selectedElement) &&
    !selectedElement.isBackground &&
    elementPosition > 1;
  const canElementMoveForwards =
    elementIs.backgroundable(selectedElement) &&
    !selectedElement.isBackground &&
    elementPosition < elements.length - 1;

  /**
   * Send element one layer backwards, if possible.
   */
  const handleSendBackward = useCallback(() => {
    if (!canElementMoveBackwards || !selectedElement) {
      return;
    }

    const backwardPositionSkipGroups = elements.findLastIndex(
      (el, position) => position < elementPosition && !el.groupId
    );
    const newPosition =
      elementPosition === 1 ? elementPosition : backwardPositionSkipGroups;

    if (arrangeElement) {
      arrangeElement({
        elementId: selectedElement.id,
        position: newPosition,
      });
    }

    void trackEvent('context_menu_action', {
      name: 'send_backward',
      element: selectedElement.type,
      isBackground:
        elementIs.backgroundable(selectedElement) &&
        selectedElement.isBackground,
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
    if (!canElementMoveBackwards || !selectedElement) {
      return;
    }

    if (arrangeElement) {
      arrangeElement({
        elementId: selectedElement.id,
        position: 1,
      });
    }

    void trackEvent('context_menu_action', {
      name: 'send_to_back',
      element: selectedElement.type,
    });
  }, [arrangeElement, canElementMoveBackwards, selectedElement]);

  /**
   * Bring element one layer forwards, if possible.
   */
  const handleBringForward = useCallback(() => {
    if (!canElementMoveForwards || !selectedElement) {
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

    if (arrangeElement) {
      arrangeElement({
        elementId: selectedElement.id,
        position: newPosition,
      });
    }

    void trackEvent('context_menu_action', {
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
    if (!canElementMoveForwards || !selectedElement) {
      return;
    }

    if (arrangeElement) {
      arrangeElement({
        elementId: selectedElement.id,
        position: elements.length - 1,
      });
    }

    void trackEvent('context_menu_action', {
      name: 'bring_to_front',
      element: selectedElement.type,
    });
  }, [arrangeElement, canElementMoveForwards, elements, selectedElement]);

  /**
   * Crop Video to remove off-canvas portion of the video.
   */
  const handleCropOffScreenVideo = useCallback(() => {
    if (
      cropExistingVideo &&
      selectedElement &&
      elementIs.media(selectedElement)
    ) {
      cropExistingVideo(selectedElement, getCropParams(selectedElement));
    }
  }, [selectedElement, cropExistingVideo]);

  return {
    canElementMoveBackwards,
    canElementMoveForwards,
    handleBringForward,
    handleBringToFront,
    handleSendBackward,
    handleSendToBack,
    handleCropOffScreenVideo,
  };
};

export default useLayerActions;
