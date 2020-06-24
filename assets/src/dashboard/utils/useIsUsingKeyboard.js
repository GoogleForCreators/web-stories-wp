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
import { useEffect, useState } from 'react';

/**
 * Internal dependencies
 */
import useBatchingCallback from './useBatchingCallback';

const DEFAULT_ACCEPTED_KEYS = [
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'Tab',
];

function useIsUsingKeyboard(acceptedKeys = DEFAULT_ACCEPTED_KEYS) {
  const [usingKeyboard, setUsingKeyboard] = useState(false);
  const handleKeydown = useBatchingCallback(
    (e) => {
      if (!usingKeyboard && acceptedKeys.includes(e.key)) {
        setUsingKeyboard(true);
      }
    },
    [usingKeyboard, acceptedKeys]
  );

  const handleMousedown = useBatchingCallback(() => {
    if (usingKeyboard) {
      setUsingKeyboard(false);
    }
  }, [usingKeyboard]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeydown, true /** useCapture */);
    document.addEventListener(
      'mousedown',
      handleMousedown,
      true /** useCapture */
    );
    return function cleanup() {
      document.removeEventListener(
        'keydown',
        handleKeydown,
        true /** useCapture */
      );
      document.removeEventListener(
        'mousedown',
        handleMousedown,
        true /** useCapture */
      );
    };
  });

  return usingKeyboard;
}

export default useIsUsingKeyboard;
