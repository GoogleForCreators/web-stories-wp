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
import { useCallback, useEffect, useMemo } from 'react';

/**
 * Internal dependencies
 */
import {
  PAGE_WIDTH,
  PAGE_HEIGHT,
  FULLBLEED_RATIO,
  OVERFLOW_HEIGHT,
} from '../../../constants';
import { useGlobalIsKeyPressed } from '../../keyboard';
import { useDropTargets } from '../../dropTargets';
import useCanvas from '../useCanvas';

function isNear(a, b) {
  return Math.abs(a - b) < 3;
}

function selectNearest(coord, candidates, otherwise = null) {
  const result = candidates.find(([key]) => isNear(coord, key));
  return result?.[1] ?? otherwise;
}

function getRelativeRect(target, container) {
  const containerRect = container.getBoundingClientRect();
  let targetRect;
  if (Array.isArray(target)) {
    // TODO handle array
    targetRect = {};
  } else {
    targetRect = target.getBoundingClientRect();
  }
  return {
    top: Math.round(targetRect.top) - containerRect.top,
    right: Math.round(targetRect.right) - containerRect.left,
    bottom: Math.round(targetRect.bottom) - containerRect.top,
    left: Math.round(targetRect.left) - containerRect.left,
  };
}

function getSnappingElements(elements, gaps) {
  // If there are any gap snaps, remove all elements snapping in this dimension
  // otherwise use them all
  const allElements = elements.flat();
  if (gaps.length) {
    return allElements.filter(({ type }) => type !== gaps[0].type);
  }
  return allElements;
}

function useSnapping({
  ref,
  target,
  selectedElement,
  pushTransform,
  isDragging,
  canSnap,
  otherNodes,
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

  const getSnapCoord = useCallback(
    ({ type, pos, element }) => {
      if (!element.dataset.top) {
        return null;
      }
      const targetRect = getRelativeRect(target, ref.current.props.container);
      const elementRect = getRelativeRect(element, ref.current.props.container);
      switch (type) {
        case 'vertical': {
          const snappingSide = selectNearest(
            pos[0],
            [
              [targetRect.left, 'left'],
              [targetRect.right, 'right'],
            ],
            'center'
          );
          const coordinate = selectNearest(
            pos[0],
            [
              [elementRect.left, element.dataset.left],
              [elementRect.right, element.dataset.right],
            ],
            element.dataset.center
          );
          return {
            [snappingSide]: parseInt(coordinate),
          };
        }
        case 'horizontal': {
          const snappingSide = selectNearest(
            pos[1],
            [
              [targetRect.top, 'top'],
              [targetRect.bottom, 'bottom'],
            ],
            'middle'
          );
          const coordinate = selectNearest(
            pos[1],
            [
              [elementRect.top, element.dataset.top],
              [elementRect.bottom, element.dataset.bottom],
            ],
            element.dataset.middle
          );
          return {
            [snappingSide]: parseInt(coordinate),
          };
        }
        default:
          // Should never happen
          return null;
      }
    },
    [target, ref]
  );

  const { verticalGuidelines, horizontalGuidelines } = useMemo(() => {
    if (!canSnap) {
      return {
        verticalGuidelines: [],
        horizontalGuidelines: [],
      };
    }

    const canvasRect = canvasContainer.getBoundingClientRect();
    const pageRect = pageContainer.getBoundingClientRect();
    const offsetX = Math.ceil(pageRect.x - canvasRect.x);
    const offsetY = Math.floor(pageRect.y - canvasRect.y);
    const fullBleedOffset = (canvasWidth / FULLBLEED_RATIO - canvasHeight) / 2;
    return {
      verticalGuidelines: [
        offsetX,
        offsetX + canvasWidth / 2,
        offsetX + canvasWidth,
      ],
      horizontalGuidelines: [
        offsetY - fullBleedOffset,
        offsetY,
        offsetY + canvasHeight / 2,
        offsetY + canvasHeight,
        offsetY + canvasHeight + fullBleedOffset,
      ],
    };
  }, [canSnap, canvasHeight, canvasWidth, canvasContainer, pageContainer]);

  const getGuidelineCoord = useCallback(
    ({ type, pos }) => {
      if (!verticalGuidelines.length && !horizontalGuidelines) {
        return null;
      }
      const targetRect = getRelativeRect(target, ref.current.props.container);
      switch (type) {
        case 'vertical': {
          const snappingSide = selectNearest(
            pos[0],
            [
              [targetRect.left, 'left'],
              [targetRect.right, 'right'],
            ],
            'center'
          );
          const coordinate = selectNearest(pos[0], [
            [verticalGuidelines[0], 0],
            [verticalGuidelines[1], PAGE_WIDTH / 2],
            [verticalGuidelines[2], PAGE_WIDTH],
          ]);
          return {
            [snappingSide]: coordinate,
          };
        }
        case 'horizontal': {
          const snappingSide = selectNearest(
            pos[1],
            [
              [targetRect.top, 'top'],
              [targetRect.bottom, 'bottom'],
            ],
            'middle'
          );
          const coordinate = selectNearest(pos[1], [
            [horizontalGuidelines[0], -OVERFLOW_HEIGHT],
            [horizontalGuidelines[1], 0],
            [horizontalGuidelines[2], PAGE_HEIGHT / 2],
            [horizontalGuidelines[3], PAGE_HEIGHT],
            [horizontalGuidelines[4], PAGE_HEIGHT + OVERFLOW_HEIGHT],
          ]);
          return {
            [snappingSide]: coordinate,
          };
        }
        default:
          // Should never happen
          return null;
      }
    },
    [verticalGuidelines, horizontalGuidelines, ref, target]
  );

  const handleSnap = useCallback(
    ({ elements, guidelines, gaps }) => {
      // Only use this snapping transform for non-rotated elements
      if (selectedElement.rotationAngle === 0) {
        const snappingElements = getSnappingElements(elements, gaps);
        const regularAssign = (aggr, o) => ({ ...aggr, ...o });
        const reverseAssign = (aggr, o) => ({ ...o, ...aggr });
        // Gather all the snapping coordinates from elements
        // but give preference to the first found matches
        const elementSnapCoords = snappingElements
          .map(getSnapCoord)
          .reduce(reverseAssign, {});
        // Override with snapping coordinates from guidelines if any
        const snapCoords = guidelines
          .map(getGuidelineCoord)
          .reduce(regularAssign, elementSnapCoords);

        // Now store this for transform
        pushTransform(selectedElement.id, { snap: snapCoords });
      }
      // Show design space if we're snapping to any of its edges
      toggleDesignSpace(
        elements
          .flat()
          .some(
            ({ center, element }) => element === designSpaceGuideline && !center
          )
      );
    },
    [
      toggleDesignSpace,
      designSpaceGuideline,
      getSnapCoord,
      getGuidelineCoord,
      pushTransform,
      selectedElement,
    ]
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
