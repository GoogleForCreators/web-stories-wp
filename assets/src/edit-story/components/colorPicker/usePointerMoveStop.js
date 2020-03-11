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
import { useLayoutEffect, useRef } from 'react';

/**
 * Internal dependencies
 */
import { LINE_LENGTH, LINE_WIDTH } from './constants';
import {
  getPageX,
  getPageY,
  setPointerCapture,
  releasePointerCapture,
} from './utils';

function usePointerMoveStop(ref, onMove, onDelete) {
  const lastPageX = useRef(null);
  useLayoutEffect(() => {
    const node = ref.current;

    const lineY = node.getBoundingClientRect().top + LINE_WIDTH * 1.5;

    const onPointerMove = (evt) => {
      const relativeDeltaX = getPageX(evt) - lastPageX.current;
      lastPageX.current = getPageX(evt);
      onMove(relativeDeltaX / LINE_LENGTH);

      const absoluteDeltaY = Math.abs(lineY - getPageY(evt));
      if (absoluteDeltaY > 30) {
        onDelete();
        onPointerUp(evt);
      }
    };

    const onPointerUp = (evt) => {
      lastPageX.current = null;
      releasePointerCapture(evt);
      evt.target.removeEventListener('pointermove', onPointerMove);
      evt.target.removeEventListener('pointerup', onPointerUp);
    };

    const onPointerDown = (evt) => {
      if (evt.target === node) {
        return;
      }
      lastPageX.current = getPageX(evt);
      setPointerCapture(evt);
      evt.target.addEventListener('pointermove', onPointerMove);
      evt.target.addEventListener('pointerup', onPointerUp);
    };

    node.addEventListener('pointerdown', onPointerDown);
    return () => node.removeEventListener('pointerdown', onPointerDown);
  }, [ref, onMove, onDelete]);
}

export default usePointerMoveStop;
