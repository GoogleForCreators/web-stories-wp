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
import { useEffect } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import nativeCopyPasteExpected from './nativeCopyPasteExpected';

type HandlerCallback = (event: ClipboardEvent) => void;

/**
 * @param copyCutHandler Copy & Cut handler.
 * @param pasteHandler Paste handler.
 */
function useGlobalClipboardHandlers(
  copyCutHandler: HandlerCallback,
  pasteHandler: HandlerCallback
) {
  useEffect(() => {
    const copyCutHandlerWrapper = (evt: ClipboardEvent) => {
      const { clipboardData } = evt;

      // Elements that either handle their own clipboard or have selection.
      if (nativeCopyPasteExpected()) {
        return;
      }

      // Someone has already put something in the clipboard. Do not override.
      if (clipboardData?.types?.length) {
        return;
      }

      copyCutHandler(evt);
    };

    // We always use global handler for pasting.
    const pasteHandlerWrapper = (evt: ClipboardEvent) => {
      if (!nativeCopyPasteExpected()) {
        pasteHandler(evt);
      }
    };

    document.addEventListener('copy', copyCutHandlerWrapper);
    document.addEventListener('cut', copyCutHandlerWrapper);
    document.addEventListener('paste', pasteHandlerWrapper);
    return () => {
      document.removeEventListener('copy', copyCutHandlerWrapper);
      document.removeEventListener('cut', copyCutHandlerWrapper);
      document.removeEventListener('paste', pasteHandlerWrapper);
    };
  }, [copyCutHandler, pasteHandler]);
}

export default useGlobalClipboardHandlers;
