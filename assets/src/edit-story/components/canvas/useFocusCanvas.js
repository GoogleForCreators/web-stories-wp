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

function useFocusCanvas() {
  const focusCanvas = useCallback(() => {
    setTimeout(() => {
      const doc = window.document;
      if (doc.activeElement && doc.activeElement !== doc.body) {
        doc.activeElement.blur();
      }
      const evt = new window.FocusEvent('focusout');
      doc.dispatchEvent(evt);
    });
  }, []);
  return focusCanvas;
}

export default useFocusCanvas;
