/*
 * Copyright 2021 Google LLC
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
import { useCallback, useRef, useContextSelector } from '@web-stories-wp/react';
/**
 * Internal dependencies
 */
import Context from './context';
import { RECT_OBSERVATION_KEY } from './constants';

/**
 * Returns a ref that when applied to an element, stores the elements
 * bounding box info. Can retrieve the relevant bounding box info like so:
 * ```js
 * const boundingBox = useCanvasBoundingBox(CANVAS_BOUNDING_BOX_IDS[<some_bounding_box_id>])
 * ```
 *
 * @param {string} boundingBoxId a value from CANVAS_BOUNDING_BOX_IDS
 * @return {Function} a callback ref
 */
export function useCanvasBoundingBoxRef(boundingBoxId) {
  const clientRectObserver = useContextSelector(
    Context,
    ({ state }) => state.clientRectObserver
  );
  const ref = useRef(null);
  return useCallback(
    (node) => {
      if (ref.current) {
        clientRectObserver.unobserve?.(ref.current);
      }

      if (node) {
        node.dataset[RECT_OBSERVATION_KEY] = boundingBoxId;
        clientRectObserver.observe(node);
      }

      ref.current = node;
    },
    [clientRectObserver, boundingBoxId]
  );
}

/**
 * Returns the bounding box associated with the relative CANVAS_BOUNDING_BOX_IDS
 *
 * @param {string} boundingBoxId a value from CANVAS_BOUNDING_BOX_IDS
 * @return {Object} bounding box associated with `boundingBoxId`
 */
export function useCanvasBoundingBox(boundingBoxId) {
  return useContextSelector(
    Context,
    ({ state }) => state.boundingBoxes?.[boundingBoxId]
  );
}
