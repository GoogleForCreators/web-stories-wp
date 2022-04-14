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
import { useIsomorphicLayoutEffect, useState } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import { LINE_LENGTH, GRADIENT_STOP_SIZE } from './constants';
import { getPageX } from './utils';

function usePointerAddStop(ref, onAdd) {
  const [tempPointerPosition, setTempPointerPosition] = useState(null);
  useIsomorphicLayoutEffect(() => {
    const node = ref.current;

    const nodeLeftEdge = node.getBoundingClientRect().left;

    const onPointerDown = (evt) => {
      if (evt.target !== node) {
        return;
      }

      // We're considering the pointer size as extra to the normal line length
      // in calculations since the pointers can be 7px "over the edge" from both sides.
      const relativePosition =
        (getPageX(evt) - nodeLeftEdge + GRADIENT_STOP_SIZE / 2) / LINE_LENGTH;
      onAdd(
        (LINE_LENGTH + GRADIENT_STOP_SIZE / 2) / LINE_LENGTH - relativePosition
      );
      setTempPointerPosition(null);
    };

    const onPointerMove = (evt) => {
      if (evt.target !== node) {
        setTempPointerPosition(null);
        return;
      }

      setTempPointerPosition(getPageX(evt) - nodeLeftEdge);
    };

    const onPointerLeave = (evt) => {
      if (evt.target === node) {
        setTempPointerPosition(null);
      }
    };

    node.addEventListener('pointermove', onPointerMove);
    node.addEventListener('pointerleave', onPointerLeave);
    node.addEventListener('pointerdown', onPointerDown);
    return () => {
      node.removeEventListener('pointermove', onPointerMove);
      node.removeEventListener('pointerleave', onPointerLeave);
      node.removeEventListener('pointerdown', onPointerDown);
    };
  }, [ref, onAdd]);

  return tempPointerPosition;
}

export default usePointerAddStop;
