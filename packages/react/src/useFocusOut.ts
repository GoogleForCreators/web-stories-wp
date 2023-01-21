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
import type { DependencyList, RefObject } from 'react';

function useFocusOut(
  ref: RefObject<HTMLElement>,
  callback: (evt: FocusEvent | MouseEvent) => void | undefined,
  deps: DependencyList
) {
  useLayoutEffect(() => {
    const node = ref?.current;
    if (!node) {
      return undefined;
    }

    const onFocusOut = (evt: FocusEvent) => {
      // If focus moves somewhere outside the node, callback time!
      if (evt.relatedTarget && !node.contains(<HTMLElement>evt.relatedTarget)) {
        callback(evt);
      }
    };

    const onDocumentClick = (evt: MouseEvent) => {
      // If something outside the target node is clicked, callback time!
      const isInNode = node.contains(<HTMLElement>evt.target);
      if (!isInNode) {
        callback(evt);
      }
    };

    node.addEventListener('focusout', onFocusOut);
    // Often elements are removed in pointerdown handlers elsewhere, causing them
    // to fail the node.contains check regardless of being inside target ref or not.
    // By checking the click target in the capture phase, we circumvent that completely.
    const opts = { capture: true };
    const doc = node.ownerDocument;
    doc.addEventListener('pointerdown', onDocumentClick, opts);

    return () => {
      node.removeEventListener('focusout', onFocusOut);
      doc.removeEventListener('pointerdown', onDocumentClick, opts);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Pass through provided deps.
  }, deps || []);
}

export default useFocusOut;
