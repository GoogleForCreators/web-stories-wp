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
import { useLayoutEffect } from 'react';

function useFocusOut(ref, callback, deps) {
  useLayoutEffect(() => {
    let isFocused = false;
    const node = ref.current;
    if (!node) {
      return undefined;
    }

    const onFocusOut = (evt) => {
      // If focus moves somewhere outside the node, callback time!
      if (evt.relatedTarget && !node.contains(evt.relatedTarget)) {
        isFocused = false;
        callback();
      }
    };

    const onFocusIn = () => {
      isFocused = true;
    };

    const onDocumentClick = (evt) => {
      // If something outside the target node is clicked, callback time!
      const isInDocument = node.ownerDocument.contains(evt.target);
      const isInNode = node.contains(evt.target);
      if (!isInNode && isInDocument) {
        isFocused = false;
        callback();
      }
      // Handle text element editor case (3P library with auto-focus)
      const activeElementInNode = node.contains(document.activeElement);
      if (activeElementInNode) {
        isFocused = true;
      }
    };

    node.addEventListener('focusout', onFocusOut);
    node.addEventListener('focusin', onFocusIn);
    node.ownerDocument.addEventListener('click', onDocumentClick);

    return () => {
      // When element is focused and is now being removed, callback time!
      if (isFocused) {
        callback();
      }

      node.removeEventListener('focusout', onFocusOut);
      node.ownerDocument.removeEventListener('click', onDocumentClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps || []);
}

export default useFocusOut;
