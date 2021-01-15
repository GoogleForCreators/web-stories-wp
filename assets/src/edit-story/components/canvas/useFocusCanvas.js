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
import { useCallback } from 'react';

/**
 * Internal dependencies
 */
import { useGlobalKeyDownEffect } from '../../../design-system';

function useFocusCanvas() {
  /**
   * @param {boolean} force When true, the focus will always be
   * transfered to the canvas. Otherwise, the focus will only be transfered
   * when no other editor input is holding it.
   */
  const focusCanvas = useCallback((force = true) => {
    setTimeout(() => {
      const doc = window.document;
      if (force && doc.activeElement && doc.activeElement !== doc.body) {
        doc.activeElement.blur();
      }
      const evt = new window.FocusEvent('focusout');
      doc.dispatchEvent(evt);
    });
  }, []);

  // Globally listen for Cmd+Option+2 / Ctrl+Alt+2 for focus
  useGlobalKeyDownEffect(
    { key: 'mod+option+2', editable: true },
    () => focusCanvas(true),
    [focusCanvas]
  );

  return focusCanvas;
}

export default useFocusCanvas;
