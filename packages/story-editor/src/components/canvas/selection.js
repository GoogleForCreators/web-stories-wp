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
import { STORY_ANIMATION_STATE } from '@googleforcreators/animation';

/**
 * Internal dependencies
 */
import { useStory, useCanvas } from '../../app';
import SingleSelectionMoveable from './singleSelectionMoveable';
import MultiSelectionMoveable from './multiSelectionMoveable';

function Selection(props) {
  const isBackground = useStory(({ state }) => {
    return (
      state.selectedElements[0]?.id === state.currentPage?.elements?.[0]?.id
    );
  });
  const { selectedElements, isAnimating } = useStory((state) => ({
    selectedElements: state.state.selectedElements,
    isAnimating: [
      STORY_ANIMATION_STATE.PLAYING,
      STORY_ANIMATION_STATE.PLAYING_SELECTED,
      STORY_ANIMATION_STATE.SCRUBBING,
    ].includes(state.state.animationState),
  }));
  const { editingElement, lastSelectionEvent, nodesById, onMoveableMount } =
    useCanvas(
      ({
        state: {
          editingElement,
          lastSelectionEvent,
          nodesById,
          onMoveableMount,
        },
      }) => ({
        editingElement,
        lastSelectionEvent,
        nodesById,
        onMoveableMount,
      })
    );

  // No selection.
  if (selectedElements.length === 0) {
    return null;
  }

  // No need for displaying non-functional frame for selected background.
  if (isBackground) {
    return null;
  }

  // No need for displaying non-functional frame for video placeholders.
  const isVideoPlaceholder = selectedElements[0]?.resource?.isPlaceholder;
  if (isVideoPlaceholder) {
    return null;
  }

  // Do not show selection for in editing mode.
  if (editingElement || isAnimating) {
    return null;
  }

  // Single selection.
  if (selectedElements.length === 1) {
    const selectedElement = selectedElements[0];
    const target = nodesById[selectedElement.id];
    if (!target) {
      // Target not ready yet.
      return null;
    }
    return (
      <SingleSelectionMoveable
        selectedElement={selectedElement}
        targetEl={target}
        pushEvent={lastSelectionEvent}
        {...props}
        {...(onMoveableMount && { ref: onMoveableMount })}
      />
    );
  }

  // Multi-selection.
  return (
    <MultiSelectionMoveable
      selectedElements={selectedElements}
      {...props}
      {...(onMoveableMount && { ref: onMoveableMount })}
    />
  );
}

export default Selection;
