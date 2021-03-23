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
import { useCallback, useEffect } from 'react';

/**
 * Internal dependencies
 */
import { FULLBLEED_RATIO } from '../../../constants';
import { useGlobalIsKeyPressed } from '../../../../design-system';
import { useDropTargets } from '../../dropTargets';
import { useCanvas } from '../../../app';

function useSnapping({
  isDragging,
  canSnap,
  otherNodes,
  snappingOffsetX = null,
}) {
  const {
    canvasWidth,
    canvasHeight,
    pageContainer,
    canvasContainer,
    designSpaceGuideline,
  } = useCanvas(
    ({
      state: {
        pageSize: { width: canvasWidth, height: canvasHeight },
        pageContainer,
        canvasContainer,
        designSpaceGuideline,
      },
    }) => ({
      canvasWidth,
      canvasHeight,
      pageContainer,
      canvasContainer,
      designSpaceGuideline,
    })
  );
  const { activeDropTargetId } = useDropTargets((state) => ({
    activeDropTargetId: state.state.activeDropTargetId,
  }));

  // ⌘ key disables snapping
  const snapDisabled = useGlobalIsKeyPressed('meta');
  canSnap = canSnap && !snapDisabled && !activeDropTargetId;

  const toggleDesignSpace = useCallback(
    (visible) => {
      if (designSpaceGuideline) {
        designSpaceGuideline.style.visibility = visible ? 'visible' : 'hidden';
      }
    },
    [designSpaceGuideline]
  );
  const handleSnap = useCallback(
    ({ elements }) =>
      // Show design space if we're snapping to any of its edges
      toggleDesignSpace(
        isDragging &&
          elements
            .flat()
            .some(
              ({ center, element }) =>
                element === designSpaceGuideline && !center
            )
      ),
    [toggleDesignSpace, isDragging, designSpaceGuideline]
  );

  // Always hide design space guideline when dragging stops
  useEffect(() => {
    if (!isDragging) {
      toggleDesignSpace(false);
    }
  }, [isDragging, toggleDesignSpace]);

  if (!canvasContainer || !pageContainer) {
    return {};
  }

  const canvasRect = canvasContainer.getBoundingClientRect();
  const pageRect = pageContainer.getBoundingClientRect();

  const canvasOffsetX = snappingOffsetX ? snappingOffsetX : canvasRect.x;

  const offsetX = Math.ceil(pageRect.x - canvasOffsetX);
  const offsetY = Math.floor(pageRect.y - canvasRect.y);

  const verticalGuidelines = canSnap
    ? [offsetX, offsetX + canvasWidth / 2, offsetX + canvasWidth]
    : [];

  const fullBleedOffset = (canvasWidth / FULLBLEED_RATIO - canvasHeight) / 2;

  const horizontalGuidelines = canSnap
    ? [
        offsetY - fullBleedOffset,
        offsetY,
        offsetY + canvasHeight / 2,
        offsetY + canvasHeight,
        offsetY + canvasHeight + fullBleedOffset,
      ]
    : [];

  const elementGuidelines = canSnap
    ? [...otherNodes, designSpaceGuideline]
    : [];

  return {
    snappable: canSnap,
    snapHorizontal: canSnap,
    snapVertical: canSnap,
    snapCenter: canSnap,
    snapGap: canSnap,
    isDisplaySnapDigit: false,
    onSnap: handleSnap,
    horizontalGuidelines,
    verticalGuidelines,
    elementGuidelines,
  };
}

export default useSnapping;
