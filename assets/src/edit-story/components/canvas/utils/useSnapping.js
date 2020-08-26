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
  const { canvasWidth, canvasHeight } = useCanvas(
    ({
      state: {
        pageSize: { width: canvasWidth, height: canvasHeight },
      },
    }) => ({ canvasWidth, canvasHeight })
  );

  // ⌘ key disables snapping
  const snapDisabled = useGlobalIsKeyPressed('meta');
  canSnap = canSnap && !snapDisabled;
  return {
    snappable: canSnap,
    snapHorizontal: canSnap,
    snapVertical: canSnap,
    snapCenter: canSnap,
    horizontalGuidelines: canSnap ? [0, canvasHeight / 2, canvasHeight] : [],
    verticalGuidelines: canSnap ? [0, canvasWidth / 2, canvasWidth] : [],
    elementGuidelines: canSnap ? otherNodes : [],
    snapGap: canSnap,
    isDisplaySnapDigit: false,
  };
}

export default useSnapping;
