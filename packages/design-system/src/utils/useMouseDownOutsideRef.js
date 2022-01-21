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
import { useRef, useCallback } from '@googleforcreators/react';
/**
 * Internal dependencies
 */
import { noop } from './noop';

/**
 * Takes a handler for mouseDownOutside event and returns a ref
 * to attach to the desired element you want to detect outside
 * mouse down events
 *
 * @param {Function} onMouseDownOutside handler for mousedown outside
 * @return {Object} ref to pass to desired element
 */
function useMouseDownOutsideRef(onMouseDownOutside = noop) {
  const targetRef = useRef(null);
  // store handler outside of useCallback so we have the
  // proper references when removing listeners
  const handleDocumentClickCaptureRef = useRef(noop);
  const onMouseDownOutsideRef = useRef(onMouseDownOutside);
  onMouseDownOutsideRef.current = onMouseDownOutside;

  return useCallback((node) => {
    // clean up listeners associated with the previous node
    if (targetRef.current) {
      document.removeEventListener(
        'mousedown',
        handleDocumentClickCaptureRef.current,
        true
      );
    }

    // create and attach listeners with new node
    if (node) {
      handleDocumentClickCaptureRef.current = (evt) => {
        if (node === evt.target || node.contains(evt.target)) {
          return;
        }
        onMouseDownOutsideRef.current?.(evt);
      };

      document.addEventListener(
        'mousedown',
        handleDocumentClickCaptureRef.current,
        true
      );
    }

    targetRef.current = node;
  }, []);
}

export default useMouseDownOutsideRef;
