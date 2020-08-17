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
 * Internal dependencies
 */
import { STORY_ANIMATION_STATE } from '../../../dashboard/constants';
import { useStory } from '../../app';
import useCanvas from '../canvas/useCanvas';
import SingleSelectionMoveable from './singleSelectionMoveable';
import MultiSelectionMoveable from './multiSelectionMoveable';

function Selection() {
  const { selectedElements, isAnimating } = useStory((state) => ({
    selectedElements: state.state.selectedElements,
    isAnimating: [
      STORY_ANIMATION_STATE.PLAYING,
      STORY_ANIMATION_STATE.SCRUBBING,
    ].includes(state.state.animationState),
  }));
  const { editingElement, lastSelectionEvent, nodesById } = useCanvas(
    ({ state: { editingElement, lastSelectionEvent, nodesById } }) => ({
      editingElement,
      lastSelectionEvent,
      nodesById,
    })
  );

  // Do not show selection for in editing mode.
  if (editingElement || isAnimating) {
    return null;
  }

  // No selection.
  if (selectedElements.length === 0) {
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
      />
    );
  }

  // Multi-selection.
  return <MultiSelectionMoveable selectedElements={selectedElements} />;
}

export default Selection;
