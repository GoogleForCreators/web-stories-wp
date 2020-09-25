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
import { useGlobalIsKeyPressed } from '../../keyboard';
import useCanvas from '../useCanvas';

function useSnapping({ canSnap, otherNodes }) {
  const {
    canvasWidth,
    canvasHeight,
    pageContainer,
    canvasContainer,
  } = useCanvas(
    ({
      state: {
        pageSize: { width: canvasWidth, height: canvasHeight },
        pageContainer,
        canvasContainer,
      },
    }) => ({ canvasWidth, canvasHeight, pageContainer, canvasContainer })
  );

  // ⌘ key disables snapping
  const snapDisabled = useGlobalIsKeyPressed('meta');
  canSnap = canSnap && !snapDisabled;

  if (!canvasContainer || !pageContainer) {
    return {};
  }

  const canvasRect = canvasContainer.getBoundingClientRect();
  const pageRect = pageContainer.getBoundingClientRect();

  const offsetX = Math.ceil(pageRect.x - canvasRect.x);
  const offsetY = Math.floor(pageRect.y - canvasRect.y);

  const verticalGuidelines = canSnap
    ? [offsetX, offsetX + canvasWidth / 2, offsetX + canvasWidth]
    : [];

  const horizontalGuidelines = canSnap
    ? [offsetY, offsetY + canvasHeight / 2, offsetY + canvasHeight]
    : [];

  const elementGuidelines = canSnap ? otherNodes : [];
  return {
    snappable: canSnap,
    snapHorizontal: canSnap,
    snapVertical: canSnap,
    snapCenter: canSnap,
    snapGap: canSnap,
    isDisplaySnapDigit: false,
    horizontalGuidelines,
    verticalGuidelines,
    elementGuidelines,
  };
}

export default useSnapping;
