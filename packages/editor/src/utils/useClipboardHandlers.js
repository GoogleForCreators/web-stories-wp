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
import { useEffect } from 'react';

const BLACKLIST_CLIPBOARD_ELEMENTS = ['INPUT', 'TEXTAREA', 'BUTTON'];

/**
 * @param {?Element} container
 * @param {function(!ClipboardEvent)} copyCutHandler
 * @param {function(!ClipboardEvent)} pasteHandler
 */
function useClipboardHandlers(container, copyCutHandler, pasteHandler) {
  useEffect(() => {
    if (!container) {
      return undefined;
    }

    const copyCutHandlerWrapper = (evt) => {
      const { target, clipboardData } = evt;

      // Elements that either handle their own clipboard or use platform.
      if (!isCopyPasteTarget(target)) {
        return;
      }

      // A target can be anywhere in the container's full subtree, but not
      // in its siblings.
      if (!container.contains(target) && !target.contains(container)) {
        return;
      }

      // Someone has already put something in the clipboard. Do not override.
      if (clipboardData.types.length !== 0) {
        return;
      }

      copyCutHandler(evt);
    };

    const pasteHandlerWrapper = (evt) => {
      const { target } = evt;

      // Elements that either handle their own clipboard or use platform.
      if (!isCopyPasteTarget(target)) {
        return;
      }

      // A target can be anywhere in the container's full subtree, but not
      // in its siblings.
      if (!container.contains(target) && !target.contains(container)) {
        return;
      }

      pasteHandler(evt);
    };

    document.addEventListener('copy', copyCutHandlerWrapper);
    document.addEventListener('cut', copyCutHandlerWrapper);
    document.addEventListener('paste', pasteHandlerWrapper);
    return () => {
      document.removeEventListener('copy', copyCutHandlerWrapper);
      document.removeEventListener('cut', copyCutHandlerWrapper);
      document.removeEventListener('paste', pasteHandlerWrapper);
    };
  }, [container, copyCutHandler, pasteHandler]);
}

/**
 * @param {?Element} target
 * @return {boolean} Where the target can be used for copy/paste. This mainly
 * ignores platform level targets.
 */
function isCopyPasteTarget(target) {
  return (
    target &&
    !BLACKLIST_CLIPBOARD_ELEMENTS.includes(target.tagName) &&
    !target.closest('[contenteditable="true"]')
  );
}

export default useClipboardHandlers;
