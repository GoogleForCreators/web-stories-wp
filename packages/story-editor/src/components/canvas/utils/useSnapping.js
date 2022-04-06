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
import { useCallback } from '@googleforcreators/react';
import { FULLBLEED_RATIO } from '@googleforcreators/units';

/**
 * Internal dependencies
 */
import { useDropTargets } from '../../dropTargets';
import {
  useCanvas,
  useLayout,
  useUserOnboarding,
  CANVAS_BOUNDING_BOX_IDS,
  useCanvasBoundingBox,
} from '../../../app';

function useSnapping({
  canSnap,
  otherNodes,
  snappingOffsetX = null,
  isDragging,
}) {
  const canvasRect = useCanvasBoundingBox(
    CANVAS_BOUNDING_BOX_IDS.CANVAS_CONTAINER
  );
  const pageRect = useCanvasBoundingBox(CANVAS_BOUNDING_BOX_IDS.PAGE_CONTAINER);
  const designSpaceGuideline = useCanvas(
    ({ state }) => state.designSpaceGuideline
  );
  const { pageWidth, pageHeight } = useLayout(
    ({ state: { pageWidth, pageHeight } }) => ({
      pageWidth,
      pageHeight,
    })
  );
  const { activeDropTargetId, isDropTargetingDisabled } = useDropTargets(
    ({ state }) => ({
      activeDropTargetId: state.activeDropTargetId,
      isDropTargetingDisabled: state.isDropTargetingDisabled,
    })
  );

  const triggerOnboarding = useUserOnboarding(({ SAFE_ZONE }) => SAFE_ZONE);

  // Drop-targeting is disabled with ⌘ key, we also disable snapping in this case.
  canSnap = canSnap && !isDropTargetingDisabled && !activeDropTargetId;

  const handleSnap = useCallback(
    ({ elements }) => {
      const isSnappingDesignSpace = elements
        .flat()
        .some(
          ({ center, element }) => element === designSpaceGuideline && !center
        );
      if (isDragging && isSnappingDesignSpace) {
        triggerOnboarding();
      }
    },
    [isDragging, designSpaceGuideline, triggerOnboarding]
  );

  if (!canvasRect || !pageRect) {
    return {};
  }

  const canvasOffsetX = snappingOffsetX ? snappingOffsetX : canvasRect.x;

  const offsetX = Math.ceil(pageRect.x - canvasOffsetX);
  const offsetY = Math.floor(pageRect.y - canvasRect.y);

  const verticalGuidelines = canSnap
    ? [offsetX, offsetX + pageWidth / 2, offsetX + pageWidth]
    : [];

  const fullBleedOffset = (pageWidth / FULLBLEED_RATIO - pageHeight) / 2;

  const horizontalGuidelines = canSnap
    ? [
        offsetY - fullBleedOffset,
        offsetY,
        offsetY + pageHeight / 2,
        offsetY + pageHeight,
        offsetY + pageHeight + fullBleedOffset,
      ]
    : [];

  const elementGuidelines = canSnap
    ? [...otherNodes, designSpaceGuideline]
    : [];

  const snapDirections = {
    left: true,
    top: true,
    right: true,
    bottom: true,
    center: true,
    middle: true,
  };

  return {
    snappable: canSnap,
    snapGap: canSnap,
    snapDirections,
    elementSnapDirections: snapDirections,
    isDisplaySnapDigit: false,
    onSnap: handleSnap,
    horizontalGuidelines,
    verticalGuidelines,
    elementGuidelines,
  };
}

export default useSnapping;
